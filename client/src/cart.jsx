import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const money = n => '₹' + Number(n).toLocaleString('en-IN');

function load() {
  try { return JSON.parse(localStorage.getItem('sprout-cart')) || []; } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try { localStorage.setItem('sprout-cart', JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (p, qty = 1) =>
    setItems(cur => {
      const found = cur.find(i => i.id === p.id);
      if (found) return cur.map(i => (i.id === p.id ? { ...i, qty: Math.min(20, i.qty + qty) } : i));
      return [...cur, { id: p.id, name: p.name, price: p.price, shape: p.shape, leaf: p.leaf, pot: p.pot, qty }];
    });
  const setQty = (id, qty) =>
    setItems(cur => cur.map(i => (i.id === id ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i)));
  const remove = id => setItems(cur => cur.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}
