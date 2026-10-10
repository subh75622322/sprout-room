import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlantCard from '../components/PlantCard.jsx';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const q = params.get('q') || '';
  const sort = params.get('sort') || '';

  const [categories, setCategories] = useState([]);
  const [plants, setPlants] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setState('loading');
    const qs = new URLSearchParams({ category, q, sort }).toString();
    fetch('/api/products?' + qs)
      .then(r => r.json())
      .then(d => { setPlants(d); setState('ready'); })
      .catch(() => setState('error'));
  }, [category, q, sort]);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'All') next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <main className="page">
      <h1>Shop plants</h1>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by type">
          {['All', ...categories].map(c => (
            <button key={c} className={'chip' + (category === c ? ' on' : '')} onClick={() => set('category', c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="controls">
          <input type="search" placeholder="Search plants" aria-label="Search plants" value={q}
            onChange={e => set('q', e.target.value)} />
          <select aria-label="Sort" value={sort} onChange={e => set('sort', e.target.value)}>
            <option value="">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {state === 'loading' && <p className="muted">Loading plants…</p>}
      {state === 'error' && <p className="error">Could not load plants. Check that the server is running and refresh.</p>}
      {state === 'ready' && plants.length === 0 && (
        <p className="muted">No plants match that search. Try another word or choose All.</p>
      )}
      <div className="grid">
        {plants.map(p => <PlantCard key={p.id} p={p} />)}
      </div>
    </main>
  );
}
