import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/nitronext-logo.png.png";

const Navigation = ({ cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="NitroNext Customs" 
              className="h-10 w-auto object-contain"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/cars" className="text-sm font-medium transition-colors hover:text-primary">
              Browse Cars
            </Link>
            <Link to="/parts" className="text-sm font-medium transition-colors hover:text-primary">
              Parts
            </Link>
            <Link to="/booking" className="text-sm font-medium transition-colors hover:text-primary">
              Book Service
            </Link>
            <Link to="/support" className="text-sm font-medium transition-colors hover:text-primary">
              Support
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline">{user.fullName || user.email}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-primary mt-1 capitalize">{user.userType}</p>
                  </div>
                  {user.userType === 'seller' && (
                    <Link
                      to="/seller-dashboard"
                      className="block px-4 py-2 hover:bg-primary/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-primary/10 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700">
                <User className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col py-4 gap-4">
            <Link 
              to="/cars" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Cars
            </Link>
            <Link 
              to="/parts" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Parts
            </Link>
            <Link 
              to="/booking" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Service
            </Link>
            <Link 
              to="/support" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;