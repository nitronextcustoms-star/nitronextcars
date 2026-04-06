import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Navigation from './Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Headphones,
  FileText,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw
} from 'lucide-react';

const CustomerService = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: '',
    orderId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Send email using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          category: contactForm.category,
          orderId: contactForm.orderId,
          subject: contactForm.subject,
          message: contactForm.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Save ticket to localStorage (optional backup)
      const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
      const newTicket = {
        ...contactForm,
        ticketId: `TKT${Date.now()}`,
        date: new Date().toISOString(),
        status: 'open',
        priority: 'normal'
      };
      tickets.push(newTicket);
      localStorage.setItem('supportTickets', JSON.stringify(tickets));

      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: 'general',
          message: '',
          orderId: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      category: 'Orders & Shipping',
      icon: Package,
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout. Free shipping is included on all orders.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order from the "My Orders" section in your account.'
        },
        {
          question: 'Can I change my delivery address?',
          answer: 'You can change the delivery address within 24 hours of placing your order. Contact our support team immediately if you need to make changes.'
        }
      ]
    },
    {
      category: 'Payment & Pricing',
      icon: CreditCard,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Credit/Debit Cards, UPI, and Cash on Delivery (COD). All transactions are secure and encrypted.'
        },
        {
          question: 'Is there GST included in the price?',
          answer: 'Yes, all prices shown include 18% GST. The final price breakdown is displayed at checkout.'
        }
      ]
    },


    {
      category: 'Account & Technical',
      icon: HelpCircle,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Login / Sign Up" in the navigation menu and choose between Buyer or Seller account. Fill in your details to create your account.'
        },
        {
          question: 'I forgot my password, what should I do?',
          answer: 'Click "Forgot Password" on the login page and enter your email. We\'ll send you a password reset link.'
        },
        {
          question: 'Is my information secure?',
          answer: 'Yes! We use industry-standard encryption and security measures to protect your personal and payment information.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 8015725151',
      subtext: 'Mon-Sat, 9 AM - 6 PM',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      link: 'tel:+918015725151'
    },
    {
      icon: Mail,
      title: 'Email Support',
      content: 'nitronextcustoms@gmail.com',
      subtext: 'Response within 24 hours',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      link: 'mailto:nitronextcustoms@gmail.com'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      content: 'Chat with us',
      subtext: 'Available 24/7',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Nagercoil',
      subtext: 'Mon-Sat, 10 AM - 7 PM',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Customer Service
          </h1>
          <p className="text-xl text-muted-foreground">
            We're here to help! Get support for orders, products, and more.
          </p>
        </div>

        {/* Quick Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            const CardContent = method.link ? 'a' : 'div';
            const cardProps = method.link ? { href: method.link } : {};

            return (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
                <CardContent {...cardProps} className="p-6 text-center block no-underline">
                  <div className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <h3 className="font-bold mb-2">{method.title}</h3>
                  <p className={`font-semibold ${method.color} mb-1`}>{method.content}</p>
                  <p className="text-xs text-muted-foreground">{method.subtext}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQs Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqs.map((category, catIndex) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={catIndex}>
                        <div className="flex items-center gap-2 mb-4">
                          <CategoryIcon className="h-5 w-5 text-primary" />
                          <h3 className="font-bold text-lg">{category.category}</h3>
                        </div>
                        <div className="space-y-2">
                          {category.questions.map((faq, faqIndex) => {
                            const faqId = `${catIndex}-${faqIndex}`;
                            const isExpanded = expandedFaq === faqId;

                            return (
                              <div key={faqIndex} className={`border border-border rounded-lg overflow-hidden transition-colors ${isExpanded ? "bg-white text-black" : ""}`}>
                                <button
                                  onClick={() => toggleFaq(faqId)}
                                  className={`w-full p-4 text-left flex items-center justify-between transition-colors ${isExpanded
                                    ? "bg-white text-black"
                                    : "hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                                    }`}
                                >
                                  <span className="font-semibold pr-4">{faq.question}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 flex-shrink-0" />
                                  )}
                                </button>
                                {isExpanded && (
                                  <div className="px-4 pb-4 bg-white text-black">
                                    {faq.answer}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={contactForm.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        name="category"
                        required
                        value={contactForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="technical">Technical Issue</option>
                        <option value="payment">Payment Issue</option>
                        <option value="product">Product Question</option>
                        <option value="complaint">Complaint</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Order ID (Optional)</label>
                      <input
                        type="text"
                        name="orderId"
                        value={contactForm.orderId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="ORD123456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Brief subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        name="message"
                        required
                        value={contactForm.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Describe your issue or question..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                    {submitError && (
                      <p className="text-red-500 text-sm mt-2 text-center">{submitError}</p>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-semibold text-red-500">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/orders')}>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Track Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  Check the status of your orders and shipments
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  User guides, manuals, and tutorials
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Priority Support</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to premium support for faster assistance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
