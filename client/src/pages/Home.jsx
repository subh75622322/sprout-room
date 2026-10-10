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

      <section className="page testimonials">
        <h2>What our customers say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"I've killed every plant I've ever owned, but my Snake Plant from Sprout Room is thriving after six months. Finally, a plant that gets me."</p>
            <cite>— Priya, Mumbai</cite>
          </div>
          <div className="testimonial">
            <p>"The care instructions are actually useful! No vague 'water when dry' advice. They tell you exactly what to do."</p>
            <cite>— Rahul, Bangalore</cite>
          </div>
          <div className="testimonial">
            <p>"My Pothos arrived in perfect condition. The packaging was excellent, and the plant looks even better than the photo."</p>
            <cite>— Ananya, Delhi</cite>
          </div>
        </div>
      </section>

      <section className="page care-tips">
        <h2>Plant care basics</h2>
        <div className="tips-grid">
          <div className="tip">
            <h3>💧 Watering wisdom</h3>
            <p>Most houseplants prefer to dry out slightly between waterings. Stick your finger 2 inches into the soil — if it's dry, water thoroughly until it drains.</p>
          </div>
          <div className="tip">
            <h3>☀️ Light levels</h3>
            <p>Bright indirect light means near a window but not in direct sun. Low light means a few feet from a window. Most plants adapt within this range.</p>
          </div>
          <div className="tip">
            <h3>🌡️ Temperature & humidity</h3>
            <p>Room temperature (18-24°C) works for most plants. If your air is very dry, group plants together or place them near a humidifier.</p>
          </div>
          <div className="tip">
            <h3>🪴 Repotting guide</h3>
            <p>Repot when roots grow out of drainage holes or soil dries very quickly. Choose a pot 2-3 inches larger. Spring is the best time.</p>
          </div>
        </div>
      </section>

      <section className="page categories-preview">
        <h2>Shop by category</h2>
        <div className="categories-grid">
          <Link to="/shop?category=Foliage" className="category-card">
            <PlantArt shape="tall" leaf="#9fe2b4" pot="#f4d35e" />
            <h3>Foliage Plants</h3>
            <p>Bold leaves, minimal fuss</p>
          </Link>
          <Link to="/shop?category=Trailing" className="category-card">
            <PlantArt shape="trailing" leaf="#c8f169" pot="#ffffff" />
            <h3>Trailing Plants</h3>
            <p>Perfect for shelves & hangers</p>
          </Link>
          <Link to="/shop?category=Succulent" className="category-card">
            <PlantArt shape="paddle" leaf="#c8f169" pot="#ffd9e0" />
            <h3>Succulents</h3>
            <p>Low-water, high-impact</p>
          </Link>
          <Link to="/shop?category=Flowering" className="category-card">
            <PlantArt shape="tall" leaf="#9fe2b4" pot="#f4d35e" />
            <h3>Flowering Plants</h3>
            <p>Blooms that last months</p>
          </Link>
        </div>
      </section>

      <section className="page cta-section">
        <div className="cta-content">
          <h2>Not sure which plant to choose?</h2>
          <p>We're here to help. Send us a photo of your space, tell us about your lifestyle, and we'll recommend the perfect plant for you.</p>
          <Link to="/contact" className="btn lime">Get plant advice</Link>
        </div>
      </section>
    </main>
  );
}
