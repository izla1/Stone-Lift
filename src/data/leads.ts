export interface Lead { id: string; name: string; phone: string; message: string; createdAt: string; }

const KEY = 'sl_leads';

export function getLeads(): Lead[] {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}
export function addLead(l: Omit<Lead, 'id' | 'createdAt'>) {
  const leads = getLeads();
  leads.unshift({ ...l, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(leads));
}
export function deleteLead(id: string) {
  localStorage.setItem(KEY, JSON.stringify(getLeads().filter((l) => l.id !== id)));
}
