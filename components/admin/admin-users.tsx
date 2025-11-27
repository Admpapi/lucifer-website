"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwner = session?.user?.role === "OWNER";

  useEffect(() => {
    if (isOwner) {
      fetchUsers();
    }
  }, [isOwner]);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleMakeAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!adminEmail) {
      setError("Please enter an email address");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, role: "ADMIN" })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add admin");
        return;
      }

      setSuccess(true);
      setAdminEmail("");
      await fetchUsers();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to add admin");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOwner) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Only owners can manage users and permissions.</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Admin */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Add Admin</h3>
        <form onSubmit={handleMakeAdmin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Admin added successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="adminEmail">Email Address</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Admin"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div>
        <h3 className="font-semibold mb-4">All Users</h3>
        {users.length === 0 ? (
          <p className="text-muted-foreground">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "OWNER"
                            ? "bg-red-100 text-red-800"
                            : user.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.role === "USER" && (
                        <Button variant="outline" size="sm">
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
