import { useState } from 'react';

const faqs = [
  ['How long does delivery take?', 'Most orders arrive in three to five working days, packed so the pot and soil stay put.'],
  ['What if my plant arrives damaged?', 'Send us a photo within seven days and we will send a replacement.'],
  ['Are these plants safe for pets?', 'Use the Pet safe filter in the shop. Spider Plant, Parlor Palm and Calathea are non-toxic.'],
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', body: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const field = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setStatus('sending'); setError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send your message.');
      setStatus('sent');
    } catch (err) {
      setError(err.message); setStatus('idle');
    }
  };

  return (
    <main className="page">
      <h1>Contact us</h1>
      <div className="contact-layout">
        {status === 'sent' ? (
          <div className="checkout">
            <h2>Message sent</h2>
            <p>Thanks, {form.name}. We reply within one working day.</p>
          </div>
        ) : (
          <form className="checkout" onSubmit={submit}>
            <label>Name<input required value={form.name} onChange={field('name')} autoComplete="name" /></label>
            <label>Email<input required type="email" value={form.email} onChange={field('email')} autoComplete="email" /></label>
            <label>How can we help?<textarea required rows="5" value={form.body} onChange={field('body')} /></label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
        <div className="faq">
          <h2>Common questions</h2>
          {faqs.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </div>
    </main>
  );
}
