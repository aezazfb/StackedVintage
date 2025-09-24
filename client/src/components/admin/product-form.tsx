import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload } from "lucide-react";
import { Category, Product } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("categoryId", data.categoryId);
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product created",
        description: "Product has been successfully created.",
      });
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; slug: string; description?: string }) => {
      const res = await apiRequest("POST", "/api/categories", categoryData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Category created",
        description: "Category has been successfully created.",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  const initializeCategories = () => {
    const defaultCategories = [
      { name: "Caps", slug: "caps", description: "Vintage-style caps and hats" },
      { name: "Shoes", slug: "shoes", description: "Classic and vintage sneakers" },
      { name: "Shorts", slug: "shorts", description: "Casual vintage-inspired shorts" },
      { name: "Pants", slug: "pants", description: "Vintage jeans and trousers" },
      { name: "Jersey", slug: "jersey", description: "Vintage jerseys and athletic wear" },
    ];

    defaultCategories.forEach(category => {
      createCategoryMutation.mutate(category);
    });
  };

  return (
    <div className="space-y-6">
      {/* Initialize Categories */}
      {categories.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Required</CardTitle>
            <CardDescription>Initialize the default product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={initializeCategories} data-testid="button-init-categories">
              Initialize Categories
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Create a new product for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter product name"
                  data-testid="input-product-name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={form.watch("categoryId")} 
                  onValueChange={(value) => form.setValue("categoryId", value)}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && (
                  <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...form.register("price")}
                  placeholder="0.00"
                  data-testid="input-product-price"
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...form.register("quantity")}
                  placeholder="0"
                  data-testid="input-product-quantity"
                />
                {form.formState.errors.quantity && (
                  <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter product description"
                rows={3}
                data-testid="textarea-product-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto max-h-48 rounded-lg" 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Drop image here or click to upload</p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      data-testid="input-product-image"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createProductMutation.isPending}
              data-testid="button-save-product"
            >
              {createProductMutation.isPending ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Products</CardTitle>
          <CardDescription>Manage your current product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No products created yet</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`product-item-${product.id}`}>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">${parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
