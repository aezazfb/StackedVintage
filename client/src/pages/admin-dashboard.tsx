import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductForm from "@/components/admin/product-form";
import OrderManagement from "@/components/admin/order-management";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  Layers
} from "lucide-react";
import { Product, Order } from "@shared/schema";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
    lowStockItems: products.filter(p => p.quantity < 5).length,
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Admin Panel</span>
          </div>
          
          <nav className="space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
              data-testid="nav-dashboard"
            >
              <TrendingUp className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
              data-testid="nav-products"
            >
              <Package className="mr-3 h-4 w-4" />
              Products
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
              data-testid="nav-orders"
            >
              <ShoppingBag className="mr-3 h-4 w-4" />
              Orders
            </Button>
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-foreground">{user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
          >
            <LogOut className="mr-3 h-4 w-4" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-card border-b border-border p-6">
          <h1 className="text-2xl font-bold text-foreground">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "products" && "Product Management"}
            {activeTab === "orders" && "Order Management"}
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.username}</p>
        </header>
        
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-foreground" data-testid="stat-revenue">
                          ${stats.totalRevenue.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-foreground" data-testid="stat-orders">
                          {stats.totalOrders}
                        </p>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Products</p>
                        <p className="text-2xl font-bold text-foreground" data-testid="stat-products">
                          {stats.totalProducts}
                        </p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Low Stock Items</p>
                        <p className="text-2xl font-bold text-destructive" data-testid="stat-low-stock">
                          {stats.lowStockItems}
                        </p>
                      </div>
                      <div className="bg-destructive/10 p-3 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No orders yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-2 font-medium text-foreground">Order ID</th>
                            <th className="text-left p-2 font-medium text-foreground">Customer</th>
                            <th className="text-left p-2 font-medium text-foreground">Amount</th>
                            <th className="text-left p-2 font-medium text-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b border-border" data-testid={`order-row-${order.id}`}>
                              <td className="p-2 text-foreground">{order.id.slice(0, 8)}...</td>
                              <td className="p-2 text-foreground">{order.customerName}</td>
                              <td className="p-2 text-foreground">${order.totalAmount}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "completed" ? "bg-green-100 text-green-800" :
                                  order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                                  order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "products" && <ProductForm />}
          {activeTab === "orders" && <OrderManagement />}
        </div>
      </div>
    </div>
  );
}
