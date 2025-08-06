import { Link } from "wouter";
import { Heart, Award, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Quality",
      description: "We carefully curate each product to ensure exceptional quality and craftsmanship that reflects our commitment to excellence.",
    },
    {
      icon: Award,
      title: "Cultural Heritage",
      description: "Celebrating the rich traditions of design while embracing contemporary aesthetics to create timeless pieces.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority. We provide exceptional service and support throughout your shopping journey.",
    },
    {
      icon: Globe,
      title: "Sustainable Fashion",
      description: "Committed to ethical practices and sustainable fashion that respects both people and our planet.",
    },
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "With over 15 years in fashion design, Priya brings her vision of modern cultural fusion to Desipalette.",
    },
    {
      name: "Arjun Patel",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Arjun ensures smooth operations and maintains our high standards of customer service and product quality.",
    },
    {
      name: "Meera Reddy",
      role: "Senior Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      description: "Meera travels globally to source unique pieces and works directly with artisans to bring you exclusive collections.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-neutral to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6" data-testid="text-about-title">
                About <span className="text-accent">Desipalette</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="text-about-description">
                We are passionate about bringing you the finest collection of fashion and lifestyle products that celebrate cultural heritage while embracing modern design sensibilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="bg-primary text-white hover:bg-gray-800" data-testid="button-shop-collection">
                    Shop Our Collection
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" data-testid="button-get-in-touch">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Fashion design studio with colorful fabrics and sketches" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                data-testid="img-about-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6" data-testid="text-story-title">
              Our Story
            </h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6" data-testid="text-story-paragraph-1">
              Founded in 2020, Desipalette began as a vision to bridge the gap between traditional craftsmanship and contemporary design. Our founders, inspired by their travels across diverse cultures and their deep appreciation for artisanal work, wanted to create a platform where authentic, high-quality products could reach fashion-conscious consumers worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6" data-testid="text-story-paragraph-2">
              What started as a small collection of handpicked ethnic wear has grown into a comprehensive lifestyle brand offering everything from contemporary fusion clothing to premium accessories and home decor. Each piece in our collection tells a story, reflecting the skill and passion of the artisans who create them.
            </p>
            <p className="text-gray-700 leading-relaxed" data-testid="text-story-paragraph-3">
              Today, Desipalette is more than just an e-commerce platform – we're a community that celebrates diversity, quality, and sustainable fashion. We work directly with skilled artisans and ethical manufacturers to ensure that every purchase supports fair trade practices and preserves traditional crafts for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="text-values-title">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our commitment to you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow" data-testid={`value-card-${index}`}>
                <CardContent className="p-6">
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-primary mb-3" data-testid={`text-value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed" data-testid={`text-value-description-${index}`}>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="text-team-title">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Desipalette who work tirelessly to bring you exceptional products and service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="text-center group" data-testid={`team-member-${index}`}>
                <div className="relative mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                    data-testid={`img-team-member-${index}`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2" data-testid={`text-team-name-${index}`}>
                  {member.name}
                </h3>
                <p className="text-accent font-medium mb-3" data-testid={`text-team-role-${index}`}>
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed" data-testid={`text-team-description-${index}`}>
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6" data-testid="text-cta-title">
            Join Our Journey
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            Become part of the Desipalette community and discover unique pieces that celebrate culture, craftsmanship, and contemporary style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-accent text-white hover:bg-pink-600 px-8 py-3" data-testid="button-cta-shop">
                Start Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3" data-testid="button-cta-contact">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
