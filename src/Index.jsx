import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import CarCard from "@/components/CarCard";
import { ArrowRight, Palette, Package, Zap } from "lucide-react";
import { useState, useEffect } from "react";
// Placeholder images since we don't have the actual assets
const heroImage = "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1920";
const thar1 = "https://images.unsplash.com/photo-1618843478823-008520c7ebb9?auto=format&fit=crop&w=800";
const fortuner1 = "https://images.unsplash.com/photo-1549399542-7e7f0c3c4baf?auto=format&fit=crop&w=800";
const swift1 = "https://images.unsplash.com/photo-1549317622-7a4f56912b97?auto=format&fit=crop&w=800";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation cartCount={0} />
      
      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s', animationDuration: '10s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rotate-45 blur-lg animate-float" style={{animationDelay: '1s', animationDuration: '7s'}}></div>
        <div className="absolute bottom-20 right-32 w-36 h-36 bg-gradient-to-br from-amber-500/15 to-yellow-600/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s', animationDuration: '9s'}}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale(1.1)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>
        
        {/* Parallax Layers */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-500/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            transform: `translate3d(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px, 0)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-yellow-600/40 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-amber-600/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl">
            NitroNext Customs
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium second-hand custom cars and performance parts. Build your dream machine.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/cars">
              <Button size="lg" className="gap-2 text-lg px-8">
                Browse Cars
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                <Palette className="h-5 w-5" />
                Book Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Card className="bg-card/50 backdrop-blur border-border hover:shadow-[var(--shadow-card)] transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Selection</h3>
              <p className="text-muted-foreground">
                Curated collection of custom-built performance vehicles
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border hover:shadow-[var(--shadow-card)] transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Performance Parts</h3>
              <p className="text-muted-foreground">
                Top-quality aftermarket parts and accessories
              </p>
            </CardContent>
          </Card>
        </div>

      </section>
    </div>
  );
};

export default Index;