'use client';

import { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECT_TYPES = [
  'Fashion',
  'Fitness',
  'Editorial',
  'Brand',
  'Other',
] as const;

const BUDGET_RANGES = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000+',
  'Flexible / TBD',
] as const;

const CONTACT_EMAIL = "abbas.work0007@gmail.com";

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const company = String(formData.get('company') ?? '').trim();
    const projectType = String(formData.get('projectType') ?? '').trim();
    const budget = String(formData.get('budget') ?? '').trim();
    const dates = String(formData.get('dates') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : '',
      projectType ? `Project type: ${projectType}` : '',
      budget ? `Budget: ${budget}` : '',
      dates ? `Dates: ${dates}` : '',
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Booking inquiry from ${name}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus('success');
    form.reset();
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-[var(--radius-card)] border border-border bg-surface p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-mint/40 bg-mint/10"
        >
          <svg
            className="h-6 w-6 text-mint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <h2 className="mb-2 text-lg font-light tracking-wide text-accent">
          Opening your email app
        </h2>
        <p className="mb-8 text-sm text-muted">
          Send the message from your mail app to complete your inquiry.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_minmax(240px,280px)]">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label-caps mb-2 block text-muted">
              Name *
            </label>
            <input id="name" name="name" type="text" required className="input-field" />
          </div>
          <div>
            <label htmlFor="email" className="label-caps mb-2 block text-muted">
              Email *
            </label>
            <input id="email" name="email" type="email" required className="input-field" />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="label-caps mb-2 block text-muted">
            Brand / Company
          </label>
          <input id="company" name="company" type="text" className="input-field" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="projectType" className="label-caps mb-2 block text-muted">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              defaultValue=""
              className="input-field cursor-pointer"
            >
              <option value="" disabled>
                Select type
              </option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-background">
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="label-caps mb-2 block text-muted">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className="input-field cursor-pointer"
            >
              <option value="" disabled>
                Select range
              </option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range} className="bg-background">
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dates" className="label-caps mb-2 block text-muted">
            Shoot Dates
          </label>
          <input
            id="dates"
            name="dates"
            type="text"
            placeholder="Preferred dates or timeframe"
            className="input-field placeholder:text-muted/60"
          />
        </div>

        <div>
          <label htmlFor="message" className="label-caps mb-2 block text-muted">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full resize-none rounded-[var(--radius-card)] border border-border bg-surface p-4 text-sm text-accent outline-none transition placeholder:text-muted/60 focus:border-mint/40"
          />
        </div>

        <AnimatePresence>
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400/90"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" disabled={status === 'loading'} className="btn-primary">
          {status === 'loading' ? 'Opening mail…' : 'Send Message'}
        </button>
      </form>

      <aside className="space-y-8 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <div>
          <p className="label-caps mb-2 text-muted">Email</p>
          <a
            href="mailto:abbas.work0007@gmail.com"
            className="text-sm text-accent/80 transition hover:text-accent"
          >
            abbas.work0007@gmail.com
          </a>
        </div>
        <div>
          <p className="label-caps mb-2 text-muted">Phone</p>
          <a
            href="tel:+918977137220"
            className="text-sm text-accent/80 transition hover:text-accent"
          >
            +91 8977137220
          </a>
        </div>
        <div>
          <p className="label-caps mb-2 text-muted">Instagram</p>
          <a
            href="https://www.instagram.com/beingsyedabbas_7/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent/80 transition hover:text-accent"
          >
            @beingsyedabbas_7
          </a>
        </div>
      </aside>
    </div>
  );
}
