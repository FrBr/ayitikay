'use client';

import { useState } from 'react';
import { approveListing, rejectListing } from '@/lib/admin/actions';

export function ModerationActions({ listingId }: { listingId: string }) {
  const [busy, setBusy]         = useState<'approve' | 'reject' | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason]     = useState('');

  async function handleApprove() {
    setBusy('approve');
    await approveListing(listingId);
    setBusy(null);
  }

  async function handleReject() {
    setBusy('reject');
    await rejectListing(listingId, reason || undefined);
    setBusy(null);
    setShowReject(false);
    setReason('');
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={busy !== null}
          className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {busy === 'approve' ? 'Ap aprouve...' : '✓ Aprouve'}
        </button>
        <button
          type="button"
          onClick={() => setShowReject(v => !v)}
          disabled={busy !== null}
          className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold border border-red-200 transition-colors disabled:opacity-50"
        >
          ✕ Rejte
        </button>
      </div>

      {showReject && (
        <div className="space-y-2 pt-1">
          <textarea
            rows={2}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Rezon rejet (opsyonèl) — pral voye nan nòt lis la"
            className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
          <button
            type="button"
            onClick={handleReject}
            disabled={busy !== null}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {busy === 'reject' ? 'Ap rejte...' : 'Konfime rejet'}
          </button>
        </div>
      )}
    </div>
  );
}
