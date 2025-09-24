import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus, Minus, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    };

    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const updateQuantity = (id: string, change: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cartItems.filter(item => item.id !== id);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!customerName || !customerEmail) {
        throw new Error("Please provide your name and email");
      }

      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }

      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price),
      }));

      const res = await apiRequest("POST", "/api/orders", {
        customerName,
        customerEmail,
        items: orderItems,
        totalAmount,
      });

      return await res.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Order placed successfully!",
        description: `Order #${order.id.slice(0, 8)} has been confirmed. You will receive an email shortly.`,
      });
      clearCart();
      setCustomerName("");
      setCustomerEmail("");
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    checkoutMutation.mutate();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg" data-testid="shopping-cart">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-cart">
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button onClick={onClose} className="mt-4">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground" data-testid={`item-name-${item.id}`}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`item-price-${item.id}`}>
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, -1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center" data-testid={`item-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cartItems.length > 0 && (
            <div className="border-t border-border pt-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Full Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    data-testid="input-customer-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="Enter your email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    data-testid="input-customer-email"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span data-testid="cart-total">${totalAmount.toFixed(2)}</span>
              </div>

              <Button 
                className="w-full" 
                onClick={handleCheckout}
                disabled={checkoutMutation.isPending || !customerName || !customerEmail}
                data-testid="button-checkout"
              >
                {checkoutMutation.isPending ? "Processing..." : "Place Order"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onClose}
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
