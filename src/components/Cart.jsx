import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Package,
  Palette,
  Settings,
  Calendar,
  IndianRupee,
  Car,
  Wrench,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
    }
  };

  const formatPrice = (price) => {
    const value = parseFloat(price || 0);
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const renderCartItem = (item, index) => {

    // Seller Car
    if (item.type === 'seller-car') {
      return renderSellerCar(item, index);
    }

    // Regular Car
    if (item.type === 'car') {
      return renderRegularCar(item, index);
    }

    // Part
    if (item.type === 'part') {
      return renderPart(item, index);
    }

    // Modification
    if (item.type === 'modification') {
      return renderModification(item, index);
    }

    return null;
  };


  const renderSellerCar = (item, index) => {
    return (
      <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                {item.product.name}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.timestamp)}
                </span>
                <Badge variant="secondary">Seller Listed Car</Badge>
                <Badge className="capitalize">{item.product.condition}</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Car Image */}
          {item.product.images && item.product.images.length > 0 && (
            <div className="mb-6">
              <img
                src={item.product.images[0].url}
                alt={item.product.name}
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Basic Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Vehicle Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border text-black">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Basic Info</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between border-b border-zinc-200 pb-1">
                    <span className="text-zinc-600">Brand:</span>
                    <span className="font-semibold">{item.product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">Model:</span>
                    <span className="font-semibold">{item.product.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">Year:</span>
                    <span className="font-semibold">{item.product.year}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-600">Mileage:</span>
                    <span className="font-semibold">{item.product.mileage}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border text-black">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Features</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between border-b border-zinc-200 pb-1">
                    <span className="text-zinc-600">Fuel Type:</span>
                    <span className="font-semibold">{item.product.fuelType}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">Seating:</span>
                    <span className="font-semibold">{item.product.seating} Seater</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-600">Color:</span>
                    <span className="font-semibold">{item.product.color}</span>
                  </div>
                  {item.product.negotiable && (
                    <Badge className="bg-green-600 text-xs text-white">Price Negotiable</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {item.specifications && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Specifications</h3>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border text-black">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-200 pb-1">
                    <span className="text-zinc-600">Engine:</span>
                    <span className="font-semibold">{item.specifications.engine}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 pb-1">
                    <span className="text-zinc-600">Power:</span>
                    <span className="font-semibold">{item.specifications.power}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1 md:border-b-0">
                    <span className="text-zinc-600">Torque:</span>
                    <span className="font-semibold">{item.specifications.torque}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1 md:border-b-0">
                    <span className="text-zinc-600">Transmission:</span>
                    <span className="font-semibold">{item.specifications.transmission}</span>
                  </div>
                  {item.specifications.drivetrain && (
                    <div className="flex justify-between border-t border-zinc-200 pt-1 md:col-span-2">
                      <span className="text-zinc-600">Drivetrain:</span>
                      <span className="font-semibold">{item.specifications.drivetrain}</span>
                    </div>
                  )}
                  {item.specifications.doors && (
                    <div className="flex justify-between border-t border-zinc-200 pt-1 md:col-span-2">
                      <span className="text-zinc-600">Doors:</span>
                      <span className="font-semibold">{item.specifications.doors}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}



          <Separator className="my-6" />

          {/* Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Pricing</h3>
            </div>

            <div className="flex justify-between py-3 bg-gradient-to-r from-primary/10 to-primary/5 px-4 rounded-lg">
              <span className="font-bold text-lg">Total Price</span>
              <span className="font-bold text-2xl text-primary">
                ₹{(item.pricing.total / 100000).toFixed(2)}L
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRegularCar = (item, index) => {
    return (
      <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
        <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                {item.product.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                Pre-configured Custom Car
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.timestamp)}
                </span>
                <Badge variant="secondary">Pre-configured Car</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Car Image */}
          {item.product.image && (
            <div className="mb-6">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Car Name Section */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Vehicle Information</h3>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border">
              <div className="mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Car Name</p>
                <p className="font-semibold text-xl">{item.product.name}</p>
              </div>
              {item.product.description && (
                <p className="text-sm text-muted-foreground">{item.product.description}</p>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Vehicle Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border space-y-2 text-sm text-black">
                <div className="flex justify-between border-b border-zinc-200 pb-1">
                  <span className="text-zinc-600">Year:</span>
                  <span className="font-semibold">{item.product.year}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 py-1">
                  <span className="text-zinc-600">Mileage:</span>
                  <span className="font-semibold">{item.product.mileage}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-600">Fuel Type:</span>
                  <span className="font-semibold">{item.product.fuelType}</span>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border space-y-2 text-sm text-black">
                <div className="flex justify-between border-b border-zinc-200 pb-1">
                  <span className="text-zinc-600">Seating:</span>
                  <span className="font-semibold">{item.product.seating}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-600">Color:</span>
                  <span className="font-semibold">{item.product.color}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {item.specifications && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Specifications</h3>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engine:</span>
                  <span className="font-semibold">{item.specifications.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power:</span>
                  <span className="font-semibold">{item.specifications.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Torque:</span>
                  <span className="font-semibold">{item.specifications.torque}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transmission:</span>
                  <span className="font-semibold">{item.specifications.transmission}</span>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Pricing</h3>
            </div>
            <div className="flex justify-between py-3 bg-gradient-to-r from-primary/10 to-primary/5 px-4 rounded-lg">
              <span className="font-bold text-lg">Total Price</span>
              <span className="font-bold text-2xl text-primary">
                ₹{(item.pricing.total / 100000).toFixed(2)}L
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPart = (item, index) => {
    return (
      <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {item.product.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                Part - {item.product.category}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.timestamp)}
                </span>
                <Badge variant="secondary">{item.product.category}</Badge>
                {item.product.stock && (
                  <Badge className="bg-green-600">{item.product.stock}</Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Part Details */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Part Details</h3>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border text-black">
              <div className="mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Part Name</p>
                <p className="font-semibold text-lg">{item.product.name}</p>
              </div>
              <p className="text-sm text-zinc-700 mb-3">{item.product.description}</p>
              {item.product.compatibleWith && (
                <div className="flex items-center gap-2 text-sm border-t border-zinc-200 pt-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-zinc-600">Compatible with:</span>
                  <span className="font-semibold">{item.product.compatibleWith}</span>
                </div>
              )}
              {item.quantity && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-zinc-600">Quantity:</span>
                  <span className="font-semibold">{item.quantity}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Pricing</h3>
            </div>
            <div className="flex justify-between py-3 bg-gradient-to-r from-primary/10 to-primary/5 px-4 rounded-lg">
              <span className="font-bold text-lg">Total Price</span>
              <span className="font-bold text-2xl text-primary">
                {formatPrice(item.pricing.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderModification = (item, index) => {
    return (
      <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                {item.product.name}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.timestamp)}
                </span>
                <Badge variant="secondary">Modification</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Modification Details */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Modification Details</h3>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border text-black">
              <p className="text-sm text-zinc-700 mb-3">{item.product.description}</p>
              {item.product.forCar && (
                <div className="flex items-center gap-2 text-sm border-t border-zinc-200 pt-2">
                  <Car className="h-4 w-4 text-primary" />
                  <span className="text-zinc-600">For Car:</span>
                  <span className="font-semibold">{item.product.forCar}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Pricing */}
          <div className="flex justify-between py-3 bg-gradient-to-r from-primary/10 to-primary/5 px-4 rounded-lg">
            <span className="font-bold text-lg text-black">Total Price</span>
            <span className="font-bold text-2xl text-primary">
              {formatPrice(item.pricing.total)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Ensure we parse values correctly, handling both numbers and numeric strings
      const price = parseFloat(item.pricing?.total || item.total || 0);
      return total + price;
    }, 0);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently added';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation cartCount={cartItems.length} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
          <Separator />
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Explore our cars and parts to get started!</p>
            <Link to="/cars">
              <Button size="lg" className="gap-2">
                <Car className="h-5 w-5" />
                Browse Cars
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => renderCartItem(item, index))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 border-2">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-semibold">{cartItems.length}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Upgrades</span>
                      <span className="font-semibold">
                        {cartItems.reduce((sum, item) => sum + (item.summary?.totalUpgrades || 0), 0)}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-primary/10 to-primary/5 px-4 rounded-lg">
                      <span className="font-bold text-lg">Grand Total</span>
                      <span className="font-bold text-2xl text-primary">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2">
                        ✓ Free nationwide shipping
                      </p>
                      <p className="flex items-center gap-2">
                        ✓ Professional installation available
                      </p>
                      <p className="flex items-center gap-2">
                        ✓ 1-year warranty included
                      </p>
                    </div>

                    <Link to="/checkout" className="block">
                      <Button className="w-full mt-6" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>

                    <Link to="/customizer" className="block">
                      <Button variant="outline" className="w-full">
                        <Palette className="h-4 w-4 mr-2" />
                        Add More Cars
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
