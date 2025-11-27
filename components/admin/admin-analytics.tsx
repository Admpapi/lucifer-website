"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  openTickets: number;
  completedOrders: number;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();

      if (response.ok) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || "Failed to fetch analytics");
      }
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <p>{error || "Failed to load analytics"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            ${analytics.totalRevenue.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analytics.totalOrders}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {analytics.completedOrders} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analytics.totalUsers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{analytics.totalProducts}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Open Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-600">
            {analytics.openTickets}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {analytics.totalUsers > 0
              ? ((analytics.totalOrders / analytics.totalUsers) * 100).toFixed(1)
              : "0"}
            %
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
