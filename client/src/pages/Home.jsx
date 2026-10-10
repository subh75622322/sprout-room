import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PlantArt from '../components/PlantArt.jsx';
import PlantCard from '../components/PlantCard.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    fetch('/api/products?featured=1').then(r => r.json()).then(setFeatured).catch(() => {});
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <h1>Plants that survive you.</h1>
          <p>Hardy houseplants, shipped in sturdy pots, with care notes short enough to read once and remember.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn lime">Shop plants</Link>
            <Link to="/contact" className="btn ghost">Ask us anything</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <PlantArt shape="paddle" leaf="#c8f169" pot="#ffd9e0" />
          <PlantArt shape="tall" leaf="#9fe2b4" pot="#f4d35e" />
          <PlantArt shape="trailing" leaf="#c8f169" pot="#ffffff" />
        </div>
      </section>

      <section className="page">
        <div className="section-head">
          <h2>Easy to keep alive</h2>
          <Link to="/shop">See all plants</Link>
        </div>
        <div className="grid">
          {featured.map(p => <PlantCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="page promise">
        <div>
          <h3>Picked for real homes</h3>
          <p>Every plant here forgives missed waterings and low light. No fussy divas.</p>
        </div>
        <div>
          <h3>Care notes on every page</h3>
          <p>Light, water and size, stated plainly, before you buy.</p>
        </div>
        <div>
          <h3>Thirty-day guarantee</h3>
          <p>If your plant struggles in the first month, write to us and we will replace it.</p>
        </div>
      </section>
    </main>
  );
}
