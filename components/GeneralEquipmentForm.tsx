import React, { useState } from 'react';

type Status = 'OK' | 'Not OK' | 'N/A' | '';

const equipmentTypes = [
  'Backhoe Loader','Skid Steer Loader','Dumper','Excavator','Forklift','Dump Truck',
  'Bus','Telehandler','Roller Compactor','Wheel Loader','Road Grader','Concrete Pump'
];

const sections: { title: string; items: string[] }[] = [
  { title: 'A. Documents & Safety', items: ['Documents Available', 'Fire Extinguisher'] },
  { title: 'B. Tyres / Tracks / Rollers', items: ['Tires Condition', 'Track Condition', 'Roller Condition'] },
  { title: 'C. Engine & Hydraulic System', items: ['Engine Condition', 'Hydraulic System', 'Oil Leakage'] },
  { title: 'D. Braking & Controls', items: ['Braking System', 'Beacon / Reverse Alarm / Horn'] },
  { title: 'E. Operator Cabin & Safety', items: ['Operator Cabin Condition', 'Seat Belt', 'Mirror Condition'] },
  { title: 'F. Attachments & Stability', items: ['Bucket Condition', 'Fork Attachment', 'Outrigger / Stabilizer'] },
  { title: 'G. Electrical & Fuel', items: ['Battery Connection', 'Fuel Tank Condition'] }
];

const STORAGE_KEY = 'general_equipment_submissions';

export const GeneralEquipmentForm: React.FC<{ onBack: () => void; appTheme?: 'dark' | 'light' }> = ({ onBack, appTheme = 'dark' }) => {
  const isLight = appTheme === 'light';
  const textClass = isLight ? 'text-slate-900' : 'text-white';

  const [general, setGeneral] = useState({ reference: '', date: '', make: '', plate: '', periodFrom: '', periodTo: '' });
  const [typeSelections, setTypeSelections] = useState<Record<string, boolean>>(() => Object.fromEntries(equipmentTypes.map(t => [t, false])));

  const initialItems = sections.reduce((acc, s) => {
    s.items.forEach(it => acc[it] = { day: false, night: false, status: '' as Status, remarks: '' });
    return acc;
  }, {} as Record<string, { day: boolean; night: boolean; status: Status; remarks: string }>);

  const [items, setItems] = useState(initialItems);
  const [remarks, setRemarks] = useState('');
  const [operatorDay, setOperatorDay] = useState({ name: '', signature: '', date: '' });
  const [operatorNight, setOperatorNight] = useState({ name: '', signature: '', date: '' });

  const toggleType = (k: string) => setTypeSelections(s => ({ ...s, [k]: !s[k] }));

  const setItem = (key: string, patch: Partial<{ day: boolean; night: boolean; status: Status; remarks: string }>) => {
    setItems(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const handleSave = () => {
    const payload = { general, types: typeSelections, items, remarks, operatorDay, operatorNight, savedAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.push(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      try { window.dispatchEvent(new CustomEvent('checklistSaved', { detail: { type: 'General' } })); } catch(e){}
      alert('Form saved locally');
    } catch (e) {
      console.error(e);
      alert('Save failed');
    }
  };

  const handleReset = () => {
    setGeneral({ reference: '', date: '', make: '', plate: '', periodFrom: '', periodTo: '' });
    setTypeSelections(Object.fromEntries(equipmentTypes.map(t => [t, false])));
    setItems(initialItems);
    setRemarks('');
    setOperatorDay({ name: '', signature: '', date: '' });
    setOperatorNight({ name: '', signature: '', date: '' });
  };

  return (
    <div className={textClass}>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onBack} className={`py-2 px-3 rounded-lg border ${isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-white/[0.03] text-white border-white/10'}`}>Back</button>
        <h2 className="text-xl font-black">General Equipment Pre-Use Form</h2>
      </div>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">GENERAL INFORMATION</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Reference No" value={general.reference} onChange={e => setGeneral(g => ({ ...g, reference: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input type="date" value={general.date} onChange={e => setGeneral(g => ({ ...g, date: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input placeholder="Equipment Make" value={general.make} onChange={e => setGeneral(g => ({ ...g, make: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input placeholder="Plate / Plant No" value={general.plate} onChange={e => setGeneral(g => ({ ...g, plate: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input type="date" value={general.periodFrom} onChange={e => setGeneral(g => ({ ...g, periodFrom: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
          <input type="date" value={general.periodTo} onChange={e => setGeneral(g => ({ ...g, periodTo: e.target.value }))} className={`p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">2. EQUIPMENT TYPE (Tick Applicable)</h3>
        <div className="flex flex-wrap gap-3">
          {equipmentTypes.map(t => (
            <label key={t} className="flex items-center gap-2">
              <input type="checkbox" checked={typeSelections[t]} onChange={() => toggleType(t)} />
              <span className="select-none">{t}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">3. Inspection Instructions</h3>
        <p className="text-sm mb-2">Inspection must be conducted before equipment use. Tick Day or Night shift. Mark condition as OK / Not OK / N/A.</p>

        <div className="space-y-4">
          {sections.map(sec => (
            <div key={sec.title} className="p-3 border rounded">
              <h4 className="font-bold mb-2">{sec.title}</h4>
              <div className="space-y-2">
                {sec.items.map(it => (
                  <div key={it} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">{it}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={items[it]?.day || false} onChange={e => setItem(it, { day: e.target.checked })} /> Day</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={items[it]?.night || false} onChange={e => setItem(it, { night: e.target.checked })} /> Night</label>
                    </div>
                    <div className="col-span-3">
                      <select value={items[it]?.status || ''} onChange={e => setItem(it, { status: e.target.value as Status })} className={`w-full p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`}>
                        <option value="">Status</option>
                        <option value="OK">OK</option>
                        <option value="Not OK">Not OK</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input placeholder="Remarks" value={items[it]?.remarks || ''} onChange={e => setItem(it, { remarks: e.target.value })} className={`p-2 border rounded w-full ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">5. Remarks</h3>
        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className={`w-full p-2 border rounded ${isLight ? 'bg-white text-slate-900' : 'bg-[#071122] text-white'}`} placeholder="General remarks" />
      </section>

      <section className="mb-6 p-4 border rounded-lg">
        <h3 className="font-bold mb-2">6. Operator Declaration</h3>
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

export default GeneralEquipmentForm;
