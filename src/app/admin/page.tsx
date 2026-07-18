"use client";

import React, { useState } from "react";
import { useStore, Product, Order } from "@/context/StoreContext";
import { synthAudio } from "@/components/AudioEngine";
import { CustomCursor, BackgroundParticles } from "@/components/Effects";
import { Navbar } from "@/components/Navbar";
import { 
  BarChart3, Package, Ticket, ShoppingBag, 
  ArrowUpRight, AlertCircle, Edit, Trash2, Plus, Check 
} from "lucide-react";

export default function AdminDashboard() {
  const { 
    products, orders, coupons, 
    updateStock, updateProductPrice, updateOrderStatus, addCoupon 
  } = useStore();

  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "orders" | "coupons">("overview");

  // New Coupon Form States
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [couponAddedMsg, setCouponAddedMsg] = useState("");

  // Quick edits helpers
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  // Math metrics
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    synthAudio.playChime();
    updateOrderStatus(orderId, status);
  };

  const handleAddNewCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    synthAudio.playChime();
    addCoupon(newCouponCode, newCouponDiscount);
    setCouponAddedMsg(`COUPON ${newCouponCode.toUpperCase()} SUCCESSFULLY LOADED WITH ${newCouponDiscount}% DISCOUNT`);
    setNewCouponCode("");
    setTimeout(() => setCouponAddedMsg(""), 3000);
  };

  const handleStartEditing = (product: Product) => {
    synthAudio.playClick();
    setEditingProductId(product.id);
    setEditPrice(product.price);
    setEditStock(product.stock);
  };

  const handleSaveEdit = (productId: string) => {
    synthAudio.playChime();
    updateProductPrice(productId, editPrice);
    updateStock(productId, editStock);
    setEditingProductId(null);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative pb-20">
      <CustomCursor />
      <BackgroundParticles />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        
        {/* Dashboard Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/5 pb-6">
          <div>
            <span className="font-mono text-[9px] text-accent-blue tracking-[0.3em] font-semibold block mb-2 uppercase">
              SORA LABS // ADMIN CONSOLE
            </span>
            <h2 className="text-3xl font-extrabold tracking-wide text-white uppercase font-sans">
              CONTROL PANEL GRID
            </h2>
          </div>

          {/* Navigation tab bar */}
          <div className="flex gap-2 mt-4 md:mt-0 font-mono text-[10px]">
            {[
              { id: "overview", label: "01 // OVERVIEW", icon: BarChart3 },
              { id: "inventory", label: "02 // LEDGER", icon: Package },
              { id: "orders", label: "03 // ORDERS", icon: ShoppingBag },
              { id: "coupons", label: "04 // COUPONS", icon: Ticket },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    synthAudio.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3 py-1.5 border rounded flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "border-accent-blue text-white bg-accent-blue/10 glow-blue"
                      : "border-white/5 text-silver hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Overview statistics card grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Sales */}
              <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="font-mono text-[9px] text-silver/60 tracking-wider">TOTAL REVENUE (SIM)</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">${totalSales}</span>
                  <span className="text-[10px] text-green-500 font-mono flex items-center gap-0.5 font-bold">
                    <ArrowUpRight className="w-3 h-3" /> +100%
                  </span>
                </div>
              </div>

              {/* Placed Orders */}
              <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="font-mono text-[9px] text-silver/60 tracking-wider">ORDERS COUNT</span>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white">{orders.length}</span>
                  <span className="font-mono text-[9px] text-accent-blue block mt-1">PLACED checkout</span>
                </div>
              </div>

              {/* Low stock counter */}
              <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="font-mono text-[9px] text-silver/60 tracking-wider">LOW STOCK ALERTS</span>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-white">{lowStockProducts.length}</span>
                  {lowStockProducts.length > 0 && (
                    <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[8px] font-mono border border-red-500/10 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-2.5 h-2.5" /> WARNING
                    </span>
                  )}
                </div>
              </div>

              {/* Coupons count */}
              <div className="glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                <span className="font-mono text-[9px] text-silver/60 tracking-wider">PROMO DISCOUNTS</span>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white">{Object.keys(coupons).length}</span>
                  <span className="font-mono text-[9px] text-accent-purple block mt-1">ACTIVE CODES</span>
                </div>
              </div>

            </div>

            {/* Quick manual simulation tips */}
            <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-2xl p-6 font-mono text-xs text-silver leading-relaxed">
              <h4 className="text-white font-bold mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-accent-blue" />
                SIMULATE THE INTEGRATION WORKFLOW
              </h4>
              <p>
                1. Go to the home page, add items to your cart, and complete check out to record a new order logs.<br />
                2. Navigate back here to the <span className="text-white">Orders Tab</span> to view your purchase and advance shipping states (e.g. mark it as Shipped).<br />
                3. Open your customer <span className="text-white">Account portal drawer</span> at top right to verify that the tracking timeline has updated dynamically!<br />
                4. You can also modify stock numbers in the <span className="text-white">Ledger Tab</span> to trigger &ldquo;Only 3 Left&rdquo; badges on the home page catalog cards.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT LEDGER */}
        {activeTab === "inventory" && (
          <div className="glass border border-white/5 rounded-2xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/3 border-b border-white/5 font-bold text-white text-[10px] uppercase">
                  <th className="p-4">PRODUCT CODE</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">STOCK LEDGER</th>
                  <th className="p-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/2 text-silver/80">
                {products.map((item) => {
                  const isEditing = editingProductId === item.id;
                  const isLowStock = item.stock <= 5;
                  
                  return (
                    <tr key={item.id} className="hover:bg-white/1">
                      <td className="p-4 font-bold text-accent-blue">{item.id.toUpperCase()}</td>
                      <td className="p-4 text-white font-semibold">{item.name}</td>
                      <td className="p-4 uppercase text-[10px]">{item.category}</td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="bg-black border border-white/15 rounded p-1 w-20 text-white font-mono"
                          />
                        ) : (
                          <span>${item.price}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="bg-black border border-white/15 rounded p-1 w-16 text-white font-mono"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={item.stock === 0 ? "text-red-500" : isLowStock ? "text-yellow-500" : "text-green-500"}>
                              {item.stock} UNITS
                            </span>
                            {isLowStock && (
                              <span className="bg-red-500/20 text-red-500 border border-red-500/10 text-[7px] px-1 rounded animate-pulse">
                                LOW
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 px-2.5 bg-green-500 text-black hover:bg-green-400 font-bold rounded text-[10px] cursor-pointer"
                          >
                            SAVE
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEditing(item)}
                            className="p-1 px-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-silver hover:text-white rounded text-[10px] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" /> EDIT
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS CONSOLE */}
        {activeTab === "orders" && (
          <div className="space-y-4 font-mono text-xs">
            {orders.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="glass border border-white/5 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-6 hover:border-white/10 transition-colors"
                  >
                    {/* Info */}
                    <div className="space-y-2 flex-grow max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{order.id}</span>
                        <span className="text-[8px] bg-accent-blue/15 text-accent-blue px-2 py-0.5 rounded font-mono uppercase">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="text-silver/60 text-[10px] leading-relaxed">
                        DATE: {order.date}<br />
                        COURIER TELE: {order.address.phone}<br />
                        SHIPPING DEST: {order.address.street}, {order.address.city} - {order.address.zipCode}
                      </div>
                    </div>

                    {/* Ordered items details */}
                    <div className="flex-grow space-y-1 bg-white/1 border border-white/2 p-3 rounded-lg max-w-md">
                      <span className="text-silver/40 text-[9px] block">CHECKOUT COMPONENT LOGS //</span>
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] text-white">
                          <span>{i.product.name} ({i.size}) x{i.quantity}</span>
                          <span>${i.product.price * i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                      <div className="text-right">
                        <span className="text-silver/40 text-[9px] block">TOTAL TRANSACTION</span>
                        <span className="text-lg font-bold text-accent-purple">${order.total} USD</span>
                      </div>

                      {/* Dropdown status modifier */}
                      <div className="w-full">
                        <label className="block text-silver/40 text-[9px] mb-1.5">SET SHIPPING STATE //</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className="w-full bg-[#171717] border border-white/10 rounded p-2 text-white outline-none focus:border-accent-blue uppercase cursor-pointer"
                        >
                          <option value="ordered">Ordered (Received)</option>
                          <option value="packed">Packed (Box Ready)</option>
                          <option value="shipped">Shipped (In Transit)</option>
                          <option value="out-for-delivery">Out For Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center glass border border-white/5 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-white/10 mb-4 animate-pulse" />
                <span className="font-mono text-xs text-silver/40 tracking-widest uppercase">
                  No order logs recorded.
                  <br />
                  Submit checkouts to trigger orders list database.
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COUPONS EDITOR */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            {/* Left: Active List */}
            <div className="glass border border-white/5 rounded-2xl p-6">
              <h4 className="text-white font-bold tracking-widest mb-4 uppercase">ACTIVE COUPON MULTIPLIERS //</h4>
              <div className="space-y-3">
                {Object.entries(coupons).map(([code, disc]) => (
                  <div
                    key={code}
                    className="flex justify-between items-center p-3 border border-white/5 bg-white/2 rounded-xl"
                  >
                    <span className="font-bold text-white text-sm">#{code}</span>
                    <span className="text-accent-purple font-bold">{disc}% DISCOUNT</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Add Form */}
            <div className="glass border border-white/5 rounded-2xl p-6">
              <h4 className="text-white font-bold tracking-widest mb-4 uppercase">GENERATE PROMO TICKET //</h4>
              <form onSubmit={handleAddNewCoupon} className="space-y-4">
                <div>
                  <label className="block text-silver/60 mb-2">PROMO COUPON CODE</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="E.G. TRANSCEND"
                    className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-silver/60 mb-2">DISCOUNT PERCENTAGE</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={90}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-white/3 border border-white/5 rounded p-3 text-white focus:border-accent-blue outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-semibold rounded hover:bg-accent-blue hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> ADD PROMO MULTIPLIER
                </button>
              </form>
              {couponAddedMsg && (
                <div className="mt-4 p-3 border border-green-500/20 bg-green-500/10 rounded-xl text-[10px] text-green-500 leading-relaxed font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" /> {couponAddedMsg}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
