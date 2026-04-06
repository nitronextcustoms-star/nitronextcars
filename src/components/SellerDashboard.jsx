import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, CheckCircle, XCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sellerCars, setSellerCars] = useState([]);
  const [sellerParts, setSellerParts] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userType = localStorage.getItem('userType');

    if (!isAuthenticated || userType !== 'seller') {
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(userData));

    // Load seller's cars
    const cars = JSON.parse(localStorage.getItem('sellerCars') || '[]');
    const userCars = cars.filter(car => car.sellerId === JSON.parse(userData).email);
    setSellerCars(userCars);

    // Load seller's parts
    const parts = JSON.parse(localStorage.getItem('sellerParts') || '[]');
    const userParts = parts.filter(part => part.sellerId === JSON.parse(userData).email);
    setSellerParts(userParts);
  }, [navigate]);

  const handleToggleStockStatus = (carIndex) => {
    const allCars = JSON.parse(localStorage.getItem('sellerCars') || '[]');
    const car = allCars[carIndex];
    const newStatus = (car.stockStatus || "available") === "available" ? "sold" : "available";

    allCars[carIndex] = {
      ...car,
      stockStatus: newStatus
    };

    localStorage.setItem('sellerCars', JSON.stringify(allCars));

    // Refresh seller's cars
    const userCars = allCars.filter(c => c.sellerId === user.email);
    setSellerCars(userCars);

    alert(`Car marked as ${newStatus === "sold" ? "SOLD" : "AVAILABLE"}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation cartCount={0} />

      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user.businessName || user.fullName}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">{sellerCars.length + sellerParts.length}</p>
                </div>
                <Package className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-3xl font-bold">₹0</p>
                </div>
                <DollarSign className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold">₹0</p>
                </div>
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/add-car')}
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Car
              </Button>
              <Button
                onClick={() => navigate('/add-part')}
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Part
              </Button>
              <Button
                onClick={() => navigate('/orders')}
                variant="outline"
              >
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products List - Cars */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Cars</CardTitle>
          </CardHeader>
          <CardContent>
            {sellerCars.length > 0 ? (
              <div className="space-y-4">
                {sellerCars.map((car, index) => {
                  // Find the actual index in all cars array
                  const allCars = JSON.parse(localStorage.getItem('sellerCars') || '[]');
                  const actualIndex = allCars.findIndex(c =>
                    c.name === car.name &&
                    c.sellerId === car.sellerId &&
                    c.createdAt === car.createdAt
                  );
                  const isAvailable = (car.stockStatus || "available") === "available";

                  return (
                    <Card key={index} className={!isAvailable ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={car.images[0]?.url || '/placeholder.jpg'}
                            alt={car.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-xl font-bold">{car.name}</h3>
                                <p className="text-sm text-muted-foreground">{car.brand} {car.model} - {car.year}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                {isAvailable ? (
                                  <Badge className="bg-green-600">Available</Badge>
                                ) : (
                                  <Badge className="bg-red-600">Sold Out</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-primary">
                                ₹{parseInt(car.price).toLocaleString()}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={isAvailable ? "destructive" : "default"}
                                  onClick={() => handleToggleStockStatus(actualIndex)}
                                >
                                  {isAvailable ? (
                                    <>
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Mark as Sold
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Mark as Available
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/car-detail/${actualIndex}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg mb-4">No cars listed yet</p>
                <Button
                  onClick={() => navigate('/add-car')}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Car
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products List - Parts */}
        <Card>
          <CardHeader>
            <CardTitle>Your Parts</CardTitle>
          </CardHeader>
          <CardContent>
            {sellerParts.length > 0 ? (
              <div className="space-y-4">
                {sellerParts.map((part, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={part.images[0]?.url || '/placeholder.jpg'}
                          alt={part.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold">{part.name}</h3>
                              <p className="text-sm text-muted-foreground">{part.category} - {part.compatibleBrands}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge className="bg-green-600">Stock: {part.stock}</Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-primary">
                              ₹{parseInt(part.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg mb-4">No parts listed yet</p>
                <Button
                  onClick={() => navigate('/add-part')}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Part
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;