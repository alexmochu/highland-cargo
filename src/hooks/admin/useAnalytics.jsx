import { useEffect, useState } from "react";
import { fetchAnalytics, fetchCategories } from "@/services/adminService";

export default function useAnalytics() {
  const [data, setData] = useState({ usersCount: 0, shipmentsCount: 0, trending: [], byStatus: [], byCategory: [] });
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [a, cats] = await Promise.all([fetchAnalytics(), fetchCategories()]);
      const cmap = Object.fromEntries((cats || []).map(c => [c.id, c.name]));
      setCategoriesMap(cmap);
      setData(a);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { ...data, categoriesMap, loading, reload: load };
}
