import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Eye
} from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Sort by date (newest first)
    const sortedOrders = savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(sortedOrders);
  };

  const toggleOrderExpand = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600', icon: Clock, text: 'Pending' },
      processing: { color: 'bg-blue-600', icon: Package, text: 'Processing' },
      shipped: { color: 'bg-purple-600', icon: Truck, text: 'Shipped' },
      delivered: { color: 'bg-green-600', icon: CheckCircle, text: 'Delivered' },
      cancelled: { color: 'bg-red-600', icon: XCircle, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      card: 'Credit/Debit Card',
      upi: 'UPI',
      cod: 'Cash on Delivery'
    };
    return labels[method] || method;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-3xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate('/cars')} size="lg">
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and track your order history</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All Orders ({orders.length})
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'processing' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('processing')}
              size="sm"
            >
              Processing
            </Button>
            <Button
              variant={filterStatus === 'shipped' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('shipped')}
              size="sm"
            >
              Shipped
            </Button>
            <Button
              variant={filterStatus === 'delivered' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('delivered')}
              size="sm"
            >
              Delivered
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.orderId);
            
            return (
              <Card key={order.orderId} className="overflow-hidden">
                <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">Order #{order.orderId}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="font-semibold text-primary">
                          ₹{(order.pricing.total / 100000).toFixed(2)}L
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpand(order.orderId)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Order Items
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="font-semibold">
                                    {item.vehicle?.name || item.product?.name || `Item ${index + 1}`}
                                  </p>
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {item.type}
                                  </Badge>
                                </div>
                                <p className="font-semibold text-primary">
                                  ₹{((item.pricing?.total || item.total || 0) / 100000).toFixed(2)}L
                                </p>
                              </div>
                              
                              {/* Show item details based on type */}
                              {item.type === 'custom-car-build' && item.appearance && (
                                <div className="text-sm text-muted-foreground mt-2">
                                  <p>Color: {item.appearance.color?.name}</p>
                                  <p>Finish: {item.appearance.finish?.type}</p>
                                  {item.parts && item.parts.length > 0 && (
                                    <p>Parts: {item.parts.length} upgrades</p>
                                  )}
                                </div>
                              )}
                              
                              {item.type === 'seller-car' && item.product && (
                                <div className="text-sm text-muted-foreground mt-2">
                                  <p>{item.product.brand} {item.product.model}</p>
                                  <p>Year: {item.product.year}</p>
                                </div>
                              )}
                              
                              {item.type === 'part' && item.product && (
                                <div className="text-sm text-muted-foreground mt-2">
                                  <p>Category: {item.product.category}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & Payment Info */}
                      <div className="space-y-6">
                        {/* Delivery Address */}
                        <div>
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Delivery Address
                          </h3>
                          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border">
                            <p className="font-semibold">{order.billingInfo.fullName}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.billingInfo.address}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.billingInfo.city}, {order.billingInfo.state} - {order.billingInfo.pincode}
                            </p>
                            {order.billingInfo.landmark && (
                              <p className="text-sm text-muted-foreground">
                                Landmark: {order.billingInfo.landmark}
                              </p>
                            )}
                            <Separator className="my-3" />
                            <div className="space-y-1 text-sm">
                              <p className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {order.billingInfo.phone}
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {order.billingInfo.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div>
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Payment Details
                          </h3>
                          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-muted-foreground">Payment Method</span>
                              <Badge>{getPaymentMethodLabel(order.paymentInfo.method)}</Badge>
                            </div>
                            <Separator className="my-3" />
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">
                                  ₹{(order.pricing.subtotal / 100000).toFixed(2)}L
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span className="font-semibold">
                                  ₹{(order.pricing.tax / 100000).toFixed(2)}L
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between items-center py-2 bg-primary/10 px-3 rounded">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-xl text-primary">
                                  ₹{(order.pricing.total / 100000).toFixed(2)}L
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6 pt-6 border-t">
                      <Button variant="outline" className="flex-1">
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                      {order.status === 'pending' && (
                        <Button variant="outline" className="flex-1 text-red-500 hover:bg-red-50">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No {filterStatus} orders</h2>
            <p className="text-muted-foreground">Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
