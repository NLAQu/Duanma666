import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!user) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await api.cart();
      setItems(res.data || []);
      setTotal(Number(res.total) || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => {
      setItems([]);
      setTotal(0);
      setLoading(false);
    });
  }, [user]);

  const value = useMemo(
    () => ({
      items,
      total,
      loading,
      count: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      refresh,
      async add(productId, quantity = 1) {
        await api.addToCart({ product_id: productId, quantity });
        await refresh();
      },
      async update(itemId, quantity) {
        await api.updateCart(itemId, quantity);
        await refresh();
      },
      async remove(itemId) {
        await api.removeCart(itemId);
        await refresh();
      },
    }),
    [items, total, loading, user]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
