"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ProductModal({ isOpen, onClose, product = null, onSave }) {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    region: "",
    price: "",
    description: "",
  });

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        region: product.region || "",
        price: product.price || "",
        description: product.description || "",
      });
    } else {
      setFormData({ name: "", region: "", price: "", description: "" });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, region, price } = formData;

    if (!name || !region || !price) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", product.id);

        if (error) throw error;
        alert("Product updated successfully.");
      } else {
        const { error } = await supabase.from("products").insert([formData]);
        if (error) throw error;
        alert("Product created successfully.");
      }

      onClose();
      if (onSave) onSave(); // Optionally trigger a refresh in parent
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <Input name="region" value={formData.region} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input name="description" value={formData.description} onChange={handleChange} />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
