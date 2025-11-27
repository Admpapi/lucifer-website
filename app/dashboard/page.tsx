"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(function redirectIfUnauthenticated() {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen"><h2>Loading...</h2></div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {session.user?.name}</h1>
            <p className="text-slate-400">{session.user?.email}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/auth/login" })} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Welcome to your dashboard! Here you can manage your account, view orders, and contact support.</p>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">orders placed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Manage your account information and preferences</p>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Need help? Create a support ticket</p>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">Open Ticket</Button>
                </CardContent>
              </Card>
            </div>

            {session.user?.role !== "USER" && (
              <Card className="mt-6 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">You have admin privileges. Access the admin dashboard to manage the store.</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Admin Dashboard</Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
