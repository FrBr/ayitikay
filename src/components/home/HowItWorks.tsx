import { useTranslations } from 'next-intl';

const STEPS = [
  {
    key: 'step1',
    icon: <SearchStepIcon />,
    color: 'bg-teal-50 text-[#1D9E75]',
    number: '01',
  },
  {
    key: 'step2',
    icon: <ChatStepIcon />,
    color: 'bg-green-50 text-green-600',
    number: '02',
  },
  {
    key: 'step3',
    icon: <SignStepIcon />,
    color: 'bg-emerald-50 text-emerald-700',
    number: '03',
  },
] as const;

export function HowItWorks() {
  const t = useTranslations('how');

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            {t('title')}
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-[#1D9E75]/30 via-[#1D9E75]/50 to-[#1D9E75]/30" aria-hidden="true" />

          {STEPS.map(({ key, icon, color, number }) => (
            <div key={key} className="relative flex flex-col items-center text-center px-4">
              {/* Step number */}
              <div className="relative mb-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>
                  {icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1D9E75] text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t(`${key}_title` as Parameters<typeof t>[0])}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t(`${key}_desc` as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchStepIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChatStepIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function SignStepIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
