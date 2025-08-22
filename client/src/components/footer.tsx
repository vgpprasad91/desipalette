import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import logoImg from "@/assets/desipalette-logo.svg";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-primary text-primary-foreground footer-motif temple-pattern gold-border-top overflow-hidden relative" style={{ backgroundColor: '#2D0F15' }}>
      {/* Newsletter section */}
      <div className="bg-background py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl lg:text-4xl font-semibold mb-4 font-serif text-foreground">
            <span className="gold-shimmer">Join The House</span>
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Be first to discover new drops, private previews, and invitations.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                required
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-3">We respect your privacy. Unsubscribe anytime.</p>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-2xl font-semibold mb-4 tracking-[.2em]">
              DESIPALETTE
            </h4>
            <p className="text-primary-foreground/70 mb-6 max-w-md">
              A luxury curation celebrating Indian craftsmanship and contemporary forms. Designed to endure, crafted to be desired.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="bg-primary border-border hover:bg-primary/80" data-testid="button-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-primary border-border hover:bg-primary/80" data-testid="button-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-primary border-border hover:bg-primary/80" data-testid="button-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-primary border-border hover:bg-primary/80" data-testid="button-youtube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-medium mb-4">Quick Links</h5>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link href="/about" data-testid="link-about">
                  <span className="hover:text-primary-foreground transition-colors cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-contact">
                  <span className="hover:text-primary-foreground transition-colors cursor-pointer">Contact</span>
                </Link>
              </li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Size Guide</span></li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Returns</span></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h5 className="font-medium mb-4">Customer Service</h5>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">FAQ</span></li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Track Your Order</span></li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-primary-foreground transition-colors cursor-pointer">Bulk Orders</span></li>
            </ul>
          </div>
        </div>

        {/* Payment methods and copyright */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-primary-foreground/70 text-sm" data-testid="text-copyright">
                © 2024 DesiPalette. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-primary-foreground/70 text-sm">Secure payments with:</span>
              <div className="flex space-x-2">
                <div className="bg-primary px-2 py-1 rounded text-xs border border-border">UPI</div>
                <div className="bg-primary px-2 py-1 rounded text-xs border border-border">Paytm</div>
                <div className="bg-primary px-2 py-1 rounded text-xs border border-border">GPay</div>
                <div className="bg-primary px-2 py-1 rounded text-xs border border-border">RuPay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
