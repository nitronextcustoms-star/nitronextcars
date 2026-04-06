import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { ShoppingCart, Search, Filter, MessageSquare } from "lucide-react";
import { query } from "@/lib/turso";

// Initial Parts Data
const initialParts = [];

const Parts = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [allParts, setAllParts] = useState(initialParts);

  useEffect(() => {
    const loadParts = async () => {
      try {
        const result = await query("SELECT * FROM parts ORDER BY created_at DESC");
        if (result && result.rows) {
          const formattedParts = result.rows.map(row => ({
            id: row.id,
            name: row.name || 'Unknown Part',
            description: row.description || 'No description',
            price: parseInt(row.price) || 0,
            category: row.category || 'Uncategorized',
            stock: (row.stock && row.stock > 0) ? 'In Stock' : 'Out of Stock',
            stockQty: row.stock,
            condition: row.condition || 'New',
            sellerId: row.seller_id,
            image: (() => {
              try {
                const imgs = JSON.parse(row.images || '[]');
                return imgs.length > 0 ? imgs[0].url : null;
              } catch { return null; }
            })()
          }));
          setAllParts(formattedParts);
        }
      } catch (error) {
        console.error('Error loading parts from Turso:', error);
      }
    };
    loadParts();
  }, []);


  const categories = ["All", "Engine Parts", "Transmission & Drivetrain", "Electrical System", "Suspension & Steering",
    "Brake System", "Cooling System", "Fuel System", "Exhaust System", "Body & Interior",
    "AC & Heating", "Fluids & Maintenance", "Tools & Accessories", "Wheels & Tires"];

  // Defensive filtering
  const filteredParts = Array.isArray(allParts) ? allParts.filter(part => {
    if (!part) return false;
    const matchesCategory = selectedCategory === "All" || part.category === selectedCategory;
    const nameMatch = (part.name && typeof part.name === 'string') ? part.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const descMatch = (part.description && typeof part.description === 'string') ? part.description.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return matchesCategory && (nameMatch || descMatch);
  }) : [];

  const handleAddToCart = (part) => {
    if (!part) return;
    const cartItem = {
      type: 'part',
      timestamp: new Date().toISOString(),
      product: {
        id: part.id || Date.now(),
        name: part.name || "Unknown Part",
        description: part.description || "",
        category: part.category || "Uncategorized",
        price: part.price || 0,
        stock: part.stock || "Unknown"
      },
      pricing: {
        basePrice: part.price || 0,
        total: part.price || 0
      },
      quantity: 1
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`✅ ${part.name} added to cart!\n\nPrice: ₹${(part.price || 0).toLocaleString()}\nCategory: ${part.category}`);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation cartCount={0} />

      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rotate-45 blur-lg animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-20 right-32 w-36 h-36 bg-gradient-to-br from-amber-500/15 to-yellow-600/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                Spare Parts Catalog
              </h1>
              <p className="text-muted-foreground text-lg">
                Premium automotive parts for all your customization and maintenance needs
              </p>
            </div>
            <Button
              onClick={() => navigate('/request-part')}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Request Part
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-red-500 to-orange-500" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Parts Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredParts.length} of {allParts.length} parts
          </p>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParts.map(part => (
            <Card key={part.id || Math.random()} className="hover:shadow-[var(--shadow-card)] transition-all duration-300">
              {part.image && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{part.name}</CardTitle>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {part.stock}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="w-fit">
                    {part.category}
                  </Badge>
                  {part.condition && (
                    <Badge variant="secondary" className="w-fit capitalize bg-blue-500/10 text-blue-500 border-blue-500/20">
                      {part.condition}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {part.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ₹{(part.price || 0).toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(part)}
                    className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredParts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No parts found matching your criteria.</p>
          </div>
        )}

        {/* Request Part CTA */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-600/10 to-amber-600/10 border-2 border-primary">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Can't Find What You Need?</h3>
            <p className="text-muted-foreground mb-4">
              We can help you source any automotive part. Submit a request and our team will get back to you within 24 hours.
            </p>
            <Button
              onClick={() => navigate('/request-part')}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
              size="lg"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Request a Part
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parts;