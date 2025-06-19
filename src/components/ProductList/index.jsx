"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

export const ProductList = ({
  products,
  onEdit,
  onDelete
}) => (
  <div className="grid gap-4">
    {products.length === 0 && (
      <Card>
        <CardContent>No products in this catalogue yet.</CardContent>
      </Card>
    )}
    {products.map(product => (
      <Card key={product.id} className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <div className="text-gray-500 text-sm">{product.price}</div>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEdit(product)} aria-label="Edit">
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(product.id)} aria-label="Delete" >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700">{product.info}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);