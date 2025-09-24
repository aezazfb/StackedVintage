import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      // Store cart in localStorage for now
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Trigger a custom event to update cart count
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      setIsAdding(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
      setIsAdding(false);
    },
  });

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast({
        title: "Out of stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    addToCartMutation.mutate();
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`product-image-${product.id}`}
        />
        {product.quantity < 5 && product.quantity > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Low Stock
            </Badge>
          </div>
        )}
        {product.quantity === 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-foreground" data-testid={`product-price-${product.id}`}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground" data-testid={`product-stock-${product.id}`}>
            {product.quantity > 0 ? `${product.quantity} left` : "Out of stock"}
          </span>
        </div>
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={isAdding || product.quantity === 0}
          data-testid={`add-to-cart-${product.id}`}
        >
          {isAdding ? (
            "Adding..."
          ) : product.quantity === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
