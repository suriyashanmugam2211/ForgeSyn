import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { InventoryPart } from '../../types';
import { Package, Plus, Search, Lock, Unlock } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    reservePart,
    releasePart,
    addPartStock
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(inventory[0] || null);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [addQtyInput, setAddQtyInput] = useState<number>(5);

  const filteredParts = inventory.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePart = selectedPart || inventory[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Warehouse Spare Parts Inventory</h2>
            <p className="text-xs text-slate-400">Automated inventory tracking, part reservation, and lead-time estimation.</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search part name or P/N..."
              className="bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-60"
            />
          </div>

          <button
            onClick={() => setIsAddStockModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Stock
          </button>
        </div>
      </div>

      {/* Main Grid: Parts Table + Selected Part Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inventory Directory Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Catalogued Spare Parts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">P/N</th>
                  <th className="pb-3">Part Name</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Reserved</th>
                  <th className="pb-3">Unit Cost</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredParts.map(p => {
                  const isSelected = p.id === activePart?.id;
                  const available = p.quantity - p.reservedQuantity;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPart(p)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-500/10 text-emerald-200' : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-3 font-extrabold text-cyan-400">{p.partNumber}</td>
                      <td className="py-3 font-bold max-w-xs truncate">{p.name}</td>
                      <td className="py-3 font-bold text-slate-100">{p.quantity} <span className="text-[10px] text-emerald-400 font-normal">({available} avail)</span></td>
                      <td className="py-3 text-amber-300">{p.reservedQuantity}</td>
                      <td className="py-3 font-bold text-slate-200">${p.unitCost}</td>
                      <td className="py-3 text-slate-400">{p.warehouseLocation}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          p.status === 'LOW_STOCK' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Selected Part Details & Actions */}
        <div className="space-y-4">
          {!activePart ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 glass-panel text-center text-xs text-slate-500">
              Select a part from the table to view warehouse details and execute reservations.
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
              <div>
                <span className="text-xs font-extrabold text-cyan-400">{activePart.partNumber}</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{activePart.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Category: <strong className="text-slate-200">{activePart.category}</strong></p>
              </div>

              {/* Stock Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">On-Hand Stock</div>
                  <div className="text-xl font-black text-emerald-300 mt-0.5">{activePart.quantity}</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Reserved Quantity</div>
                  <div className="text-xl font-black text-amber-300 mt-0.5">{activePart.reservedQuantity}</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Unit Cost</div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">${activePart.unitCost}</div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Lead Time</div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">{activePart.leadTimeDays} Days</div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div>Warehouse: <strong className="text-cyan-300">{activePart.warehouseLocation}</strong></div>
                <div>Supplier: <strong className="text-slate-200">{activePart.supplier}</strong></div>
                <div>Compatible: <span className="text-slate-400">{activePart.compatibleMachines.join(', ')}</span></div>
              </div>

              {/* ALL REQUIRED BUTTON ACTIONS */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => reservePart(activePart.id)}
                    disabled={activePart.quantity - activePart.reservedQuantity <= 0}
                    className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <Lock className="w-3.5 h-3.5" /> Reserve Part
                  </button>

                  <button
                    onClick={() => releasePart(activePart.id)}
                    disabled={activePart.reservedQuantity <= 0}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Release Part
                  </button>
                </div>

                <button
                  onClick={() => setIsAddStockModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Stock Quantity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      {isAddStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Add Stock for {activePart.name}</h3>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Additional Quantity to Receive:</label>
              <input
                type="number"
                value={addQtyInput}
                onChange={(e) => setAddQtyInput(Number(e.target.value))}
                min={1}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  addPartStock(activePart.id, addQtyInput);
                  setIsAddStockModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20"
              >
                Confirm Add Stock
              </button>
              <button
                onClick={() => setIsAddStockModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
