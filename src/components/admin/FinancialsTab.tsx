import { transactions, artistPayouts } from '@/data';
import { TrendingUp, TrendingDown, Wallet, Percent, CheckCircle2, Clock } from 'lucide-react';

export default function FinancialsTab() {
  const totalRevenue = transactions
    .filter((t) => t.category === 'Revenue')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.category === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* High-level stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          sub="August 2026"
          icon={<TrendingUp size={20} />}
          accent="success"
        />
        <StatCard
          label="Total Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          sub="August 2026"
          icon={<TrendingDown size={20} />}
          accent="danger"
        />
        <StatCard
          label="Net Profit"
          value={`₹${netProfit.toLocaleString('en-IN')}`}
          sub={`${margin}% margin`}
          icon={<Wallet size={20} />}
          accent="gold"
        />
        <StatCard
          label="Artist Payouts"
          value={`₹${artistPayouts.reduce((s, p) => s + p.artistShare, 0).toLocaleString('en-IN')}`}
          sub="60% commission split"
          icon={<Percent size={20} />}
        />
      </div>

      {/* Payout ledger */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-white">Artist Payout Ledger</h3>
          <span className="text-xs uppercase tracking-widest text-ink-300">60/40 Split</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-ink-900 text-xs uppercase tracking-wider text-ink-300">
                <th className="px-5 py-3 font-medium">Artist</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Gross Revenue</th>
                <th className="px-5 py-3 font-medium">Studio (40%)</th>
                <th className="px-5 py-3 font-medium">Artist (60%)</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {artistPayouts.map((p) => (
                <tr key={p.id} className="bg-ink-850 transition-colors hover:bg-ink-800">
                  <td className="px-5 py-3 font-medium text-white">{p.artistName}</td>
                  <td className="px-5 py-3 text-ink-100">{p.period}</td>
                  <td className="px-5 py-3 text-ink-100">₹{p.grossRevenue.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-ink-100">₹{p.studioShare.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 font-medium text-gold">₹{p.artistShare.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    {p.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                        <CheckCircle2 size={12} /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-ink-900">
                <td className="px-5 py-3 font-semibold text-white" colSpan={3}>Totals</td>
                <td className="px-5 py-3 font-semibold text-ink-100">
                  ₹{artistPayouts.reduce((s, p) => s + p.studioShare, 0).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3 font-semibold text-gold">
                  ₹{artistPayouts.reduce((s, p) => s + p.artistShare, 0).toLocaleString('en-IN')}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Transaction log */}
      <div className="panel overflow-hidden">
        <h3 className="border-b border-white/5 px-5 py-4 font-serif text-lg font-semibold text-white">
          Transaction Log
        </h3>
        <div className="divide-y divide-white/5">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-ink-800">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  t.category === 'Revenue' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {t.category === 'Revenue' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.description}</p>
                  <p className="text-xs text-ink-300">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <span className={`font-serif text-lg font-semibold ${
                t.category === 'Revenue' ? 'text-success' : 'text-danger'
              }`}>
                {t.category === 'Revenue' ? '+' : '−'}₹{t.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub: string; icon: React.ReactNode;
  accent?: 'success' | 'danger' | 'gold';
}) {
  const color = accent === 'success' ? 'text-success' : accent === 'danger' ? 'text-danger' : accent === 'gold' ? 'text-gold' : 'text-white';
  const bg = accent === 'success' ? 'bg-success/10' : accent === 'danger' ? 'bg-danger/10' : accent === 'gold' ? 'bg-gold/10' : 'bg-white/5';
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-300">{label}</p>
          <p className={`mt-2 font-serif text-2xl font-semibold ${color}`}>{value}</p>
          <p className="mt-1 text-xs text-ink-300">{sub}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
