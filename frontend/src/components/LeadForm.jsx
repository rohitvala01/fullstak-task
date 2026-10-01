import { useState } from 'react';

const INITIAL = { name: '', email: '', phone: '' };
const INPUT = 'w-full rounded border border-gray-300 p-2';

export default function LeadForm({ onAdd }) {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await onAdd(form);
    setSubmitting(false);
    if (ok) setForm(INITIAL);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 grid gap-3 sm:grid-cols-4 sm:items-end">
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} placeholder="Rohit Vala" className={INPUT} required />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="rohit@gmail.com"
          className={INPUT}
          required
        />
      </label>
      <label>
        Phone
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className={INPUT} required />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 p-2 text-white disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Lead'}
      </button>
    </form>
  );
}
