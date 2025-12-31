import React, { useEffect, useState } from 'react';
import craneChecklist from '../constants/checklists/Cranes/mobile-crane-operator-pre-use.json';
import generalChecklist from '../constants/checklists/General/general-equipment.json';
import { GeneralEquipmentForm } from './GeneralEquipmentForm';
import { CranesForm } from './CranesForm';

interface ChecklistsProps {
  onBack: () => void;
  appTheme?: 'dark' | 'light';
}

export const Checklists: React.FC<ChecklistsProps> = ({ onBack, appTheme = 'dark' }) => {
  const isLight = appTheme === 'light';
  const [activeTab, setActiveTab] = useState<string>('Crane');

  const tabs = [
    { key: 'Crane', label: 'Crane', data: craneChecklist },
    { key: 'General', label: 'General Equipment', data: generalChecklist }
  ];

  const activeData = tabs.find(t => t.key === activeTab)?.data || [];
  const [savedEntries, setSavedEntries] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const storageKeyFor = (tabKey: string) => {
    if (tabKey === 'Crane') return 'crane_checklist_submissions';
    if (tabKey === 'General') return 'general_equipment_submissions';
    return '';
  };

  const loadSaved = () => {
    const key = storageKeyFor(activeTab);
    if (!key) { setSavedEntries([]); return; }
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      setSavedEntries(Array.isArray(data) ? data : []);
    } catch (e) { setSavedEntries([]); }
  };

  useEffect(() => {
    loadSaved();
    const handler = (e: any) => { loadSaved(); };
    window.addEventListener('checklistSaved', handler);
    return () => window.removeEventListener('checklistSaved', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`mb-6 flex items-center gap-4`}>
        <button onClick={onBack} className={`py-2 px-3 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
          Back
        </button>
        <h2 className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Checklists</h2>
      </div>

      <div className="mb-6">
        <div className="flex gap-3">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`py-2 px-4 rounded-full font-black text-sm ${activeTab === t.key ? 'bg-blue-600 text-white' : (isLight ? 'bg-white border border-slate-200 text-slate-700' : 'bg-white/[0.03] border border-white/10 text-white/80')}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
        {activeTab === 'Crane' ? (
          <CranesForm onBack={onBack} appTheme={appTheme} />
        ) : activeTab === 'General' ? (
          <GeneralEquipmentForm onBack={onBack} appTheme={appTheme} />
        ) : (
          <>
            <h3 className="text-lg font-black mb-4">{activeTab} / Mobile Crane Operator Pre-Use</h3>
            {activeData.map((section: any, idx: number) => (
              <div key={idx} className="mb-4">
                <h4 className="font-bold uppercase text-sm mb-2">{section.title}</h4>
                <ul className="list-disc pl-5 text-sm">
                  {section.items && section.items.length ? (
                    section.items.map((it: string, i: number) => <li key={i}>{it}</li>)
                  ) : (
                    <li className="opacity-50">No items</li>
                  )}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-6 max-w-4xl mx-auto">
        <h3 className={`text-lg font-black mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Saved Checklists</h3>
        {savedEntries.length === 0 ? (
          <div className={`p-4 rounded border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>No saved checklists for {activeTab}.</div>
        ) : (
          <div className="space-y-3">
            {savedEntries.map((entry, idx) => (
              <div key={idx} className={`p-3 rounded border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black">{activeTab} Checklist #{idx + 1}</div>
                    <div className="text-[11px] opacity-70">Saved: {new Date(entry.savedAt || entry.savedAt || Date.now()).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)} className="py-1 px-3 border rounded text-sm">{expandedIndex === idx ? 'Hide' : 'View'}</button>
                  </div>
                </div>
                {expandedIndex === idx && (
                  <pre className="mt-3 overflow-auto text-[12px] p-2 rounded bg-[#020617]/5" style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(entry, null, 2)}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklists;
