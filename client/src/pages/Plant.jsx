import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PlantArt from '../components/PlantArt.jsx';
import { money, useCart } from '../cart.jsx';

export default function Plant() {
  const { id } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [state, setState] = useState('loading');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setState('loading'); setAdded(false); setQty(1);
    fetch('/api/products/' + id)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setP(d); setState('ready'); })
      .catch(() => setState('missing'));
  }, [id]);

  if (state === 'loading') return <main className="page"><p className="muted">Loading…</p></main>;
  if (state === 'missing') return (
    <main className="page narrow">
      <h1>Plant not found</h1>
      <p>We could not find that plant. <Link to="/shop">Back to the shop</Link></p>
    </main>
  );

  const care = [['Light', p.light], ['Water', p.water], ['Size', p.size], ['Type', p.category]];

  return (
    <main className="page">
      <p className="crumbs"><Link to="/shop">Shop</Link> / {p.name}</p>
      <div className="detail">
        <div className="detail-art"><PlantArt shape={p.shape} leaf={p.leaf} pot={p.pot} title={p.name} /></div>
        <div>
          <h1>{p.name}</h1>
          <p className="latin">{p.latin}</p>
          <p className="price">{money(p.price)}</p>
          <p>{p.description}</p>

          <dl className="care">
            {care.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>

          <div className="buy">
            <div className="qty" aria-label="Quantity">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn" onClick={() => { add(p, qty); setAdded(true); }}>Add to cart</button>
          </div>
          {added && <p className="ok">Added to your cart. <Link to="/cart">Go to cart</Link></p>}
        </div>
      </div>
    </main>
  );
}
