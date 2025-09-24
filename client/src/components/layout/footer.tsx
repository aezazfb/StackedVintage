import { Link } from "wouter";
import { Layers, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Stacked Vintage</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Curating timeless vintage-inspired fashion for the modern wardrobe. 
              Each piece tells a story.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/category/caps">
                <a className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Caps
                </a>
              </Link>
              <Link href="/category/shoes">
                <a className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shoes
                </a>
              </Link>
              <Link href="/category/shorts">
                <a className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shorts
                </a>
              </Link>
              <Link href="/category/pants">
                <a className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Pants
                </a>
              </Link>
              <Link href="/category/jersey">
                <a className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Jersey
                </a>
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Customer Service</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Shipping Info
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Returns
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Size Guide
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>hello@stackedvintage.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Vintage St, Fashion District</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Stacked Vintage. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
