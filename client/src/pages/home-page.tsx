import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Category, Product } from "@shared/schema";

export default function HomePage() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Vintage Style,<br />
                <span className="text-primary">Modern Comfort</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover our curated collection of vintage-inspired clothing and accessories. 
                Each piece tells a story and brings timeless style to your wardrobe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-shop-collection">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg" data-testid="button-view-lookbook">
                  View Lookbook
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Vintage clothing collection display" 
                className="rounded-xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated categories featuring the best vintage-inspired pieces for every style.
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="w-full h-48 bg-muted"></div>
                  <div className="p-4 text-center">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <div className="group cursor-pointer" data-testid={`category-${category.slug}`}>
                    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img 
                        src={getCategoryImage(category.slug)} 
                        alt={`${category.name} collection`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-foreground">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">View Collection</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground">Hand-picked favorites from our vintage collection</p>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="w-full h-64 bg-muted"></div>
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="h-4 bg-muted rounded w-20 mb-3"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function getCategoryImage(slug: string): string {
  const images = {
    caps: "https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    shorts: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    pants: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    jersey: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
  };
  return images[slug as keyof typeof images] || images.caps;
}
