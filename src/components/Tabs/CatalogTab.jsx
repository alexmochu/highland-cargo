import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ProductModal from "@/components/Modals/ProductModal";
import useProducts from "@/hooks/useProducts";
import { useState } from "react";

export default function CatalogTab() {
  const { products, editingProduct, setEditingProduct, handleSave, handleDelete } = useProducts();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Manage Product Catalog</CardTitle>
          <Button onClick={() => setIsProductModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t">
                  <td>{product.name}</td>
                  <td>{product.region}</td>
                  <td>{product.price}</td>
                  <td>{product.description}</td>
                  <td className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </>
  );
}
