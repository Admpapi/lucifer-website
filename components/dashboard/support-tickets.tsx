"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  responses: Array<{
    id: string;
    message: string;
    isAdmin: boolean;
    createdAt: string;
  }>;
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const response = await fetch("/api/support-tickets");
      const data = await response.json();

      if (response.ok) {
        setTickets(data.tickets || []);
      } else {
        setError(data.error || "Failed to fetch tickets");
      }
    } catch (err) {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.message) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/support-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create ticket");
        return;
      }

      setSuccess(true);
      setNewTicket({ subject: "", message: "" });
      await fetchTickets();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      WAITING: "bg-orange-100 text-orange-800",
      CLOSED: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-green-100 text-green-800",
      NORMAL: "bg-blue-100 text-blue-800",
      HIGH: "bg-orange-100 text-orange-800",
      URGENT: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Ticket */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Create New Support Ticket</h3>
        <form onSubmit={handleCreateTicket} className="space-y-4">
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
                Ticket created successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={newTicket.message}
              onChange={(e) =>
                setNewTicket({ ...newTicket, message: e.target.value })
              }
              placeholder="Describe your issue in detail"
              rows={5}
            />
          </div>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Ticket"}
          </Button>
        </form>
      </div>

      {/* Tickets List */}
      <div>
        <h3 className="font-semibold mb-4">Your Tickets</h3>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground">No support tickets yet.</p>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setOpenDialog(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      #{ticket.ticketNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.subject}</DialogTitle>
                <DialogDescription>
                  Ticket #{selectedTicket.ticketNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <div className="space-y-3 mt-2">
                    {selectedTicket.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg ${
                          response.isAdmin
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : "bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          {response.isAdmin ? "Support Team" : "You"}
                        </p>
                        <p className="text-sm mt-1">{response.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(response.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
