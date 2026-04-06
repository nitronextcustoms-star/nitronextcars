import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Wrench, Calendar, Gauge, Fuel, Users, Zap, Package } from "lucide-react";

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [compatibleParts, setCompatibleParts] = useState([]);

  // Mock data - in a real app this would come from an API
  useEffect(() => {
    // Simulate API call
    const fetchCarDetails = () => {
      // Find the car based on ID
      const cars = [
        {
          id: 1,
          name: "Mahindra Thar Custom",
          image: "/placeholder-thar.jpg",
          price: 2500000,
          year: 2022,
          mileage: "15,000 km",
          engine: "2.2L Turbo Diesel",
          power: "130 BHP @ 3750 RPM",
          torque: "300 Nm @ 1600-2800 RPM",
          seating: "4 Seater",
          transmission: "6-Speed Manual",
          fuelType: "Diesel",
          color: "Red",
          description: "Fully customized Mahindra Thar with premium off-road modifications. Perfect for adventure enthusiasts who want both style and performance. This build features a lifted suspension, custom bumpers, and enhanced ground clearance for ultimate off-road capability.",
          modifications: [
            {
              id: 1,
              name: "Off-Road Bumper",
              description: "Heavy-duty steel bumper with winch mount",
              price: 45000
            },
            {
              id: 2,
              name: "Lift Kit",
              description: "2-inch lift kit for improved ground clearance",
              price: 75000
            },
            {
              id: 3,
              name: "Custom Wheels",
              description: "17-inch alloy wheels with all-terrain tires",
              price: 120000
            }
          ]
        },
        {
          id: 2,
          name: "Toyota Fortuner Modified",
          image: "/placeholder-fortuner.jpg",
          price: 4200000,
          year: 2021,
          mileage: "25,000 km",
          engine: "2.8L Turbo Diesel",
          power: "201 BHP @ 3400 RPM",
          torque: "500 Nm @ 1600-2800 RPM",
          seating: "7 Seater",
          transmission: "6-Speed Automatic",
          fuelType: "Diesel",
          color: "White",
          description: "Luxury SUV with performance upgrades. This Fortuner features a custom body kit, lowered suspension, and premium interior modifications. Perfect for families who want both comfort and style.",
          modifications: [
            {
              id: 4,
              name: "Body Kit",
              description: "Full aerodynamic body kit with carbon fiber accents",
              price: 150000
            },
            {
              id: 5,
              name: "Lowered Suspension",
              description: "Coilover suspension system for improved handling",
              price: 180000
            },
            {
              id: 6,
              name: "Custom Interior",
              description: "Premium leather upholstery with custom stitching",
              price: 250000
            }
          ]
        },
        {
          id: 3,
          name: "Maruti Swift Sport",
          image: "/placeholder-swift.jpg",
          price: 1200000,
          year: 2023,
          mileage: "8,000 km",
          engine: "1.2L K12N Dual Jet",
          power: "89 BHP @ 6000 RPM",
          torque: "113 Nm @ 4400 RPM",
          seating: "5 Seater",
          transmission: "5-Speed Manual",
          fuelType: "Petrol",
          color: "Metallic Blue",
          description: "Sporty hatchback with racing-inspired modifications. This Swift has been transformed into a track-ready machine with a custom exhaust, racing kit, and performance tuning.",
          modifications: [
            {
              id: 7,
              name: "Racing Kit",
              description: "Complete racing conversion with roll cage",
              price: 300000
            },
            {
              id: 8,
              name: "Custom Exhaust",
              description: "High-flow titanium exhaust system",
              price: 85000
            },
            {
              id: 9,
              name: "Coilovers",
              description: "Adjustable coilover suspension system",
              price: 120000
            }
          ]
        }
      ];

      const foundCar = cars.find(car => car.id === parseInt(id));
      setCar(foundCar);

      // Mock compatible parts data
      if (foundCar) {
        const parts = [
          // Engine Parts
          { id: 101, name: "Engine Block", description: "High-performance engine block assembly", price: 85000, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 102, name: "Cylinder Head", description: "Ported and polished cylinder head", price: 45000, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 103, name: "Pistons & Rings Set", description: "Forged aluminum pistons with high-performance rings", price: 35000, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 104, name: "Crankshaft", description: "Balanced performance crankshaft", price: 55000, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 105, name: "Camshaft", description: "High-lift performance camshaft", price: 28000, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 106, name: "Timing Belt/Chain Kit", description: "Heavy-duty timing belt with tensioners", price: 8500, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 107, name: "Oil Pump", description: "High-volume oil pump", price: 12000, compatibleWith: [1, 2, 3], category: "Engine" },
          { id: 108, name: "Engine Gasket Set", description: "Complete engine gasket and seal kit", price: 6500, compatibleWith: [1, 2, 3], category: "Engine" },

          // Transmission & Drivetrain
          { id: 201, name: "Clutch Kit", description: "Performance clutch plate and pressure plate", price: 18000, compatibleWith: [1, 3], category: "Transmission" },
          { id: 202, name: "Flywheel", description: "Lightweight performance flywheel", price: 22000, compatibleWith: [1, 2, 3], category: "Transmission" },
          { id: 203, name: "Gearbox Assembly", description: "Reconditioned gearbox with warranty", price: 75000, compatibleWith: [1, 2, 3], category: "Transmission" },
          { id: 204, name: "Drive Shaft", description: "Heavy-duty drive shaft assembly", price: 25000, compatibleWith: [1, 2], category: "Drivetrain" },
          { id: 205, name: "CV Joints Set", description: "Complete CV joints with boots", price: 15000, compatibleWith: [1, 2, 3], category: "Drivetrain" },

          // Electrical System
          { id: 301, name: "Car Battery", description: "High-capacity maintenance-free battery", price: 8500, compatibleWith: [1, 2, 3], category: "Electrical" },
          { id: 302, name: "Alternator", description: "High-output alternator", price: 15000, compatibleWith: [1, 2, 3], category: "Electrical" },
          { id: 303, name: "Starter Motor", description: "Heavy-duty starter motor", price: 12000, compatibleWith: [1, 2, 3], category: "Electrical" },
          { id: 304, name: "Spark Plugs Set", description: "Iridium spark plugs (set of 4)", price: 2500, compatibleWith: [3], category: "Electrical" },
          { id: 305, name: "Ignition Coil", description: "High-performance ignition coil", price: 6500, compatibleWith: [1, 2, 3], category: "Electrical" },
          { id: 306, name: "LED Headlight Kit", description: "6000K LED headlights with projector lenses", price: 12000, compatibleWith: [1, 2, 3], category: "Electrical" },
          { id: 307, name: "Wiring Harness", description: "Complete wiring harness kit", price: 18000, compatibleWith: [1, 2, 3], category: "Electrical" },

          // Suspension & Steering
          { id: 401, name: "Shock Absorbers Set", description: "Gas-filled performance shock absorbers (set of 4)", price: 28000, compatibleWith: [1, 2, 3], category: "Suspension" },
          { id: 402, name: "Coil Springs", description: "Heavy-duty coil spring set", price: 15000, compatibleWith: [1, 2, 3], category: "Suspension" },
          { id: 403, name: "Control Arms", description: "Reinforced control arm set", price: 22000, compatibleWith: [1, 2, 3], category: "Suspension" },
          { id: 404, name: "Ball Joints", description: "Heavy-duty ball joints", price: 8500, compatibleWith: [1, 2, 3], category: "Suspension" },
          { id: 405, name: "Tie Rod Ends", description: "Complete tie rod end set", price: 6500, compatibleWith: [1, 2, 3], category: "Steering" },
          { id: 406, name: "Steering Rack", description: "Power steering rack assembly", price: 35000, compatibleWith: [1, 2, 3], category: "Steering" },
          { id: 407, name: "Wheel Bearings", description: "Premium wheel hub bearings (set)", price: 12000, compatibleWith: [1, 2, 3], category: "Suspension" },
          { id: 408, name: "Coilover Kit", description: "Adjustable coilover suspension system", price: 180000, compatibleWith: [1, 2, 3], category: "Suspension" },

          // Brake System
          { id: 501, name: "Brake Pads Set", description: "Ceramic brake pads (front & rear)", price: 8500, compatibleWith: [1, 2, 3], category: "Brakes" },
          { id: 502, name: "Brake Discs", description: "Slotted performance brake rotors", price: 15000, compatibleWith: [1, 2, 3], category: "Brakes" },
          { id: 503, name: "Brake Master Cylinder", description: "Heavy-duty brake master cylinder", price: 12000, compatibleWith: [1, 2, 3], category: "Brakes" },
          { id: 504, name: "Brake Lines Kit", description: "Stainless steel braided brake lines", price: 6500, compatibleWith: [1, 2, 3], category: "Brakes" },
          { id: 505, name: "ABS Sensors", description: "Complete ABS sensor set", price: 8500, compatibleWith: [2, 3], category: "Brakes" },

          // Cooling System
          { id: 601, name: "Radiator", description: "High-capacity aluminum radiator", price: 25000, compatibleWith: [1, 2, 3], category: "Cooling" },
          { id: 602, name: "Water Pump", description: "Heavy-duty water pump", price: 8500, compatibleWith: [1, 2, 3], category: "Cooling" },
          { id: 603, name: "Thermostat", description: "Performance thermostat", price: 2500, compatibleWith: [1, 2, 3], category: "Cooling" },
          { id: 604, name: "Radiator Fan", description: "Electric cooling fan assembly", price: 12000, compatibleWith: [1, 2, 3], category: "Cooling" },

          // Fuel System
          { id: 701, name: "Fuel Pump", description: "High-pressure electric fuel pump", price: 15000, compatibleWith: [1, 2, 3], category: "Fuel" },
          { id: 702, name: "Fuel Filter", description: "High-flow fuel filter", price: 1500, compatibleWith: [1, 2, 3], category: "Fuel" },
          { id: 703, name: "Fuel Injectors Set", description: "High-performance fuel injectors", price: 28000, compatibleWith: [1, 2, 3], category: "Fuel" },

          // Exhaust System
          { id: 801, name: "Exhaust Manifold", description: "Performance exhaust manifold", price: 35000, compatibleWith: [1, 2, 3], category: "Exhaust" },
          { id: 802, name: "Catalytic Converter", description: "High-flow catalytic converter", price: 45000, compatibleWith: [1, 2, 3], category: "Exhaust" },
          { id: 803, name: "Performance Muffler", description: "Stainless steel performance muffler", price: 18000, compatibleWith: [1, 2, 3], category: "Exhaust" },
          { id: 804, name: "Cat-Back Exhaust System", description: "Complete cat-back exhaust with dual tips", price: 65000, compatibleWith: [2, 3], category: "Exhaust" },

          // Body & Interior Parts
          { id: 901, name: "Front Bumper", description: "OEM replacement front bumper", price: 25000, compatibleWith: [1, 2, 3], category: "Body" },
          { id: 902, name: "Rear Bumper", description: "OEM replacement rear bumper", price: 22000, compatibleWith: [1, 2, 3], category: "Body" },
          { id: 903, name: "Side Mirrors", description: "Power-folding side mirrors (pair)", price: 12000, compatibleWith: [1, 2, 3], category: "Body" },
          { id: 904, name: "Front Grille", description: "Chrome/matte black grille", price: 8500, compatibleWith: [1, 2, 3], category: "Body" },
          { id: 905, name: "Carbon Fiber Hood", description: "Lightweight carbon fiber hood", price: 85000, compatibleWith: [2, 3], category: "Body" },
          { id: 906, name: "Racing Seats", description: "Bucket racing seats (pair)", price: 45000, compatibleWith: [1, 2, 3], category: "Interior" },
          { id: 907, name: "Seat Covers", description: "Premium leather seat covers (set)", price: 15000, compatibleWith: [1, 2, 3], category: "Interior" },
          { id: 908, name: "Floor Mats", description: "Custom-fit floor mat set", price: 3500, compatibleWith: [1, 2, 3], category: "Interior" },

          // Air Conditioning & Heating
          { id: 1001, name: "AC Compressor", description: "Air conditioning compressor", price: 28000, compatibleWith: [1, 2, 3], category: "AC/Heating" },
          { id: 1002, name: "AC Condenser", description: "AC condenser assembly", price: 15000, compatibleWith: [1, 2, 3], category: "AC/Heating" },
          { id: 1003, name: "Blower Motor", description: "AC blower motor assembly", price: 8500, compatibleWith: [1, 2, 3], category: "AC/Heating" },
          { id: 1004, name: "Cabin Air Filter", description: "HEPA cabin air filter", price: 1200, compatibleWith: [1, 2, 3], category: "AC/Heating" },

          // Fluids & Maintenance Items
          { id: 1101, name: "Synthetic Engine Oil", description: "5W-40 fully synthetic engine oil (5L)", price: 2500, compatibleWith: [1, 2, 3], category: "Fluids" },
          { id: 1102, name: "Brake Fluid", description: "DOT 4 brake fluid (1L)", price: 800, compatibleWith: [1, 2, 3], category: "Fluids" },
          { id: 1103, name: "Coolant", description: "Premium engine coolant (5L)", price: 1200, compatibleWith: [1, 2, 3], category: "Fluids" },
          { id: 1104, name: "Transmission Fluid", description: "ATF transmission fluid (4L)", price: 1800, compatibleWith: [1, 2, 3], category: "Fluids" },
          { id: 1105, name: "Oil Filter", description: "High-performance oil filter", price: 500, compatibleWith: [1, 2, 3], category: "Filters" },
          { id: 1106, name: "Air Filter", description: "High-flow performance air filter", price: 2500, compatibleWith: [1, 2, 3], category: "Filters" },
          { id: 1107, name: "Wiper Blades", description: "Premium silicone wiper blades (pair)", price: 1500, compatibleWith: [1, 2, 3], category: "Maintenance" },

          // Wheels & Tires
          { id: 1201, name: "Alloy Wheels Set", description: "17-inch forged alloy wheels (set of 4)", price: 95000, compatibleWith: [1, 2, 3], category: "Wheels" },
          { id: 1202, name: "Performance Tires", description: "High-performance radial tires (set of 4)", price: 55000, compatibleWith: [1, 2, 3], category: "Wheels" },
          { id: 1203, name: "Off-Road Tires", description: "All-terrain off-road tires (set of 4)", price: 65000, compatibleWith: [1], category: "Wheels" }
        ];

        // Filter parts compatible with this car
        const compatible = parts.filter(part => part.compatibleWith.includes(foundCar.id));
        setCompatibleParts(compatible);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleAddToCart = (item, type) => {
    let cartItem;

    if (type === 'car') {
      cartItem = {
        type: 'car',
        timestamp: new Date().toISOString(),
        product: {
          id: item.id,
          name: item.name,
          description: item.description,
          image: item.image,
          year: item.year,
          mileage: item.mileage,
          fuelType: item.fuelType,
          seating: item.seating,
          color: item.color
        },
        specifications: {
          engine: item.engine,
          power: item.power,
          torque: item.torque,
          transmission: item.transmission
        },
        pricing: {
          basePrice: item.price,
          total: item.price
        }
      };
    } else if (type === 'modification') {
      cartItem = {
        type: 'modification',
        timestamp: new Date().toISOString(),
        product: {
          id: item.id,
          name: item.name,
          description: item.description,
          forCar: car.name
        },
        pricing: {
          basePrice: item.price,
          total: item.price
        }
      };
    } else if (type === 'part') {
      cartItem = {
        type: 'part',
        timestamp: new Date().toISOString(),
        product: {
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          compatibleWith: car.name
        },
        pricing: {
          basePrice: item.price,
          total: item.price
        }
      };
    }

    // Add to cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`✅ ${item.name} added to cart!\n\nPrice: ₹${item.price.toLocaleString()}`);
  };

  const navigate = useNavigate();

  const handleBookService = () => {
    navigate('/booking');
  };

  if (!car) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rotate-45 blur-lg animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-20 right-32 w-36 h-36 bg-gradient-to-br from-amber-500/15 to-yellow-600/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}></div>
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => window.history.back()} className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
            ← Back to Cars
          </Button>
        </div>

        {/* Car Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{car.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">₹{car.price.toLocaleString()}</span>
              <Badge variant="secondary">{car.year} Model</Badge>
            </div>

            <p className="text-muted-foreground mb-6">{car.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <span>{car.mileage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-primary" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{car.seating}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => handleAddToCart(car, 'car')}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={handleBookService}>
                📅 Book Service
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Specifications Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Full Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Engine & Performance</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Engine:</span>
                    <span>{car.engine}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Power:</span>
                    <span>{car.power}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Torque:</span>
                    <span>{car.torque}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Transmission:</span>
                    <span>{car.transmission}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dimensions & Capacity</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Seating Capacity:</span>
                    <span>{car.seating}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span>{car.fuelType}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span>{car.color}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Mileage:</span>
                    <span>{car.mileage}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modifications Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Custom Modifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {car.modifications.map(mod => (
                <Card key={mod.id}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{mod.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{mod.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">₹{mod.price.toLocaleString()}</span>
                      <Button size="sm" onClick={() => handleAddToCart(mod, 'modification')}>
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compatible Parts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Compatible Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {compatibleParts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compatibleParts.map(part => (
                  <Card key={part.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{part.name}</h3>
                        <Badge variant="secondary">{part.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{part.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">₹{part.price.toLocaleString()}</span>
                        <Button size="sm" onClick={() => handleAddToCart(part, 'part')}>
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No compatible parts available for this vehicle.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarDetail;