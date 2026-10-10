import { Link } from 'react-router-dom';
import PlantArt from './PlantArt.jsx';
import { money, useCart } from '../cart.jsx';

export default function PlantCard({ p }) {
  const { add } = useCart();
  return (
    <article className="card">
      <Link to={`/plant/${p.id}`} className="card-art" aria-label={`View ${p.name}`}>
        <PlantArt shape={p.shape} leaf={p.leaf} pot={p.pot} title={p.name} />
      </Link>
      <div className="card-body">
        <div>
          <h3><Link to={`/plant/${p.id}`}>{p.name}</Link></h3>
          <p className="latin">{p.latin}</p>
        </div>
        <div className="card-foot">
          <strong>{money(p.price)}</strong>
          <button className="btn small" onClick={() => add(p)}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}
