import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AppNotification } from '../../types';
import { Bell, Trash2, X, AlertTriangle, Info, CheckCircle2, Wrench, Package, ShieldAlert } from 'lucide-react';

export const NotificationsDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, dismissNotification, clearAllNotifications, setActiveView, setSelectedMachineId } = useApp();

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'anomaly': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'diagnosis': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'inventory': return <Package className="w-4 h-4 text-cyan-400" />;
      case 'ticket': return <Wrench className="w-4 h-4 text-indigo-400" />;
      case 'completion': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (notif.relatedEntityType === 'machine' && notif.relatedEntityId) {
      setSelectedMachineId(notif.relatedEntityId);
      setActiveView('machines');
    } else if (notif.type === 'anomaly') {
      setActiveView('incidents');
    } else if (notif.type === 'inventory') {
      setActiveView('inventory');
    } else if (notif.type === 'ticket' || notif.type === 'completion') {
      setActiveView('tickets');
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden glass-panel">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">System Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">No active notifications</div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className="p-3 hover:bg-slate-800/40 cursor-pointer transition-colors flex items-start gap-3 group"
            >
              <div className="mt-0.5">{getNotifIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">{n.title}</h4>
                  <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(n.id);
                }}
                className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
