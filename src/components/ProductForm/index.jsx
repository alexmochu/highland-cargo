"use client"
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export const ProductForm = ({
  onSubmit,
  initial = null,
  clearAfterSubmit = true
}) => {
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    info: "",
    ...(initial || {})
  });

  useEffect(() => {
    if (initial) setForm({ ...initial });
    else setForm({ name: "", price: "", info: "" });
  }, [initial]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return; // Name required
    onSubmit({ ...form, id: form.id || undefined });
    if (clearAfterSubmit) setForm({ name: "", price: "", info: "" });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{form.id ? "Update Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name (required)"
            required
          />
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (e.g. $99.99)"
          />
          <Input
            name="info"
            value={form.info}
            onChange={handleChange}
            placeholder="Description"
          />
          <Button type="submit" className="w-full mt-2">
            {form.id ? "Update" : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};