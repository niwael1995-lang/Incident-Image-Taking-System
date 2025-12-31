import React, { useState } from 'react';

type Status = 'OK' | 'Not OK' | 'N/A' | '';

const sections: { key: string; items: string[] }[] = [
  { key: 'documents', items: ['Load Chart Available', 'Crane Manual'] },
  { key: 'engine', items: ['Engine Condition', 'Hydraulic System', 'Hydraulic Hoses / Cylinders', 'Oil Leakage'] },
  { key: 'monitoring', items: ['Load Monitor', 'Load Indicator Light', 'Anemometer Device', 'Anti-Two Block Device'] },
  { key: 'cabin', items: ['Braking System', 'Gauges', 'Horn / Sheaves', 'Beacon / Reverse Alarm', 'Head & Rear Lights', 'Seat Belt', 'Side Mirrors'] },
  { key: 'hook', items: ['Hook Block & Safety Latch', 'Wedge Socket & Wire Rope', 'Sheaves', 'Winch & Spooling', 'Wire Rope Guide Roller'] },
  { key: 'outriggers', items: ['Outrigger Jacks', 'Outrigger Pads / Mats', 'Outrigger Control System', 'Level Indicator'] },
  { key: 'boom', items: ['Boom Angle Indicator', 'Telescopic Boom', 'Lattice Boom', 'Fly Jib', 'Counterweight'] },
  { key: 'mobility', items: ['Tires', 'Crawler Track (if applicable)', 'Moving Parts', 'Battery Condition', 'Fuel Tank', 'Fire Extinguisher'] }
];

const STORAGE_KEY = 'crane_checklist_submissions';

export const CranesForm: React.FC<{ onBack: () => void; appTheme?: 'dark' | 'light' }> = ({ onBack, appTheme = 'dark' }) => {
  const isLight = appTheme === 'light';
  const textClass = isLight ? 'text-slate-900' : 'text-white';

  const [general, setGeneral] = useState({ reference: '', date: '', make: '', plate: '', periodFrom: '', periodTo: '' });
  const [craneTypes, setCraneTypes] = useState<Record<string, boolean>>({ 'Rough Terrain': false, 'All Terrain': false, 'Crawler – Lattice Boom': false, 'Crawler – Telescopic': false, 'Spider Crane': false, 'Lorry Mounted Crane': false });

  const initialItemsState = sections.reduce((acc, sec) => {
    sec.items.forEach(it => {
      acc[it] = { day: false, night: false, status: '' as Status, remarks: '' };
    });
    return acc;
  }, {} as Record<string, { day: boolean; night: boolean; status: Status; remarks: string }>);

  const [items, setItems] = useState(initialItemsState);
  const [remarks, setRemarks] = useState('');
  const [expiry, setExpiry] = useState({ thirdParty: '', registration: '', operatorCert: '' });
  const [operatorDay, setOperatorDay] = useState({ name: '', signature: '', date: '' });
  const [operatorNight, setOperatorNight] = useState({ name: '', signature: '', date: '' });

  const handleToggleType = (k: string) => setCraneTypes(s => ({ ...s, [k]: !s[k] }));

  const setItemField = (key: string, field: Partial<{ day: boolean; night: boolean; status: Status; remarks: string }>) => {
    setItems(prev => ({ ...prev, [key]: { ...prev[key], ...field } }));
  };

  const handleSave = () => {
    const payload = { general, craneTypes, items, remarks, expiry, operatorDay, operatorNight, savedAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.push(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      // notify parent UI to refresh saved list
      try { window.dispatchEvent(new CustomEvent('checklistSaved', { detail: { type: 'Crane' } })); } catch(e){}
      alert('Checklist saved locally');
    } catch (e) {
      console.error(e);
      alert('Failed to save');
    }
  };

  const handleReset = () => {
    setGeneral({ reference: '', date: '', make: '', plate: '', periodFrom: '', periodTo: '' });
    setCraneTypes({ 'Rough Terrain': false, 'All Terrain': false, 'Crawler – Lattice Boom': false, 'Crawler – Telescopic': false, 'Spider Crane': false, 'Lorry Mounted Crane': false });
    setItems(initialItemsState);
    setRemarks('');
    setExpiry({ thirdParty: '', registration: '', operatorCert: '' });
    setOperatorDay({ name: '', signature: '', date: '' });
    setOperatorNight({ name: '', signature: '', date: '' });
  };

  return (
    <div className={textClass}>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onBack} className={`py-2 px-3 rounded-lg border ${isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-white/[0.03] text-white border-white/10'}`}>Back</button>
        <h2 className="text-xl font-black">Mobile Crane Pre-Use Form</h2>
      </div>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">1. General Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Reference No" value={general.reference} onChange={e => setGeneral(g => ({ ...g, reference: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input type="date" value={general.date} onChange={e => setGeneral(g => ({ ...g, date: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input placeholder="Crane Make" value={general.make} onChange={e => setGeneral(g => ({ ...g, make: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input placeholder="Plate / Plant No" value={general.plate} onChange={e => setGeneral(g => ({ ...g, plate: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <div className="col-span-1">
            <label className="block text-sm">Period From</label>
            <input type="date" value={general.periodFrom} onChange={e => setGeneral(g => ({ ...g, periodFrom: e.target.value }))} className="p-2 border rounded w-full" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm">Period To</label>
            <input type="date" value={general.periodTo} onChange={e => setGeneral(g => ({ ...g, periodTo: e.target.value }))} className="p-2 border rounded w-full" />
          </div>
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">2. Crane Type (Tick applicable)</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(craneTypes).map(k => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={craneTypes[k]} onChange={() => handleToggleType(k)} />
              <span className={`select-none ${textClass}`}>{k}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">3–11. Inspections (Tick Day or Night, set Status, add Remarks)</h3>
        <div className="space-y-4">
          {sections.map(sec => (
            <div key={sec.key} className="p-3 border rounded">
              <h4 className="font-bold mb-2">{sec.key.toUpperCase()}</h4>
              <div className="space-y-2">
                {sec.items.map(it => (
                  <div key={it} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">{it}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={items[it]?.day || false} onChange={e => setItemField(it, { day: e.target.checked })} /> Day</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={items[it]?.night || false} onChange={e => setItemField(it, { night: e.target.checked })} /> Night</label>
                    </div>
                    <div className="col-span-3">
                      <select value={items[it]?.status || ''} onChange={e => setItemField(it, { status: e.target.value as Status })} className={`w-full p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`}>
                        <option value="">Status</option>
                        <option value="OK">OK</option>
                        <option value="Not OK">Not OK</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input placeholder="Remarks" value={items[it]?.remarks || ''} onChange={e => setItemField(it, { remarks: e.target.value })} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">12–13. Remarks & Expiry Details</h3>
        <textarea placeholder="General Remarks" value={remarks} onChange={e => setRemarks(e.target.value)} className={`w-full p-2 border rounded mb-3 ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
        <div className="grid grid-cols-3 gap-3">
          <input type="date" value={expiry.thirdParty} onChange={e => setExpiry(s => ({ ...s, thirdParty: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input type="date" value={expiry.registration} onChange={e => setExpiry(s => ({ ...s, registration: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input type="date" value={expiry.operatorCert} onChange={e => setExpiry(s => ({ ...s, operatorCert: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">14. Operator Declaration</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold">Day Shift Operator Name</label>
            <input value={operatorDay.name} onChange={e => setOperatorDay(s => ({ ...s, name: e.target.value }))} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
            <label className="block text-sm font-bold mt-2">Signature</label>
            <input value={operatorDay.signature} onChange={e => setOperatorDay(s => ({ ...s, signature: e.target.value }))} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
            <label className="block text-sm font-bold mt-2">Date</label>
            <input type="date" value={operatorDay.date} onChange={e => setOperatorDay(s => ({ ...s, date: e.target.value }))} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          </div>
          <div>
            <label className="block text-sm font-bold">Night Shift Operator Name</label>
            <input value={operatorNight.name} onChange={e => setOperatorNight(s => ({ ...s, name: e.target.value }))} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
            <label className="block text-sm font-bold mt-2">Signature</label>
            <input value={operatorNight.signature} onChange={e => setOperatorNight(s => ({ ...s, signature: e.target.value }))} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
            <label className="block text-sm font-bold mt-2">Date</label>
            <input type="date" value={operatorNight.date} onChange={e => setOperatorNight(s => ({ ...s, date: e.target.value }))} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button onClick={handleSave} className="py-2 px-4 bg-blue-600 text-white rounded font-bold">Save</button>
        <button onClick={handleReset} className="py-2 px-4 border rounded">Reset</button>
      </div>
    </div>
  );
};

export default CranesForm;
