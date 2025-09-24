import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Product } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const categorySlug = params?.slug;

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: categorySlug }],
    queryFn: async () => {
      const response = await fetch(`/api/products?category=${categorySlug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    enabled: !!categorySlug,
  });

  const categoryName = categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid={`title-${categorySlug}`}>
            {categoryName}
          </h1>
          <p className="text-muted-foreground">
            Discover our collection of vintage-inspired {categoryName.toLowerCase()}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : error ? (
          <div className="text-center py-8" data-testid="error-message">
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load products</h3>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-state">
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              We don't have any {categoryName.toLowerCase()} available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
