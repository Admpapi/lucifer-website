"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Notification {
  id: string;
  name: string;
  product: string;
  region: string;
  time: string;
}

const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Jessica", "James", "Maria", "Chris", "Amanda"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const regions = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Netherlands", "Spain", "Italy", "Sweden", "Norway", "Denmark"];
const products = ["Premium Account", "VIP Script", "Elite Bundle", "Premium Script", "Deluxe Package"];

export default function PurchaseNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateNotification = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    const now = new Date();
    const minutes = Math.floor(Math.random() * 10) + 1;
    const purchaseTime = new Date(now.getTime() - minutes * 60000);
    const timeString = purchaseTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const notification: Notification = {
      id: Date.now().toString(),
      name: `${firstName} ${lastName}`,
      product,
      region,
      time: timeString
    };

    setNotifications(prev => [notification, ...prev].slice(0, 3));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  useEffect(() => {
    // Generate first notification immediately
    generateNotification();

    // Generate new notifications every 1 second
    const interval = setInterval(() => {
      generateNotification();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-sm pointer-events-none">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="bg-white border border-green-200 rounded-lg shadow-lg p-3 pointer-events-auto animate-in slide-in-from-left-4 duration-300"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">
                🎉 {notification.name} purchased
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {notification.product}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>📍 {notification.region}</span>
                <span>•</span>
                <span>{notification.time}</span>
              </div>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
