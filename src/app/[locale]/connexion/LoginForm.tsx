'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { login } from '@/lib/auth/actions';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const t = useTranslations('auth');

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await login(formData);
      return result?.error ?? null;
      // On success login() calls redirect() — this line is never reached
    },
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      {/* Pass redirect destination as hidden input */}
      {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          {t('email')}
        </label>
        <input
          id="email" name="email" type="email" required autoComplete="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            {t('password')}
          </label>
          <a href="/modpas-bliye" className="text-xs text-[#1D9E75] hover:underline">
            {t('forgot_password')}
          </a>
        </div>
        <input
          id="password" name="password" type="password" required autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
        />
      </div>

      <button
        type="submit" disabled={pending}
        className="w-full py-3 rounded-xl bg-[#1D9E75] hover:bg-[#158a63] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {pending ? t('login_loading') : t('login_button')}
      </button>
    </form>
  );
}
