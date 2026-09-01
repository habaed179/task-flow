import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { PLANS } from '../../utils/constants';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Flexible SaaS Subscription Plans</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the right plan for your engineering team or individual projects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-all ${
                plan.isPopular
                  ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-xl relative'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-600 text-white shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className={`mt-8 w-full py-3 rounded-xl text-center font-bold text-sm transition-all ${
                  plan.isPopular
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
