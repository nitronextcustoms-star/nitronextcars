import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";

const Booking = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    carModel: ""
  });

  const [submitted, setSubmitted] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending to backend
    console.log("Booking submitted:", formData);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        carModel: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={0} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Book Our Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our expert team to discuss your custom car needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm">+91 8015725151</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm">nitronextcustoms@gmail.com</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground text-sm">Nagercoil</p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle>Schedule Your Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Booking Request Submitted! ✓
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you! Our team will contact you soon to confirm your appointment.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact & Car Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="mb-2 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="carModel" className="mb-2 block">
                        Car Model/Year *
                      </Label>
                      <Input
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleChange}
                        placeholder="e.g., Mahindra Thar 2022"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="mt-12 bg-card/50 backdrop-blur border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-primary">Step 1: Booking</h3>
                <p className="text-muted-foreground text-sm">
                  Fill out the simple form with your contact details and car information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Step 2: Confirmation</h3>
                <p className="text-muted-foreground text-sm">
                  Our team will contact you to confirm your appointment and discuss details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Step 3: Consultation</h3>
                <p className="text-muted-foreground text-sm">
                  Meet with our experts to discuss your customization needs and get a quote.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Step 4: Implementation</h3>
                <p className="text-muted-foreground text-sm">
                  Once approved, we'll get started on your custom modifications immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Booking;
