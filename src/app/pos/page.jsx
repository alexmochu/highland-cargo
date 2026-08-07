"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import usePOS from "@/hooks/usePOS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2, Terminal, ArrowLeft } from "lucide-react";

export default function POSPage() {
  const { user, profile } = useAuth();
  const {
    warehouses, warehouseId, setWarehouseId, register, products, search, setSearch,
    cart, addToCart, updateQuantity, removeFromCart, total, loading, checkingOut,
    openRegister, closeRegister, checkout,
  } = usePOS(user?.id);

  const [openingFloat, setOpeningFloat] = useState("");
  const [registerName, setRegisterName] = useState("Front Counter");
  const [closingAmount, setClosingAmount] = useState("");

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading register...</div>;
  }

  if (!register) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Terminal className="w-5 h-5" />Open Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setWarehouseId} value={warehouseId || ""}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent className="bg-white">
                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Register name" value={registerName} onChange={e => setRegisterName(e.target.value)} />
            <Input placeholder="Opening float (cash in drawer)" value={openingFloat} onChange={e => setOpeningFloat(e.target.value)} />
            <Button className="w-full bg-slate-800 text-white" onClick={() => openRegister(registerName, openingFloat)} disabled={!warehouseId}>
              Open Register
            </Button>
            <Link href="/admin" className="flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-3 h-3" />Back to Admin
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 bg-slate-800 text-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 font-bold"><Terminal className="w-5 h-5" />POS -- {register.name}</div>
        <div className="flex items-center gap-4 text-sm">
          <span>{profile?.full_name || profile?.email}</span>
          <div className="flex items-center gap-2">
            <Input
              className="h-8 w-28 text-slate-800"
              placeholder="Closing amt"
              value={closingAmount}
              onChange={e => setClosingAmount(e.target.value)}
            />
            <Button size="sm" variant="destructive" onClick={() => closeRegister(closingAmount)}>Close Register</Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 p-4 overflow-y-auto">
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4 bg-white" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-slate-400 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-slate-800 text-sm line-clamp-2">{p.name}</p>
                <p className="text-slate-500 text-sm mt-1">{Number(p.numeric_price ?? p.price ?? 0).toLocaleString()}</p>
              </button>
            ))}
            {products.length === 0 && <p className="text-slate-400 col-span-full text-center py-8">No products found.</p>}
          </div>
        </div>

        <div className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 font-bold text-slate-800">Cart</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.unit_price.toLocaleString()} each</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                  <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => removeFromCart(item.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
            {cart.length === 0 && <p className="text-slate-400 text-sm text-center py-8">Cart is empty</p>}
          </div>
          <div className="p-4 border-t border-slate-200 space-y-3">
            <div className="flex justify-between font-bold text-lg text-slate-800">
              <span>Total</span>
              <span>{total.toLocaleString()}</span>
            </div>
            <Button className="w-full bg-emerald-600 text-white h-12" onClick={checkout} disabled={!cart.length || checkingOut}>
              {checkingOut ? "Processing..." : "Charge Cash"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
