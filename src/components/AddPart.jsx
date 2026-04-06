import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Upload, X, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { query } from "@/lib/turso";

const AddPart = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        compatibleBrands: "",
        compatibleModels: "",
        condition: "new",
        warranty: "",
    });

    const categories = [
        "Engine Parts",
        "Transmission & Drivetrain",
        "Electrical System",
        "Suspension & Steering",
        "Brake System",
        "Cooling System",
        "Fuel System",
        "Exhaust System",
        "Body & Interior",
        "AC & Heating",
        "Fluids & Maintenance",
        "Tools & Accessories",
        "Wheels & Tires"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxImages = 5;

        if (images.length + files.length > maxImages) {
            alert(`You can upload maximum ${maxImages} images`);
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: reader.result,
                    file: file
                }]);
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
                `INSERT INTO parts (seller_id, name, category, description, price, stock, compatible_brands, compatible_models, condition, warranty, images)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    sellerId,
                    formData.name,
                    formData.category,
                    formData.description,
                    formData.price,
                    parseInt(formData.stock) || 0,
                    formData.compatibleBrands || null,
                    formData.compatibleModels || null,
                    formData.condition,
                    formData.warranty || null,
                    imagesJson
                ]
            );
            alert("Part listing added successfully!");
            navigate('/seller-dashboard');
        } catch (err) {
            console.error('[AddPart] DB error:', err);
            alert("Failed to save part listing. Please try again.");
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
                        Add New Part Listing
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Fill in the details to list your automotive part for sale
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Image Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Part Images (Required - Min 1, Max 5)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                                {images.map((image, index) => (
                                    <div key={image.id} className="relative group">
                                        <img
                                            src={image.url}
                                            alt={`Part ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image.id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {images.length < 5 && (
                                    <label className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Part Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Performance Brake Pads"
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category *</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
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
                                        placeholder="e.g., 5000"
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        min="1"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 10"
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Condition *</label>
                                    <select
                                        name="condition"
                                        required
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="new">New</option>
                                        <option value="used">Used - Like New</option>
                                        <option value="refurbished">Refurbished</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Warranty (months)</label>
                                    <input
                                        type="number"
                                        name="warranty"
                                        min="0"
                                        value={formData.warranty}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 12"
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compatibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compatibility</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Compatible Brands</label>
                                    <input
                                        type="text"
                                        name="compatibleBrands"
                                        value={formData.compatibleBrands}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Toyota, Honda, Mahindra"
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Compatible Models</label>
                                    <input
                                        type="text"
                                        name="compatibleModels"
                                        value={formData.compatibleModels}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Fortuner, City, Thar"
                                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <label className="block text-sm font-medium mb-2">Detailed Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="6"
                                    placeholder="Provide a detailed description of the part, its features, specifications, etc."
                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
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
                            Publish Part Listing
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
        </div>
    );
};

export default AddPart;
