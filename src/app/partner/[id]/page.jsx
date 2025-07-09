"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm, Product } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import { useToast } from "@/hooks/use-toast";

// Fake authentication context (for demonstration)
const userRole = "partner";
const currentPartnerId = "partner-1";


const initialProducts = {
  "partner-1": [
    { id: "1", name: "Smartphone X-Pro", price: "$199+", info: "Latest Dubai tech, limited view" },
    { id: "2", name: "LED Light Strips", price: "$8+", info: "Top China manufacturer, limited view" },
  ],
  "partner-2": [
    { id: "3", name: "Premium Sneakers", price: "$120+", info: "British brand, limited details" }
  ]
};

export default function PartnerDashboard({ params }) {
  const { id } = params
  const [partnerProfile, setPartnerProfile] = useState({})
  useEffect(() => {
   try { 
    async function fetchProfileWithPartner(id) {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          partner_id,
          partners ( name )
        `)
        .eq('id', id)
        .single();
    
      if (error) {
        console.error('Error fetching profile with partner:', error);
        return null;
      }
      setPartnerProfile(data)
      return data;
    }

    fetchProfileWithPartner(id)
  } catch(error) {
    console.log('A problem fetching User Profile:', error)
  }

  }, [])

  console.log('parte', partnerProfile)
  const [productsByPartner, setProductsByPartner] = React.useState(initialProducts);
  const [editing, setEditing] = React.useState(null);
  const { toast } = useToast();

  // Determine which partner's products to show/edit (superadmin: show all, partner: own only)
  const partnerId = userRole === "superadmin" ? "partner-1" : currentPartnerId;
  const products = productsByPartner[partnerId] || [];

  // CRUD Handlers
  const handleAddOrUpdate = (product) => {
    setProductsByPartner(prev => {
      const list = prev[partnerId] || [];
      if (product.id) {
        toast({ title: "Product updated", description: product.name });
        return {
          ...prev,
          [partnerId]: list.map(p => (p.id === product.id ? { ...product } : p)),
        };
      } else {
        const newProduct = { ...product, id: Date.now().toString() };
        toast({ title: "Product added", description: newProduct.name });
        return {
          ...prev,
          [partnerId]: [...list, newProduct],
        };
      }
    });
    setEditing(null);
  };

  const handleEdit = (p) => setEditing(p);
  const handleDelete = (id) => {
    setProductsByPartner(prev => {
      const list = prev[partnerId] || [];
      toast({ title: "Product deleted" });
      return {
        ...prev,
        [partnerId]: list.filter(p => p.id !== id),
      };
    });
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-orange-50 to-blue-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Partner Dashboard</h2>
        </div>
        <div className="mb-10">
          <ProductForm
            key={editing?.id || "create"}
            onSubmit={handleAddOrUpdate}
            initial={editing}
            clearAfterSubmit={!editing}
          />
        </div>
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}