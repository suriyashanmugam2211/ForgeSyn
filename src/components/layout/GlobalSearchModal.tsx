import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Cpu, AlertTriangle, Wrench, Package, Users, ChevronRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    machines,
    incidents,
    tickets,
    inventory,
    technicians,
    setSelectedMachineId,
    setSelectedIncidentId,
    setActiveView
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  const matchedMachines = query
    ? machines.filter(m => m.name.toLowerCase().includes(query) || m.code.toLowerCase().includes(query) || m.type.toLowerCase().includes(query))
    : [];

  const matchedIncidents = query
    ? incidents.filter(i => i.id.toLowerCase().includes(query) || i.machineName.toLowerCase().includes(query) || i.summary.toLowerCase().includes(query))
    : [];

  const matchedTickets = query
    ? tickets.filter(t => t.id.toLowerCase().includes(query) || t.title.toLowerCase().includes(query) || t.machineName.toLowerCase().includes(query))
    : [];

  const matchedParts = query
    ? inventory.filter(p => p.name.toLowerCase().includes(query) || p.partNumber.toLowerCase().includes(query))
    : [];

  const matchedTechs = query
    ? technicians.filter(t => t.name.toLowerCase().includes(query) || t.role.toLowerCase().includes(query))
    : [];

  const totalResults = matchedMachines.length + matchedIncidents.length + matchedTickets.length + matchedParts.length + matchedTechs.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden glass-panel">
        {/* Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search machines, incidents, tickets, parts, technicians..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-medium"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Type keywords to search across all ForgeSyn industrial assets & agent workflows.
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching records found for "<span className="text-cyan-400">{query}</span>"
            </div>
          ) : (
            <>
              {/* Machines */}
              {matchedMachines.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Machines ({matchedMachines.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedMachines.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMachineId(m.id);
                          setActiveView('machines');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{m.code} - {m.name}</span>
                          <p className="text-[11px] text-slate-400">{m.type} • {m.location}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents */}
              {matchedIncidents.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Incidents ({matchedIncidents.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedIncidents.map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setSelectedIncidentId(inc.id);
                          setActiveView('incidents');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">{inc.id} - {inc.machineName}</span>
                          <p className="text-[11px] text-slate-400">{inc.summary}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets */}
              {matchedTickets.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-400" /> Tickets ({matchedTickets.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedTickets.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveView('tickets');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">{t.id} - {t.title}</span>
                          <p className="text-[11px] text-slate-400">Assigned: {t.assignedTechnicianName} • Status: {t.status}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spare Parts */}
              {matchedParts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-400" /> Inventory Parts ({matchedParts.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedParts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveView('inventory');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">{p.partNumber} - {p.name}</span>
                          <p className="text-[11px] text-slate-400">Qty: {p.quantity} • ${p.unitCost} • {p.warehouseLocation}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technicians */}
              {matchedTechs.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" /> Technicians ({matchedTechs.length})
                  </h4>
                  <div className="space-y-1">
                    {matchedTechs.map(tech => (
                      <div
                        key={tech.id}
                        onClick={() => {
                          setActiveView('workforce');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300">{tech.name} - {tech.role}</span>
                          <p className="text-[11px] text-slate-400">{tech.skill} • {tech.availability}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
