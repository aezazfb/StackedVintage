import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Layers } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    }
  }, [user, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Layers className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Stacked Vintage</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>Create a new account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                        data-testid="input-register-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        data-testid="input-register-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        data-testid="input-register-password"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-admin"
                        checked={registerData.isAdmin}
                        onCheckedChange={(checked) => 
                          setRegisterData({ ...registerData, isAdmin: checked as boolean })
                        }
                        data-testid="checkbox-admin"
                      />
                      <Label htmlFor="is-admin" className="text-sm">Register as admin</Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="flex-1 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Vintage Style,<br />
            <span className="text-primary">Modern Comfort</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Discover our curated collection of vintage-inspired clothing and accessories. 
            Each piece tells a story and brings timeless style to your wardrobe.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>✓ Premium Quality</div>
            <div>✓ Vintage Inspired</div>
            <div>✓ Fast Shipping</div>
            <div>✓ Easy Returns</div>
          </div>
        </div>
      </div>
    </div>
  );
}
