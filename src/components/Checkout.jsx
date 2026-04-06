import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import paymentQrCode from '../assets/payment_qr_code.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Calendar,
  CheckCircle,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { query } from '@/lib/turso';


const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Billing, 2: Payment, 3: Confirmation
  const [user, setUser] = useState(null);

  // Billing Information
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'qr', // card, qr, cod
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Load cart and user info
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    setCartItems(cart);
    setUser(userData);

    // Pre-fill billing info if user is logged in
    if (userData) {
      setBillingInfo(prev => ({
        ...prev,
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.pricing?.total || item.total || 0);
    }, 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.18; // 18% GST
  };

  const calculateShipping = () => {
    return 0; // Free shipping
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax() + calculateShipping();
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateBillingInfo = () => {
    const newErrors = {};

    if (!billingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!billingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) newErrors.email = 'Invalid email format';
    if (!billingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    else {
      // Remove all non-digit characters for validation
      const phoneDigits = billingInfo.phone.replace(/\D/g, '');
      // Accept 10 digits (without country code) or 12 digits (with +91)
      if (phoneDigits.length !== 10 && phoneDigits.length !== 12) {
        newErrors.phone = 'Invalid phone number (10 digits or +91 followed by 10 digits)';
      }
    }
    if (!billingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.state.trim()) newErrors.state = 'State is required';
    if (!billingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(billingInfo.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors = {};

    if (paymentInfo.method === 'card') {
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (!/^[0-9]{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
      if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
      if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (!/^[0-9]{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = 'Invalid CVV';
    } else if (paymentInfo.method === 'qr') {
      // No validation needed for QR code scan for now
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateBillingInfo()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (validatePaymentInfo()) {
      const newOrderId = `ORD${Date.now()}`;
      setOrderId(newOrderId);

      const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email || 'guest';
      const subtotal = calculateTotal();
      const tax = calculateTax();
      const shipping = calculateShipping();
      const total = calculateGrandTotal();

      try {
        // Insert order into Turso
        await query(
          `INSERT INTO orders (order_id, user_email, items, billing_info, payment_method, subtotal, tax, shipping, total, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newOrderId,
            userEmail,
            JSON.stringify(cartItems),
            JSON.stringify(billingInfo),
            paymentInfo.method,
            subtotal,
            tax,
            shipping,
            total,
            'pending'
          ]
        );

        // Mark any car items as sold in Turso
        for (const item of cartItems) {
          if (item.type === 'car' && item.product?.id) {
            await query(
              "UPDATE cars SET stock_status = 'sold' WHERE id = ?",
              [item.product.id]
            );
          }
        }

        // Clear cart from localStorage
        localStorage.setItem('cart', JSON.stringify([]));

        setOrderPlaced(true);
        setCurrentStep(3);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('[Checkout] DB error:', err);
        alert("Failed to place order. Please try again.");
      }
    }
  };


  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation cartCount={0} />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="text-xl text-muted-foreground">Thank you for your purchase</p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="text-2xl font-bold text-primary">{orderId}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-3xl font-bold">₹{(calculateGrandTotal() / 100000).toFixed(2)}L</p>
                  </div>
                  <Separator />
                  <div className="text-left">
                    <p className="font-semibold mb-2">Delivery Address:</p>
                    <p className="text-sm">{billingInfo.fullName}</p>
                    <p className="text-sm">{billingInfo.address}</p>
                    <p className="text-sm">{billingInfo.city}, {billingInfo.state} - {billingInfo.pincode}</p>
                    <p className="text-sm">{billingInfo.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                A confirmation email has been sent to <strong>{billingInfo.email}</strong>
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/')} size="lg">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/orders')}>
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-zinc-200'}`}>
                1
              </div>
              <p className="text-sm font-semibold">Billing Info</p>
            </div>
            <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-zinc-200'}`}></div>
            <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-zinc-200'}`}>
                2
              </div>
              <p className="text-sm font-semibold">Payment</p>
            </div>
            <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-primary' : 'bg-zinc-200'}`}></div>
            <div className={`flex-1 text-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-zinc-200'}`}>
                3
              </div>
              <p className="text-sm font-semibold">Confirmation</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Billing & Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={billingInfo.fullName}
                        onChange={handleBillingChange}
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.fullName ? 'border-red-500' : 'border-border'}`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={billingInfo.email}
                        onChange={handleBillingChange}
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-border'}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={billingInfo.phone}
                        onChange={handleBillingChange}
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-border'}`}
                        placeholder="+91 XXXXXXXXXX"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Address *</label>
                      <textarea
                        name="address"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        rows="3"
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? 'border-red-500' : 'border-border'}`}
                        placeholder="House No., Street, Area"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? 'border-red-500' : 'border-border'}`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={billingInfo.state}
                        onChange={handleBillingChange}
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.state ? 'border-red-500' : 'border-border'}`}
                        placeholder="State"
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={billingInfo.pincode}
                        onChange={handleBillingChange}
                        className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.pincode ? 'border-red-500' : 'border-border'}`}
                        placeholder="6-digit pincode"
                        maxLength="6"
                      />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
                      <input
                        type="text"
                        name="landmark"
                        value={billingInfo.landmark}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </div>

                  <Button onClick={handleContinueToPayment} className="w-full mt-6" size="lg">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'card' }))}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${paymentInfo.method === 'card' ? 'border-primary bg-primary/10' : 'border-border'}`}
                      >
                        <CreditCard className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-semibold">Card</p>
                      </button>
                      <button
                        onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'qr' }))}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${paymentInfo.method === 'qr' ? 'border-primary bg-primary/10' : 'border-border'}`}
                      >
                        <QrCode className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-semibold">QR Code</p>
                      </button>
                      <button
                        onClick={() => setPaymentInfo(prev => ({ ...prev, method: 'cod' }))}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${paymentInfo.method === 'cod' ? 'border-primary bg-primary/10' : 'border-border'}`}
                      >
                        <Truck className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-semibold">COD</p>
                      </button>
                    </div>
                  </div>

                  {/* Card Payment */}
                  {paymentInfo.method === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.cardNumber ? 'border-red-500' : 'border-border'}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentChange}
                          className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.cardName ? 'border-red-500' : 'border-border'}`}
                          placeholder="Name on card"
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.expiryDate ? 'border-red-500' : 'border-border'}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            className={`w-full px-4 py-2 bg-card border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.cvv ? 'border-red-500' : 'border-border'}`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR Payment */}
                  {paymentInfo.method === 'qr' && (
                    <div className="text-center space-y-4">
                      <div className="bg-zinc-100 p-6 rounded-xl inline-block border-2 border-primary/20">
                        <img
                          src={paymentQrCode}
                          alt="Payment QR Code"
                          className="w-48 h-48 mx-auto rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="bg-zinc-50 p-4 rounded-lg border">
                        <p className="text-sm font-semibold text-black">Scan to Pay using any UPI app</p>
                        <p className="text-xs text-zinc-500 mt-1 italic">Amazon Pay, Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                  )}

                  {/* COD Message */}
                  {paymentInfo.method === 'cod' && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900 dark:text-yellow-100">Cash on Delivery</p>
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                            Pay ₹{(calculateGrandTotal() / 100000).toFixed(2)}L in cash when your order is delivered.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back to Billing
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1" size="lg">
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({cartItems.length})</span>
                    <span className="font-semibold">₹{(calculateTotal() / 100000).toFixed(2)}L</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-semibold">₹{(calculateTax() / 100000).toFixed(2)}L</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-primary/10 to-primary/5 px-4 rounded-lg">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      ₹{(calculateGrandTotal() / 100000).toFixed(2)}L
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      ✓ Secure checkout
                    </p>
                    <p className="flex items-center gap-2">
                      ✓ 7-day return policy
                    </p>
                    <p className="flex items-center gap-2">
                      ✓ 1-year warranty
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
