import React, { useState } from 'react';
import craneChecklist from '../constants/checklists/Cranes/mobile-crane-operator-pre-use.json';
import { CranesForm } from './CranesForm';

interface ChecklistsProps {
  onBack: () => void;
  appTheme?: 'dark' | 'light';
}

export const Checklists: React.FC<ChecklistsProps> = ({ onBack, appTheme = 'dark' }) => {
  const isLight = appTheme === 'light';
  const [activeTab, setActiveTab] = useState<string>('Crane');

  const tabs = [
    { key: 'Crane', label: 'Crane', data: craneChecklist }
  ];

  const activeData = tabs.find(t => t.key === activeTab)?.data || [];

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
    </div>
  );
};

export default Checklists;
