import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import ShoppingCart from "@/components/cart/shopping-cart";
import { 
  Layers, 
  Search, 
  User, 
  ShoppingCartIcon, 
  Menu, 
  X 
} from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Caps", href: "/category/caps" },
    { name: "Shoes", href: "/category/shoes" },
    { name: "Shorts", href: "/category/shorts" },
    { name: "Pants", href: "/category/pants" },
    { name: "Jersey", href: "/category/jersey" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer" data-testid="logo">
                <Layers className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">Stacked Vintage</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a 
                    className={`text-foreground hover:text-primary transition-colors ${
                      location === item.href ? "text-primary font-medium" : ""
                    }`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" data-testid="button-search">
                <Search className="h-5 w-5" />
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.username}
                  </span>
                  {user.isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" data-testid="button-admin">
                        Admin
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" size="icon" data-testid="button-account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCartOpen(true)}
                data-testid="button-cart"
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a 
                      className={`block px-3 py-2 rounded-md text-foreground hover:text-primary transition-colors ${
                        location === item.href ? "text-primary font-medium bg-primary/10" : ""
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
