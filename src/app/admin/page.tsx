"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  DollarSign,
  MessageCircle,
  ExternalLink,
  Trash2,
  Download,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { siteConfig } from "@/config/site";

export default function AdminPortal() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const loadOrders = () => {
      try {
        const stored = localStorage.getItem("pookie_craft_orders");
        if (stored) {
          setOrders(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load orders", e);
      }
    };

    loadOrders();

    const handleUpdate = (e: any) => {
      if (e.detail) setOrders(e.detail);
    };

    window.addEventListener("pookie_craft_orders_updated", handleUpdate);
    return () =>
      window.removeEventListener("pookie_craft_orders_updated", handleUpdate);
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, order_status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("pookie_craft_orders", JSON.stringify(updated));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to remove this order inquiry?")) {
      const updated = orders.filter((o) => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem("pookie_craft_orders", JSON.stringify(updated));
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export.");
      return;
    }

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "City",
      "State",
      "Pincode",
      "Items Count",
      "Total Amount",
      "Channel",
      "Status",
    ];

    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString("en-IN"),
      `"${o.customer.name}"`,
      o.customer.phone,
      `"${o.customer.city}"`,
      `"${o.customer.state}"`,
      o.customer.pincode,
      o.items.reduce((s, i) => s + i.quantity, 0),
      o.total,
      o.channel,
      o.order_status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pookie_craft_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "ALL" && o.order_status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalInquiryRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="bg-ecru-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brass-700 text-xs font-mono uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Merchant Dashboard</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
              Order Inquiries &amp; Customer Leads
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="py-2.5 px-4 bg-white border border-craft-border rounded text-xs font-mono text-stone-700 hover:bg-stone-50 flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export CSV</span>
            </button>
            <Link
              href="/shop"
              className="btn-luxury py-2.5 px-4 text-xs font-mono uppercase tracking-wider"
            >
              View Live Storefront
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-craft-border shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Total Inquiries</span>
              <ShoppingBag className="w-4 h-4 text-forest-900" />
            </div>
            <p className="font-serif text-3xl font-bold text-forest-950">
              {orders.length}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Captured via WhatsApp &amp; Instagram
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-craft-border shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Inquiry Volume</span>
              <DollarSign className="w-4 h-4 text-forest-900" />
            </div>
            <p className="font-serif text-3xl font-bold text-forest-950">
              {siteConfig.currency.symbol}{totalInquiryRevenue.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Estimated basket value
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-craft-border shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Checkout Mode</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="font-serif text-2xl font-bold text-forest-950">
              {siteConfig.checkoutMode === "RAZORPAY" ? "Payment Gateway" : "WhatsApp Concierge"}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Phase 1 Direct Handshake Active
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-craft-border shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, order ref..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-craft-border rounded focus:outline-none focus:border-forest-800"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-stone-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-stone-50 border border-craft-border rounded px-3 py-1.5 text-xs font-mono text-stone-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW_INQUIRY">New Inquiry</option>
              <option value="HANDCRAFTING">Handcrafting</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-craft-border shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-ecru-100 flex items-center justify-center text-xl mx-auto mb-3">
                📋
              </div>
              <h3 className="font-serif text-lg text-forest-900 mb-1">
                No orders captured yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4 font-sans">
                When customers click checkout and proceed to WhatsApp or Instagram, their contact info and bag items will appear here automatically.
              </p>
              <Link
                href="/shop"
                className="btn-luxury py-2 px-4 text-xs font-mono uppercase tracking-wider inline-block"
              >
                Test Checkout Flow in Store
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-ecru-100/70 border-b border-craft-border font-mono text-stone-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-craft-border">
                  {filteredOrders.map((order) => {
                    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, "");
                    const customerWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hello ${order.customer.name}! Thank you for your order inquiry #${order.order_number} with The Pookie Craft Co.`
                    )}`;

                    return (
                      <tr key={order.id} className="hover:bg-ecru-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-forest-900">
                          {order.order_number}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-forest-950">
                            {order.customer.name}
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            {order.customer.phone}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {order.customer.city}, {order.customer.state} ({order.customer.pincode})
                          </p>
                          {order.customer.notes && (
                            <p className="text-[10px] italic text-brass-700 mt-0.5">
                              Note: &ldquo;{order.customer.notes}&rdquo;
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <ul className="space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="text-stone-700">
                                <span className="font-medium">{item.quantity}×</span> {item.name}
                                {item.variant && (
                                  <span className="text-[10px] text-stone-400 block font-mono">
                                    ({item.variant})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-forest-900">
                          {siteConfig.currency.symbol}{order.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              order.channel === "WHATSAPP"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {order.channel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.order_status}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-white border border-craft-border rounded px-2 py-1 text-xs font-mono text-stone-700 focus:outline-none"
                          >
                            <option value="NEW_INQUIRY">New Inquiry</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="HANDCRAFTING">Handcrafting</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <a
                            href={customerWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-1.5 rounded hover:bg-emerald-50 text-emerald-700 transition-colors"
                            title="Chat with Customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="inline-flex p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
