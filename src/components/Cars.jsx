import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Search, Filter, MapPin, Fuel, Calendar, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { query } from "@/lib/turso";

const Cars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fuelType: "all",
    transmission: "all",
    condition: "all",
    priceRange: "all",
    stockStatus: "available" // Show only available cars by default
  });

  useEffect(() => {
    const loadCars = async () => {
      try {
        const result = await query("SELECT * FROM cars ORDER BY created_at DESC");
        if (result && result.rows) {
          const loadedCars = result.rows.map(row => ({
            ...row,
            images: (() => { try { return JSON.parse(row.images || '[]'); } catch { return []; } })()
          }));
          setCars(loadedCars);
          setFilteredCars(loadedCars);
        }
      } catch (error) {
        console.error("Error loading cars from Turso:", error);
        setCars([]);
        setFilteredCars([]);
      }
    };
    loadCars();
  }, []);


  useEffect(() => {
    // Apply filters and search
    if (!Array.isArray(cars)) return;
    let filtered = [...cars];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Fuel type filter
    if (filters.fuelType !== "all") {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }

    // Transmission filter
    if (filters.transmission !== "all") {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }

    // Condition filter
    if (filters.condition !== "all") {
      filtered = filtered.filter(car => car.condition === filters.condition);
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter(car => {
        const price = parseInt(car.price);
        switch (filters.priceRange) {
          case "under-10": return price < 1000000;
          case "10-20": return price >= 1000000 && price < 2000000;
          case "20-30": return price >= 2000000 && price < 3000000;
          case "above-30": return price >= 3000000;
          default: return true;
        }
      });
    }

    // Stock status filter
    if (filters.stockStatus !== "all") {
      filtered = filtered.filter(car => {
        const status = (car.stockStatus || "available");
        if (filters.stockStatus === "available") {
          return status === "available";
        }
        return status !== "available";
      });
    }

    setFilteredCars(filtered);
  }, [searchTerm, filters, cars]);

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation cartCount={0} />

      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Browse Custom Cars
          </h1>
          <p className="text-muted-foreground text-lg">
            Find your perfect custom ride from our collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Status</label>
                <select
                  value={filters.stockStatus}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Cars</option>
                  <option value="available">Available Only</option>
                  <option value="sold">Sold Cars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                  <option value="DCT">DCT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-work">Needs Work</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All</option>
                  <option value="under-10">Under 10 Lakhs</option>
                  <option value="10-20">10-20 Lakhs</option>
                  <option value="20-30">20-30 Lakhs</option>
                  <option value="above-30">Above 30 Lakhs</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredCars.length} of {cars.length} cars
          </p>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car, index) => {
              const isAvailable = (car.stockStatus || "available") === "available";
              const isBooked = car.stockStatus === "booked";
              return (
                <Card key={index} className={`overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer ${!isAvailable ? 'opacity-60' : ''}`}>
                  <div className="relative">
                    <img
                      src={car.images?.[0]?.url || '/placeholder-car.jpg'}
                      alt={car.name || 'Car'}
                      className="w-full h-48 object-cover"
                    />
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge className={`${isBooked ? 'bg-blue-600' : 'bg-red-600'} text-white text-lg px-6 py-2`}>
                          {isBooked ? '📅 BOOKED' : 'SOLD OUT'}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {isAvailable ? (
                        <>
                          <Badge className="bg-primary capitalize">{car.condition}</Badge>
                          {car.negotiable && (
                            <Badge variant="secondary">Negotiable</Badge>
                          )}
                        </>
                      ) : (
                        <Badge className={isBooked ? "bg-blue-600" : "bg-red-600"}>
                          {isBooked ? 'Booked' : 'Out of Stock'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.brand} {car.model}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ₹{car.price ? parseInt(car.price).toLocaleString() : '0'}
                      </span>
                      <Badge variant="outline">{car.year}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Fuel className="h-4 w-4" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Gauge className="h-4 w-4" />
                        <span>{car.mileage}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{car.owners} Owner</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{car.location}</span>
                      </div>
                    </div>

                    {car.modifications && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Modifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {car.modifications.split('\n').slice(0, 2).map((mod, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {mod.trim()}
                            </Badge>
                          ))}
                          {car.modifications.split('\n').length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{car.modifications.split('\n').length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                      onClick={() => navigate(`/car-detail/${index}`)}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'View Details' : 'Sold Out'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {cars.length === 0
                ? "No cars listed yet. Be the first to add a car!"
                : "No cars match your search criteria."}
            </p>
            {cars.length === 0 && (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
              >
                Sign Up as Seller
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;