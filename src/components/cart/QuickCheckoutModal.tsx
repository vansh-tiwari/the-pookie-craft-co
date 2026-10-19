"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { InstagramIcon } from "@/components/common/Icons";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { OrderCustomer, Order } from "@/types";
import {
  formatOrderNumber,
  buildWhatsAppMessage,
  getWhatsAppCheckoutUrl,
  saveOrderLead,
} from "@/utils/orderPayload";

export function QuickCheckoutModal() {
  const {
    items,
    subtotal,
    shipping,
    total,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState<OrderCustomer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in your name, contact number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    const orderNumber = formatOrderNumber();
    const orderRecord: Order = {
      id: "ord_" + Math.random().toString(36).substring(2, 9),
      order_number: orderNumber,
      customer: formData,
      items: [...items],
      subtotal,
      shipping,
      total,
      channel: "WHATSAPP",
      order_status: "NEW_INQUIRY",
      payment_status: "PENDING",
      created_at: new Date().toISOString(),
    };

    saveOrderLead(orderRecord);
    setSuccessOrder(orderRecord);

    const waUrl = getWhatsAppCheckoutUrl({
      orderNumber,
      customer: formData,
      items,
      subtotal,
      shipping,
      total,
    });

    setTimeout(() => {
      window.open(waUrl, "_blank");
      setIsSubmitting(false);
      clearCart();
    }, 600);
  };

  const handleCopyInstagramPayload = () => {
    const orderNumber = formatOrderNumber();
    const text = buildWhatsAppMessage({
      orderNumber,
      customer: formData,
      items,
      subtotal,
      shipping,
      total,
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    saveOrderLead({
      id: "ord_" + Math.random().toString(36).substring(2, 9),
      order_number: orderNumber,
      customer: formData,
      items: [...items],
      subtotal,
      shipping,
      total,
      channel: "INSTAGRAM",
      order_status: "NEW_INQUIRY",
      payment_status: "PENDING",
      created_at: new Date().toISOString(),
    });
  };

  const handleClose = () => {
    setSuccessOrder(null);
    closeCheckout();
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#1A281B]/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative transform overflow-hidden rounded-sm bg-[#FEF7ED] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-[#DCD1C1]"
            >
              {/* Modal Header */}
              <div className="bg-[#283C2A] px-6 py-5 text-[#FEF7ED] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[#967F4F] text-xs uppercase tracking-[0.2em] font-sans font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct Artisan Concierge</span>
                  </div>
                  <h3 className="text-xl font-serif font-light text-[#FEF7ED] mt-0.5">
                    Order Confirmation &amp; Delivery Details
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-[#FEF7ED]/70 hover:text-[#FEF7ED] hover:bg-[#354E38] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {successOrder ? (
                /* Success Confirmation State */
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F6EFE3] text-[#283C2A] mx-auto flex items-center justify-center border border-[#DCD1C1]">
                    <CheckCircle2 className="w-8 h-8 text-[#283C2A]" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#283C2A] font-light">
                    Order Inquiry Dispatched!
                  </h4>
                  <p className="text-sm text-[#687060] max-w-md mx-auto leading-relaxed font-sans font-light">
                    Order Ref:{" "}
                    <span className="font-sans font-medium text-[#283C2A]">
                      {successOrder.order_number}
                    </span>
                    .<br />
                    We opened WhatsApp with your exact order summary. If WhatsApp didn’t open automatically, you can message our studio directly.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={getWhatsAppCheckoutUrl({
                        orderNumber: successOrder.order_number,
                        customer: successOrder.customer,
                        items: successOrder.items,
                        subtotal: successOrder.subtotal,
                        shipping: successOrder.shipping,
                        total: successOrder.total,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-3 px-6 text-xs uppercase tracking-widest inline-flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4 text-[#967F4F]" />
                      <span>Reopen WhatsApp Chat</span>
                    </a>
                    <button
                      onClick={handleClose}
                      className="btn-secondary py-3 px-6 text-xs uppercase tracking-widest"
                    >
                      Return to Studio
                    </button>
                  </div>
                </div>
              ) : (
                /* Form State */
                <form onSubmit={handleWhatsAppCheckout} className="p-6 sm:p-8 space-y-6">
                  {/* Order Summary Strip */}
                  <div className="bg-[#F6EFE3] rounded-sm p-4 border border-[#DCD1C1] flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center space-x-2 text-[#687060]">
                      <ShoppingBag className="w-4 h-4 text-[#283C2A]" strokeWidth={1.5} />
                      <span>{items.reduce((s, i) => s + i.quantity, 0)} handcrafted item(s)</span>
                    </div>
                    <div>
                      <span className="text-[#687060] mr-2">Payable:</span>
                      <span className="text-[#283C2A] font-serif font-normal text-base">
                        {siteConfig.currency.symbol}{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Customer Inputs */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                          WhatsApp Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                        Shipping Address (House, Street, Area) *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Flat 402, Lotus Residency, 12th Main Rd"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Mumbai"
                          className="w-full px-3 py-2 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Maharashtra"
                          className="w-full px-3 py-2 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="400001"
                          className="w-full px-3 py-2 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-[#283C2A]/85 uppercase tracking-wider mb-1 font-medium">
                        Customization / Jersey Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="e.g. Please add custom name 'DHONI' and number '7', or add birthday note!"
                        className="w-full px-3.5 py-2 text-sm bg-[#FFFDF9] border border-[#DCD1C1] rounded-sm text-[#283C2A] focus:outline-none focus:border-[#283C2A] resize-none font-sans"
                      />
                    </div>
                  </div>

                  {/* Primary & Secondary Channel CTAs */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-4 px-6 flex items-center justify-center space-x-2 text-xs tracking-[0.16em] uppercase cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#967F4F]" />
                      <span>{isSubmitting ? "Connecting..." : "Confirm & Send Order via WhatsApp"}</span>
                    </button>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyInstagramPayload}
                        className="flex-1 py-2.5 px-3 border border-[#DCD1C1] rounded-sm text-xs font-sans text-[#687060] hover:text-[#283C2A] hover:bg-[#F6EFE3] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copied ? "Copied!" : "Copy Details"}</span>
                      </button>

                      <a
                        href={siteConfig.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 border border-[#DCD1C1] rounded-sm text-xs font-sans text-[#687060] hover:text-[#283C2A] hover:bg-[#F6EFE3] flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                        <span>Open Instagram</span>
                        <ExternalLink className="w-3 h-3 text-[#687060]" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-[#687060] text-center font-light">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#283C2A]" />
                    <span>No advance payment required. Direct handshake with the artisan studio.</span>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
