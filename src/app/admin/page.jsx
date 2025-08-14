"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnalyticsTab from "@/components/Tabs/AnalyticsTab";
import CategoriesTab from "@/components/Tabs/CategoriesTab";
import ShipmentsTab from "@/components/Tabs/ShipmentsTab";
import UsersTab from "@/components/Tabs/UsersTab";
import PartnersTab from "@/components/Tabs/PartnersTab";
import ProductsTab from "@/components/Tabs/ProductsTab";
import SuppliersTab from "@/components/Tabs/SuppliersTab";
import { Settings } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>
        <Tabs defaultValue="analytics">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            {/* <TabsTrigger value="catalogs">Product Catalogs</TabsTrigger> */}
          </TabsList>

          <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="shipments"><ShipmentsTab /></TabsContent>
          <TabsContent value="partners"><PartnersTab /></TabsContent>
          <TabsContent value="suppliers"><SuppliersTab /></TabsContent>
          {/* <TabsContent value="catalogs"><CatalogTab /></TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
