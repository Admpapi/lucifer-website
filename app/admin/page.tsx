"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, BarChart3, Settings, ShoppingBag, AlertTriangle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import AdminProducts from "@/components/admin/admin-products";
import AdminOrders from "@/components/admin/admin-orders";
import AdminUsers from "@/components/admin/admin-users";
import AdminAnalytics from "@/components/admin/admin-analytics";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.role === "USER") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!session || session.user?.role === "USER") {
    return null;
  }

  const isOwner = session.user?.role === "OWNER";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">
              Role: <span className="font-semibold text-primary">{session.user?.role}</span>
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            {isOwner && (
              <>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="permissions" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Perms</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminProducts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and process customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminOrders />
              </CardContent>
            </Card>
          </TabsContent>

          {isOwner && (
            <>
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users and admin permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminUsers />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>View store performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminAnalytics />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Permissions</CardTitle>
                    <CardDescription>Manage admin access levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Configure admin permissions in the Users tab
                      </p>
                      <Link href="/admin?tab=users">
                        <Button>Manage Admins</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Permission Check */}
        {!isOwner && (
          <Card className="mt-8 border-yellow-500 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <AlertTriangle className="h-5 w-5" />
                Limited Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-800">
              <p>Your permissions are limited as an admin. Contact the owner to modify permissions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
