'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Inquiry } from '@/lib/kv';

export default function InquiryList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load inquiries');
      }

      setInquiries(data.inquiries ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  async function handleExpand(inquiry: Inquiry) {
    const nextId = expandedId === inquiry.id ? null : inquiry.id;
    setExpandedId(nextId);

    if (nextId && !inquiry.read) {
      try {
        await fetch('/api/admin/inquiries', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: inquiry.id }),
        });

        setInquiries((prev) =>
          prev.map((item) =>
            item.id === inquiry.id ? { ...item, read: true } : item
          )
        );
      } catch {
        // Non-blocking; inquiry still expands
      }
    }
  }

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading inquiries…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (inquiries.length === 0) {
    return <p className="text-sm text-neutral-500">No inquiries yet.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-800 border border-neutral-800">
      {inquiries.map((inquiry) => {
        const isExpanded = expandedId === inquiry.id;
        const date = new Date(inquiry.createdAt).toLocaleString();

        return (
          <li key={inquiry.id}>
            <button
              type="button"
              onClick={() => handleExpand(inquiry)}
              className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-neutral-900/50"
            >
              {!inquiry.read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              )}
              {inquiry.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-neutral-100">
                    {inquiry.name}
                  </span>
                  <span className="text-xs text-neutral-500">{date}</span>
                </div>
                <p className="truncate text-sm text-neutral-400">
                  {inquiry.email}
                  {inquiry.company ? ` · ${inquiry.company}` : ''}
                </p>
                {!isExpanded && inquiry.message && (
                  <p className="mt-1 truncate text-sm text-neutral-500">
                    {inquiry.message}
                  </p>
                )}
              </div>
              <span className="text-xs uppercase tracking-wider text-neutral-600">
                {inquiry.source}
              </span>
            </button>

            {isExpanded && (
              <div className="border-t border-neutral-800 bg-neutral-900/30 px-4 py-4 pl-9 text-sm text-neutral-300">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-neutral-500">
                      Email
                    </dt>
                    <dd>{inquiry.email}</dd>
                  </div>
                  {inquiry.company && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-neutral-500">
                        Company
                      </dt>
                      <dd>{inquiry.company}</dd>
                    </div>
                  )}
                  {inquiry.projectType && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-neutral-500">
                        Project Type
                      </dt>
                      <dd>{inquiry.projectType}</dd>
                    </div>
                  )}
                  {inquiry.budget && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-neutral-500">
                        Budget
                      </dt>
                      <dd>{inquiry.budget}</dd>
                    </div>
                  )}
                  {inquiry.dates && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-neutral-500">
                        Dates
                      </dt>
                      <dd>{inquiry.dates}</dd>
                    </div>
                  )}
                </dl>
                {inquiry.message && (
                  <div className="mt-4">
                    <dt className="mb-1 text-xs uppercase tracking-widest text-neutral-500">
                      Message
                    </dt>
                    <dd className="whitespace-pre-wrap text-neutral-200">
                      {inquiry.message}
                    </dd>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
