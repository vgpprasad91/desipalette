import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Contact form submitted:", data);
    
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    
    reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: [
        "123 Fashion Street",
        "Design District",
        "New York, NY 10001"
      ],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "+1 (555) 123-4567",
        "+1 (555) 123-4568",
        "Toll-free: 1-800-DESI-PAL"
      ],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "hello@desipalette.com",
        "support@desipalette.com",
        "orders@desipalette.com"
      ],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 7:00 PM",
        "Saturday: 10:00 AM - 6:00 PM",
        "Sunday: 12:00 PM - 5:00 PM"
      ],
    },
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the US. International shipping varies by location but typically takes 7-14 business days.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all items in original condition. Returns are free for orders over $100.",
    },
    {
      question: "Do you offer size exchanges?",
      answer: "Yes, we offer free size exchanges within 30 days of purchase. Simply contact our customer service team to arrange an exchange.",
    },
    {
      question: "Are your products authentic?",
      answer: "Absolutely! We work directly with verified artisans and authorized retailers to ensure all products are 100% authentic and of the highest quality.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-contact-title">
            Get in Touch
          </h1>
          <p className="text-xl max-w-2xl mx-auto" data-testid="text-contact-subtitle">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card data-testid="contact-form-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Send us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter your full name"
                        data-testid="input-contact-name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                        data-testid="input-contact-email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="Enter your phone number"
                        data-testid="input-contact-phone"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select onValueChange={(value) => setValue("subject", value)}>
                        <SelectTrigger data-testid="select-contact-subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="order">Order Support</SelectItem>
                          <SelectItem value="returns">Returns & Exchanges</SelectItem>
                          <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                          <SelectItem value="media">Media & Press</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px]"
                      data-testid="input-contact-message"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent text-white hover:bg-pink-600"
                    disabled={isSubmitting}
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card data-testid="contact-info-card">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={info.title} className="flex items-start space-x-4" data-testid={`contact-info-${index}`}>
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2" data-testid={`text-contact-info-title-${index}`}>
                        {info.title}
                      </h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600 text-sm" data-testid={`text-contact-info-detail-${index}-${detailIndex}`}>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card data-testid="quick-links-card">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/products" className="block text-gray-600 hover:text-accent transition-colors" data-testid="link-products">
                  Browse Products
                </a>
                <a href="/cart" className="block text-gray-600 hover:text-accent transition-colors" data-testid="link-cart">
                  View Cart
                </a>
                <a href="#" className="block text-gray-600 hover:text-accent transition-colors" data-testid="link-track-order">
                  Track Your Order
                </a>
                <a href="#" className="block text-gray-600 hover:text-accent transition-colors" data-testid="link-size-guide">
                  Size Guide
                </a>
                <a href="#" className="block text-gray-600 hover:text-accent transition-colors" data-testid="link-shipping-info">
                  Shipping Information
                </a>
                <a href="#" className="block text-gray-600 hover:text-accent transition-colors" data-testid="link-returns">
                  Returns & Exchanges
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card data-testid="faq-card">
            <CardHeader>
              <CardTitle className="text-2xl text-primary text-center">Frequently Asked Questions</CardTitle>
              <p className="text-center text-gray-600">
                Quick answers to common questions about our products and services
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <div key={faq.question} data-testid={`faq-item-${index}`}>
                    <h3 className="font-semibold text-primary mb-3" data-testid={`text-faq-question-${index}`}>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
