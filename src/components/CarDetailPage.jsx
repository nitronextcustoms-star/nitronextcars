import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import {
  ArrowLeft, ShoppingCart, Phone, MapPin, Calendar, Gauge,
  Fuel, Users, Zap, Settings, CheckCircle, AlertCircle
} from "lucide-react";

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    try {
      const storedCars = localStorage.getItem('sellerCars');
      const sellerCars = storedCars ? JSON.parse(storedCars) : [];
      if (Array.isArray(sellerCars)) {
        const carData = sellerCars[parseInt(id)];
        setCar(carData || null);
      } else {
        setCar(null);
      }
    } catch (error) {
      console.error("Error loading car data:", error);
      setCar(null);
    }
  }, [id]);

  const handleContact = () => {
    setShowContact(true);
  };

  const handleTestDrive = () => {
    alert("Test drive request sent! The seller will contact you soon.");
  };

  const handleAddToCart = () => {
    const isAvailable = (car.stockStatus || "available") === "available";
    if (!isAvailable) {
      alert("This car is already sold and no longer available.");
      return;
    }

    const cartItem = {
      type: 'seller-car',
      timestamp: new Date().toISOString(),
      product: {
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        description: car.description,
        images: car.images,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        seating: car.seating,
        color: car.color,
        condition: car.condition,
        negotiable: car.negotiable
      },
      specifications: {
        engine: car.engine,
        power: car.power,
        torque: car.torque,
        transmission: car.transmission,
        drivetrain: car.drivetrain,
        doors: car.doors
      },
      seller: {
        id: car.sellerId,
        name: car.sellerName,
        phone: car.sellerPhone,
        email: car.sellerEmail,
        location: car.location
      },
      pricing: {
        basePrice: car.price,
        total: car.price
      }
    };

    // Add to cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`✅ ${car.name} added to cart!

Price: ₹${car.price.toLocaleString()}
Seller: ${car.sellerName}
Location: ${car.location}`);
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Car not found</p>
      </div>
    );
  }

  const isAvailable = (car.stockStatus || "available") === "available";

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation cartCount={0} />

      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate('/cars')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cars
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <img
                      src={car.images?.[selectedImage]?.url || '/placeholder.jpg'}
                      alt={car.name || 'Car'}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Badge className="bg-red-600 text-white text-2xl px-8 py-3 mb-4">SOLD OUT</Badge>
                          <p className="text-white text-lg">This vehicle has been sold</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {car.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`${car.name || 'Car'} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${selectedImage === index ? 'border-primary' : 'border-border'
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Car Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{car.name}</CardTitle>
                    <p className="text-muted-foreground">{car.brand} {car.model} - {car.year}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isAvailable ? (
                      <>
                        <Badge className="capitalize">{car.condition}</Badge>
                        {car.negotiable && <Badge variant="secondary">Negotiable</Badge>}
                        <Badge className="bg-green-600">Available</Badge>
                      </>
                    ) : (
                      <Badge className="bg-red-600 text-lg px-4 py-1">SOLD OUT</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Year</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mileage</p>
                      <p className="font-semibold">{car.mileage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fuel</p>
                      <p className="font-semibold">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Seating</p>
                      <p className="font-semibold">{car.seating} Seater</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{car.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Engine & Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engine:</span>
                        <span className="font-medium">{car.engine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Power:</span>
                        <span className="font-medium">{car.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Torque:</span>
                        <span className="font-medium">{car.torque}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transmission:</span>
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Drivetrain:</span>
                        <span className="font-medium">{car.drivetrain}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Vehicle Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="font-medium">{car.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doors:</span>
                        <span className="font-medium">{car.doors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seating:</span>
                        <span className="font-medium">{car.seating} Seater</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fuel Type:</span>
                        <span className="font-medium">{car.fuelType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condition & History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Condition & History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {car.accidentHistory === 'no' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Accident History</p>
                        <p className="font-medium capitalize">{car.accidentHistory === 'no' ? 'No Accidents' : car.accidentHistory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Owners</p>
                        <p className="font-medium">{car.owners} Owner(s)</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Service History</p>
                        <p className="font-medium capitalize">{car.serviceHistory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Place</p>
                        <p className="font-medium">{car.registrationState} - {car.registrationYear}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            {car.modifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Modifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {car.modifications.split('\n').filter(mod => mod.trim()).map((mod, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {mod.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {car.features && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.split('\n').filter(feature => feature.trim()).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature.trim()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Price and Actions */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">
                  ₹{parseInt(car.price).toLocaleString()}
                </CardTitle>
                {car.negotiable && (
                  <p className="text-sm text-muted-foreground">Price is negotiable</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAvailable && (
                  <div className="bg-red-600/10 border border-red-600 rounded-lg p-4 mb-4">
                    <p className="text-red-600 font-semibold text-center">⚠️ This vehicle has been sold</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{car.location}</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAvailable ? 'Add to Cart' : 'Sold Out'}
                  </Button>

                  <Button
                    variant="outline"
                    className={`w-full ${showContact ? 'bg-primary/10 border-primary text-primary' : ''}`}
                    size="lg"
                    onClick={handleContact}
                    disabled={!isAvailable}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {showContact ? (
                      <span className="font-bold text-lg">Call: 8015725151</span>
                    ) : (
                      isAvailable ? 'Contact Seller' : 'No Longer Available'
                    )}
                  </Button>

                  {car.availableForTestDrive && isAvailable && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={handleTestDrive}
                    >
                      Request Test Drive
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">Quick Info</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>• {car.owners} Owner vehicle</p>
                    <p>• {car.accidentHistory === 'no' ? 'No accident history' : 'Accident history disclosed'}</p>
                    <p>• {car.serviceHistory} service history</p>
                    <p>• Registration Place: {car.registrationState}</p>
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

export default CarDetailPage;