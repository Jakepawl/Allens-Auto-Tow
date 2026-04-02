import { useState } from 'preact/hooks';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const serviceOptions = [
  'General Auto Repair', 'Brake Service', 'Tire Service', 'AC Repair',
  'Towing', 'Smog Check', 'Oil Change', 'Engine Diagnostics', 'Transmission', 'Other',
];

export default function ContactForm({ formType = 'contact' }: { formType?: 'contact' | 'appointment' }) {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, formType }),
      });
      setStatus(response.ok ? 'success' : 'error');
      if (response.ok) setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const updateField = (field: keyof FormData) => (e: Event) => {
    setForm((prev) => ({ ...prev, [field]: (e.target as HTMLInputElement).value }));
  };

  if (status === 'success') {
    return (
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p class="text-green-800 font-semibold text-lg mb-1">Message Sent!</p>
        <p class="text-green-700 text-sm">We'll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
          <input id="name" type="text" required value={form.name} onInput={updateField('name')}
            class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone <span class="text-red-500">*</span></label>
          <input id="phone" type="tel" required value={form.phone} onInput={updateField('phone')}
            class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input id="email" type="email" value={form.email} onInput={updateField('email')}
          class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
      </div>
      <div>
        <label for="service" class="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
        <select id="service" value={form.service} onChange={updateField('service')}
          class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer">
          <option value="">Select a service...</option>
          {serviceOptions.map((opt) => <option value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
          {formType === 'appointment' ? 'Preferred date/time & vehicle info' : 'Message'}
        </label>
        <textarea id="message" rows={4} value={form.message} onInput={updateField('message')}
          class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder={formType === 'appointment' ? 'e.g., Tuesday morning, 2018 Honda Civic, brake noise' : 'How can we help?'} />
      </div>
      {status === 'error' && (
        <p class="text-red-600 text-sm">Something went wrong. Please call us at 925-449-3000 instead.</p>
      )}
      <button type="submit" disabled={status === 'sending'}
        class="w-full py-3 rounded-md font-semibold transition-colors cursor-pointer disabled:opacity-50 text-white"
        style="background-color: var(--color-cta);"
        onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'var(--color-cta-hover)'; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'var(--color-cta)'; }}>
        {status === 'sending' ? 'Sending...' : formType === 'appointment' ? 'Request Appointment' : 'Send Message'}
      </button>
    </form>
  );
}
