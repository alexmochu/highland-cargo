"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnalyticsTab from "@/components/admin/Tabs/AnalyticsTab";
import CategoriesTab from "@/components/admin/Tabs/CategoriesTab";
import ShipmentsTab from "@/components/admin/Tabs/ShipmentsTab";
import UsersTab from "@/components/admin/Tabs/UsersTab";
import PartnersTab from "@/components/admin/Tabs/PartnersTab";
import ProductsTab from "@/components/admin/Tabs/ProductsTab";
import SuppliersTab from "@/components/admin/Tabs/SuppliersTab";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="bg-slate-800 p-3 rounded-2xl">
            <Settings className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800">Admin Dashboard</h2>
        </motion.div>
        <Tabs defaultValue="analytics">
          <TabsList className="mb-6 flex flex-wrap gap-3 bg-slate-100 p-2 rounded-xl">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Analytics</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Categories</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Users</TabsTrigger>
            <TabsTrigger value="shipments" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Shipments</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Partners</TabsTrigger>
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Suppliers</TabsTrigger>
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
