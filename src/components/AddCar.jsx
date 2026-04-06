import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Upload, X, Camera, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { query } from "@/lib/turso";

const AddCar = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    brand: "",
    model: "",
    year: "",
    price: "",

    // Technical Specifications
    engine: "",
    power: "",
    torque: "",
    transmission: "",
    fuelType: "",
    mileage: "",

    // Vehicle Details
    color: "",
    seating: "",
    doors: "",
    drivetrain: "",

    // Condition & History
    condition: "excellent",
    accidentHistory: "no",
    owners: "1",
    serviceHistory: "full",
    registrationState: "",
    registrationYear: "",

    // Features & Modifications
    modifications: "",
    features: "",
    description: "",

    // Pricing & Negotiation
    negotiable: true,

    // Additional Info
    location: "",
    availableForTestDrive: true,

    // Stock Status
    stockStatus: "available" // available or sold
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10;

    if (images.length + files.length > maxImages) {
      alert(`You can upload maximum ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    let processed = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        processed++;
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: reader.result,
          file: file
        }]);

        // When all files are processed
        if (processed === files.length) {
          clearInterval(progressInterval);
          setUploadProgress(100);
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 1) {
      alert("Please upload at least 1 image");
      return;
    }

    const sellerId = JSON.parse(localStorage.getItem('user') || '{}').email || 'unknown';
    const imagesJson = JSON.stringify(images.map(img => ({ url: img.url })));

    try {
      await query(
        `INSERT INTO cars (
          seller_id, name, brand, model, year, price, color, engine, power, torque,
          transmission, fuel_type, mileage, seating, doors, drivetrain,
          condition, accident_history, owners, service_history,
          registration_state, registration_year, modifications, features,
          description, location, negotiable, available_test_drive, stock_status, images
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          sellerId,
          formData.name, formData.brand, formData.model, formData.year, formData.price,
          formData.color, formData.engine, formData.power, formData.torque,
          formData.transmission, formData.fuelType, formData.mileage,
          formData.seating, formData.doors, formData.drivetrain,
          formData.condition, formData.accidentHistory, formData.owners, formData.serviceHistory,
          formData.registrationState, formData.registrationYear,
          formData.modifications, formData.features,
          formData.description, formData.location,
          formData.negotiable ? 1 : 0,
          formData.availableForTestDrive ? 1 : 0,
          formData.stockStatus,
          imagesJson
        ]
      );
      alert("Car listing added successfully!");
      navigate('/seller-dashboard');
    } catch (err) {
      console.error('[AddCar] DB error:', err);
      alert("Failed to save car listing. Please try again.");
    }
  };


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
          <Button variant="outline" onClick={() => navigate('/seller-dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Add New Car Listing
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill in the details to list your car for sale
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Car Images (Required - Min 1, Max 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Car ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setSelectedImage(image);
                        setShowUploadModal(true);
                      }}
                    />
                    {index === 0 && (
                      <Badge className="absolute top-2 left-2 bg-primary">Primary</Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {images.length < 10 && (
                  <label className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors relative">
                    {uploading ? (
                      <>
                        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</span>
                        <div className="w-full px-4 mt-2">
                          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Upload up to 10 high-quality images. First image will be the primary display image.
              </p>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Car Name/Title *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Mahindra Thar Custom"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Mahindra"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Model *</label>
                  <input
                    type="text"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Thar LX"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <input
                    type="number"
                    name="year"
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2022"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 2500000"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Color *</label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Red"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Engine *</label>
                  <input
                    type="text"
                    name="engine"
                    required
                    value={formData.engine}
                    onChange={handleInputChange}
                    placeholder="e.g., 2.2L Turbo Diesel"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Power *</label>
                  <input
                    type="text"
                    name="power"
                    required
                    value={formData.power}
                    onChange={handleInputChange}
                    placeholder="e.g., 130 BHP @ 3750 RPM"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Torque *</label>
                  <input
                    type="text"
                    name="torque"
                    required
                    value={formData.torque}
                    onChange={handleInputChange}
                    placeholder="e.g., 300 Nm @ 1600 RPM"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transmission *</label>
                  <select
                    name="transmission"
                    required
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="DCT">DCT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Type *</label>
                  <select
                    name="fuelType"
                    required
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mileage/Km Run *</label>
                  <input
                    type="text"
                    name="mileage"
                    required
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g., 15,000 km"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Seating Capacity *</label>
                  <select
                    name="seating"
                    required
                    value={formData.seating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Seating</option>
                    <option value="2">2 Seater</option>
                    <option value="4">4 Seater</option>
                    <option value="5">5 Seater</option>
                    <option value="7">7 Seater</option>
                    <option value="8">8 Seater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Doors *</label>
                  <select
                    name="doors"
                    required
                    value={formData.doors}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Doors</option>
                    <option value="2">2 Doors</option>
                    <option value="3">3 Doors</option>
                    <option value="4">4 Doors</option>
                    <option value="5">5 Doors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Drivetrain *</label>
                  <select
                    name="drivetrain"
                    required
                    value={formData.drivetrain}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Drivetrain</option>
                    <option value="FWD">FWD (Front Wheel Drive)</option>
                    <option value="RWD">RWD (Rear Wheel Drive)</option>
                    <option value="AWD">AWD (All Wheel Drive)</option>
                    <option value="4WD">4WD (Four Wheel Drive)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition & History */}
          <Card>
            <CardHeader>
              <CardTitle>Condition & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Overall Condition *</label>
                  <select
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs-work">Needs Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Accident History *</label>
                  <select
                    name="accidentHistory"
                    required
                    value={formData.accidentHistory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="no">No Accidents</option>
                    <option value="minor">Minor Accident (Repaired)</option>
                    <option value="major">Major Accident (Repaired)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Owners *</label>
                  <select
                    name="owners"
                    required
                    value={formData.owners}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1">1st Owner</option>
                    <option value="2">2nd Owner</option>
                    <option value="3">3rd Owner</option>
                    <option value="4+">4+ Owners</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service History *</label>
                  <select
                    name="serviceHistory"
                    required
                    value={formData.serviceHistory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="full">Full Service History</option>
                    <option value="partial">Partial Service History</option>
                    <option value="none">No Service History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Registration Place (City/State) *</label>
                  <input
                    type="text"
                    name="registrationState"
                    required
                    value={formData.registrationState}
                    onChange={handleInputChange}
                    placeholder="e.g., Chennai, Madurai"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Registration Year *</label>
                  <input
                    type="number"
                    name="registrationYear"
                    required
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.registrationYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2022"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modifications & Features */}
          <Card>
            <CardHeader>
              <CardTitle>Modifications & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Modifications (One per line)</label>
                  <textarea
                    name="modifications"
                    value={formData.modifications}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="e.g.,&#10;Off-Road Bumper&#10;Lift Kit&#10;Custom Wheels"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (One per line)</label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="e.g.,&#10;Sunroof&#10;Leather Seats&#10;Navigation System&#10;Cruise Control"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Description *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Provide a detailed description of the car, its condition, why you're selling, etc."
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Anna Nagar, Chennai"
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="negotiable"
                      checked={formData.negotiable}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">Price is Negotiable</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="availableForTestDrive"
                      checked={formData.availableForTestDrive}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">Available for Test Drive</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
            >
              <Save className="h-5 w-5 mr-2" />
              Publish Car Listing
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/seller-dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Image Preview Modal */}
      {showUploadModal && selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10"
              onClick={() => setShowUploadModal(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage.url}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg border border-white/20"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-2 rounded-lg text-sm">
              Click outside or press X to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCar;