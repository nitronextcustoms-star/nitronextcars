import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { MessageSquare, Send } from "lucide-react";

const RequestPart = () => {
    const navigate = useNavigate();
    const [requestForm, setRequestForm] = useState({
        partName: "",
        category: "",
        carBrand: "",
        carModel: "",
        yearRange: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
        urgency: "normal"
    });

    const handleRequestFormChange = (e) => {
        const { name, value } = e.target;
        setRequestForm({
            ...requestForm,
            [name]: value
        });
    };

    const handleSubmitRequest = (e) => {
        e.preventDefault();

        // Save request to localStorage
        const existingRequests = JSON.parse(localStorage.getItem('partRequests') || '[]');
        const newRequest = {
            ...requestForm,
            id: Date.now(),
            status: 'pending',
            requestedAt: new Date().toISOString(),
            requestedBy: JSON.parse(localStorage.getItem('user') || '{}').email || 'guest'
        };

        existingRequests.push(newRequest);
        localStorage.setItem('partRequests', JSON.stringify(existingRequests));

        alert('Part request submitted successfully! We will contact you soon.');

        // Reset form and navigate back or stay? Let's navigate to parts or home, or just clear. 
        // User might want to request another, so let's just clear for now but maybe redirect to parts?
        // Let's stick to the previous behavior of resetting, but since it is a separate page now, maybe redirecting to parts list is better UX after success.
        // For now I'll just reset as per original code, but maybe add a back button.

        setRequestForm({
            partName: "",
            category: "",
            carBrand: "",
            carModel: "",
            yearRange: "",
            description: "",
            contactEmail: "",
            contactPhone: "",
            urgency: "normal"
        });

        // Optional: Navigate back to parts after successful submission
        // navigate('/parts'); 
    };

    return (
        <div className="min-h-screen bg-background relative">
            <Navigation />

            {/* Background elements similar to Parts page for consistency */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-600/20 to-amber-600/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-20 right-32 w-36 h-36 bg-gradient-to-br from-amber-500/15 to-yellow-600/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
                <Card className="border-2 border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <MessageSquare className="h-6 w-6" />
                            Request a Part
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Can't find the part you need? Fill out this form and we'll help you locate it.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitRequest} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Part Name *</label>
                                    <input
                                        type="text"
                                        name="partName"
                                        required
                                        value={requestForm.partName}
                                        onChange={handleRequestFormChange}
                                        placeholder="e.g., Brake Pads for Toyota Fortuner"
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={requestForm.category}
                                        onChange={handleRequestFormChange}
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Engine Parts">Engine Parts</option>
                                        <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                                        <option value="Electrical System">Electrical System</option>
                                        <option value="Suspension & Steering">Suspension & Steering</option>
                                        <option value="Brake System">Brake System</option>
                                        <option value="Cooling System">Cooling System</option>
                                        <option value="Fuel System">Fuel System</option>
                                        <option value="Exhaust System">Exhaust System</option>
                                        <option value="Body & Interior">Body & Interior</option>
                                        <option value="AC & Heating">AC & Heating</option>
                                        <option value="Tools & Accessories">Tools & Accessories</option>
                                        <option value="Wheels & Tires">Wheels & Tires</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Car Brand *</label>
                                    <input
                                        type="text"
                                        name="carBrand"
                                        required
                                        value={requestForm.carBrand}
                                        onChange={handleRequestFormChange}
                                        placeholder="e.g., Toyota, Mahindra"
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Car Model *</label>
                                    <input
                                        type="text"
                                        name="carModel"
                                        required
                                        value={requestForm.carModel}
                                        onChange={handleRequestFormChange}
                                        placeholder="e.g., Fortuner, Thar"
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Year Range</label>
                                    <input
                                        type="text"
                                        name="yearRange"
                                        value={requestForm.yearRange}
                                        onChange={handleRequestFormChange}
                                        placeholder="e.g., 2018-2022"
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Urgency</label>
                                    <select
                                        name="urgency"
                                        value={requestForm.urgency}
                                        onChange={handleRequestFormChange}
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="very-urgent">Very Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Additional Details</label>
                                <textarea
                                    name="description"
                                    value={requestForm.description}
                                    onChange={handleRequestFormChange}
                                    rows="3"
                                    placeholder="Please provide any additional information about the part you need..."
                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Email *</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        required
                                        value={requestForm.contactEmail}
                                        onChange={handleRequestFormChange}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Phone *</label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        required
                                        value={requestForm.contactPhone}
                                        onChange={handleRequestFormChange}
                                        placeholder="+91 XXXXXXXXXX"
                                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit Request
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/parts')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RequestPart;
