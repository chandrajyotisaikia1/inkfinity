import { inventory } from '@/data';
import { AlertTriangle, Package, Boxes, TrendingDown } from 'lucide-react';

export default function InventoryTab() {
  const lowStock = inventory.filter((i) => i.stock <= i.minStock);
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((s, i) => s + i.stock * i.unitCost, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total SKUs" value={totalItems.toString()} sub="Unique items" icon={<Package size={20} />} />
        <StatCard label="Inventory Value" value={`₹${(totalValue / 1000).toFixed(1)}K`} sub="Current stock" icon={<Boxes size={20} />} accent="gold" />
        <StatCard
          label="Low Stock Alerts"
          value={lowStock.length.toString()}
          sub="Need restocking"
          icon={<AlertTriangle size={20} />}
          accent="danger"
        />
        <StatCard
          label="Categories"
          value={new Set(inventory.map((i) => i.category)).size.toString()}
          sub="Supply types"
          icon={<TrendingDown size={20} />}
        />
      </div>

      {/* Low stock alert banner */}
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
          <AlertTriangle size={20} className="flex-shrink-0 text-danger" />
          <div>
            <p className="text-sm font-medium text-danger">
              {lowStock.length} item(s) below minimum stock level
            </p>
            <p className="text-xs text-ink-100">
              {lowStock.map((i) => i.name).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="panel overflow-hidden">
        <div className="border-b border-white/5 px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-white">Stock Tracker</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-ink-900 text-xs uppercase tracking-wider text-ink-300">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Min Level</th>
                <th className="px-5 py-3 font-medium">Unit Cost</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory.map((item) => {
                const isLow = item.stock <= item.minStock;
                const stockPct = Math.min(100, (item.stock / (item.minStock * 3)) * 100);
                return (
                  <tr key={item.id} className="bg-ink-850 transition-colors hover:bg-ink-800">
                    <td className="px-5 py-3 font-medium text-white">{item.name}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-ink-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-100">{item.supplier}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLow ? 'bg-danger' : 'bg-success'
                            }`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                        <span className={`font-medium ${isLow ? 'text-danger' : 'text-white'}`}>
                          {item.stock} {item.unit}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-200">{item.minStock} {item.unit}</td>
                    <td className="px-5 py-3 text-ink-100">₹{item.unitCost.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                          <AlertTriangle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub: string; icon: React.ReactNode;
  accent?: 'danger' | 'gold';
}) {
  const color = accent === 'danger' ? 'text-danger' : accent === 'gold' ? 'text-gold' : 'text-white';
  const bg = accent === 'danger' ? 'bg-danger/10' : accent === 'gold' ? 'bg-gold/10' : 'bg-white/5';
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
