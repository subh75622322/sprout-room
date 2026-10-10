import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlantArt from '../components/PlantArt.jsx';
import { money, useCart } from '../cart.jsx';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(null);

  const field = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map(i => ({ id: i.id, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not place the order.');
      setOrder(data);
      clear();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (order) return (
    <main className="page narrow">
      <h1>Order placed</h1>
      <p>Thank you, {form.name}. Your order number is <strong>#{order.orderId}</strong> and the total is {money(order.total)}.</p>
      <p>We will email {form.email} when it ships. Payment is collected on delivery.</p>
      <Link to="/shop" className="btn">Keep shopping</Link>
    </main>
  );

  if (items.length === 0) return (
    <main className="page narrow">
      <h1>Your cart is empty</h1>
      <p>Add a plant and it will show up here.</p>
      <Link to="/shop" className="btn">Shop plants</Link>
    </main>
  );

  return (
    <main className="page">
      <h1>Your cart</h1>
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map(i => (
            <li key={i.id}>
              <div className="thumb"><PlantArt shape={i.shape} leaf={i.leaf} pot={i.pot} title={i.name} /></div>
              <div className="cart-info">
                <Link to={`/plant/${i.id}`}><strong>{i.name}</strong></Link>
                <span>{money(i.price)} each</span>
                <button className="link" onClick={() => remove(i.id)}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)} aria-label={`Decrease ${i.name}`}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)} aria-label={`Increase ${i.name}`}>+</button>
              </div>
              <strong className="line-total">{money(i.price * i.qty)}</strong>
            </li>
          ))}
        </ul>

        <form className="checkout" onSubmit={submit}>
          <h2>Delivery details</h2>
          <label>Full name<input required value={form.name} onChange={field('name')} autoComplete="name" /></label>
          <label>Email<input required type="email" value={form.email} onChange={field('email')} autoComplete="email" /></label>
          <label>Delivery address<textarea required rows="3" value={form.address} onChange={field('address')} autoComplete="street-address" /></label>
          <p className="total"><span>Total</span><strong>{money(total)}</strong></p>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
          <p className="muted small-text">Payment is collected on delivery.</p>
        </form>
      </div>
    </main>
  );
}
