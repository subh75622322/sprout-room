import { NavLink, Link, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from './cart.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Plant from './pages/Plant.jsx';
import Cart from './pages/Cart.jsx';
import Contact from './pages/Contact.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { count } = useCart();
  return (
    <>
      <ScrollTop />
      <header className="site-header">
        <Link to="/" className="logo">Sprout Room</Link>
        <nav aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/cart" className="cart-link">Cart <span className="badge">{count}</span></NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/plant/:id" element={<Plant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={
          <main className="page narrow">
            <h1>Page not found</h1>
            <p>That page does not exist. <Link to="/shop">Browse the shop</Link> instead.</p>
          </main>
        } />
      </Routes>

      <footer className="site-footer">
        <p><strong>Sprout Room</strong> Hardy plants, honest care notes.</p>
        <p>Free delivery over ₹1,500. Thirty-day plant guarantee.</p>
      </footer>
    </>
  );
}
