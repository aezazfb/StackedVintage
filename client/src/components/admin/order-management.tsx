import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { Order } from "@shared/schema";

export default function OrderManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Loading orders...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>
          Manage customer orders and update their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8" data-testid="no-orders">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground">Orders will appear here when customers make purchases.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 border border-border rounded-lg"
                data-testid={`order-${order.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-medium text-foreground" data-testid={`order-id-${order.id}`}>
                        #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-foreground" data-testid={`customer-name-${order.id}`}>
                      {order.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`customer-email-${order.id}`}>
                      {order.customerEmail}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-foreground" data-testid={`order-amount-${order.id}`}>
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge className={`${getStatusColor(order.status)} border-0`} data-testid={`order-status-${order.id}`}>
                    {order.status}
                  </Badge>
                  
                  <Select 
                    value={order.status} 
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-32" data-testid={`status-select-${order.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`view-order-${order.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
