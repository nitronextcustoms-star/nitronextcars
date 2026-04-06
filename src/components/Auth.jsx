import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Phone, MapPin, Store, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { query } from "@/lib/turso";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("buyer"); // buyer or seller
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
    businessName: "",
    businessLicense: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Simple hash (btoa) — replace with bcrypt on a real backend
    const passwordHash = btoa(formData.password);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const result = await query(
          "SELECT id, email, full_name, user_type, business_name FROM users WHERE email = ? AND password_hash = ?",
          [formData.email, passwordHash]
        );

        if (!result || result.rows.length === 0) {
          alert("Invalid email or password.");
          return;
        }

        const dbUser = result.rows[0];
        const user = {
          email: dbUser.email,
          fullName: dbUser.full_name,
          userType: dbUser.user_type,
          businessName: dbUser.business_name
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', dbUser.user_type);
        alert(`Welcome back, ${dbUser.full_name || formData.email}!`);

        if (dbUser.user_type === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      } else {
        // --- SIGNUP ---
        // Check if email already exists
        const existingUser = await query(
          "SELECT id FROM users WHERE email = ?",
          [formData.email]
        );
        if (existingUser && existingUser.rows.length > 0) {
          alert("An account with this email already exists. Please sign in.");
          return;
        }

        await query(
          `INSERT INTO users (email, password_hash, full_name, phone, address, user_type, business_name, business_license)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            formData.email,
            passwordHash,
            formData.fullName,
            formData.phone,
            formData.address,
            userType,
            formData.businessName || null,
            formData.businessLicense || null
          ]
        );

        const user = {
          email: formData.email,
          fullName: formData.fullName,
          userType: userType,
          businessName: formData.businessName
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', userType);
        alert(`Account created successfully as ${userType}!`);

        if (userType === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('[Auth] DB error:', err);
      alert("Something went wrong. Please try again.");
    }
  };


  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      address: "",
      businessName: "",
      businessLicense: ""
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      {/* 3D Floating Shapes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-500/15 to-yellow-700/15 rounded-lg blur-2xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Join NitroNext Customs"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isLogin ? "Sign in to continue" : "Create your account to get started"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Type Selection (Only for Signup) */}
            {!isLogin && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Your Account Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setUserType("buyer")}
                        className={`p-6 rounded-lg border-2 transition-all ${userType === "buyer"
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50"
                          }`}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600/20 to-amber-600/20 flex items-center justify-center">
                            <ShoppingBag className="h-10 w-10 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">I'm a Buyer</h3>
                            <p className="text-sm text-muted-foreground">
                              Browse and purchase custom cars and parts
                            </p>
                          </div>
                          {userType === "buyer" && (
                            <Badge variant="default" className="bg-primary">Selected</Badge>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setUserType("seller")}
                        className={`p-6 rounded-lg border-2 transition-all ${userType === "seller"
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50"
                          }`}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600/20 to-amber-600/20 flex items-center justify-center">
                            <Store className="h-10 w-10 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">I'm a Seller</h3>
                            <p className="text-sm text-muted-foreground">
                              List and sell custom cars and parts
                            </p>
                          </div>
                          {userType === "seller" && (
                            <Badge variant="default" className="bg-primary">Selected</Badge>
                          )}
                        </div>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Login/Signup Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className={!isLogin ? "" : "md:col-span-2"}>
                        <label className="block text-sm font-medium mb-2">
                          <Mail className="inline h-4 w-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter your email"
                        />
                      </div>

                      {/* Full Name (Signup only) */}
                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <User className="inline h-4 w-4 mr-2" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your full name"
                          />
                        </div>
                      )}

                      {/* Password */}
                      <div className={!isLogin ? "" : "md:col-span-2"}>
                        <label className="block text-sm font-medium mb-2">
                          <Lock className="inline h-4 w-4 mr-2" />
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter your password"
                        />
                      </div>

                      {/* Confirm Password (Signup only) */}
                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Lock className="inline h-4 w-4 mr-2" />
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Confirm your password"
                          />
                        </div>
                      )}

                      {/* Phone (Signup only) */}
                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Phone className="inline h-4 w-4 mr-2" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      )}

                      {/* Address (Signup only) */}
                      {!isLogin && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            <MapPin className="inline h-4 w-4 mr-2" />
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your address"
                          />
                        </div>
                      )}

                      {/* Seller-specific fields */}
                      {!isLogin && userType === "seller" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <Store className="inline h-4 w-4 mr-2" />
                              Business Name
                            </label>
                            <input
                              type="text"
                              name="businessName"
                              required
                              value={formData.businessName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter your business name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Business License Number
                            </label>
                            <input
                              type="text"
                              name="businessLicense"
                              required
                              value={formData.businessLicense}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter business license number"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                      size="lg"
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                    </Button>

                    {/* Toggle Login/Signup */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-primary hover:underline"
                      >
                        {isLogin
                          ? "Don't have an account? Sign Up"
                          : "Already have an account? Sign In"}
                      </button>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        ← Back to Home
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;