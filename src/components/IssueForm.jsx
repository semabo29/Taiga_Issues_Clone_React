import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function IssueForm({ onBack, issueToEdit = null, onShowNotification }) {
  const { currentUser, USERS, statuses, issueTypes, priorities, severities, deadlineShortcuts } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: issueToEdit?.subject || "",
    description: issueToEdit?.description || "",
    status_id: issueToEdit?.status_id || (statuses.length > 0 ? statuses[0].id : 1),
    priority_id: issueToEdit?.priority_id || (priorities.length > 0 ? priorities[0].id : 2),
    severity_id: issueToEdit?.severity_id || (severities.length > 0 ? severities[0].id : 2),
    issue_type_id: issueToEdit?.issue_type_id || (issueTypes.length > 0 ? issueTypes[0].id : 1),
    assigned_to_id: issueToEdit?.assigned_to_id || "", 
    deadline: issueToEdit?.deadline || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) { 
      onShowNotification("El subject és obligatori", "error"); 
      return; 
    }
    
    setLoading(true); 

    const payload = { ...formData };
    if (!payload.deadline) delete payload.deadline;
    
    payload.assigned_to_id = (payload.assigned_to_id === "" || payload.assigned_to_id === null) ? null : parseInt(payload.assigned_to_id, 10);

    try {
      if (issueToEdit) {
        await issueService.update(currentUser.apiKey, issueToEdit.id, payload);
        onShowNotification("Incidència modificada correctament", "success");
      } else {
        await issueService.create(currentUser.apiKey, payload);
        onShowNotification("Incidència creada correctament", "success");
      }
      onBack();
    } catch (err) {
      onShowNotification("Error al guardar la incidència", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleShortcutClick = (shortcut) => {
    const rawDays = shortcut.offset_days ?? shortcut.days ?? shortcut.offset ?? 0;
    const daysToAdd = parseInt(rawDays, 10);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    const offset = newDate.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(newDate.getTime() - offset)).toISOString().split('T')[0];
    
    setFormData(prev => ({ ...prev, deadline: localISOTime }));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-[Inter]">
      <main className="flex-1 flex flex-col px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 pb-4 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {issueToEdit ? `Editar #${issueToEdit.id}` : 'Nova Incidència'}
          </h1>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onBack} 
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel·lar
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardant...' : 'Guardar Canvis'}
            </button>
          </div>
        </header>

        {/* Editor Form Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Main Content */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Assumpte Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-2">
              <label htmlFor="assumpte" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Assumpte
              </label>
              <input 
                id="assumpte"
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Escriu l'assumpte de la incidència..."
                required 
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-shadow"
              />
            </div>

            {/* Descripció Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-2 flex-1">
              <label htmlFor="descripcio" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Descripció
              </label>
              <textarea 
                id="descripcio"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Afegeix més detalls aquí..."
                disabled={loading}
                rows="16"
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-shadow resize-y"
              />
            </div>

          </div>

          {/* Right Column: Attributes Sidebar */}
          <aside className="md:col-span-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col gap-5 sticky top-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3 mb-1">
                Atributs
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Tipus</label>
                <div className="relative">
                  <select 
                    value={formData.issue_type_id} 
                    onChange={(e) => setFormData({ ...formData, issue_type_id: parseInt(e.target.value, 10) })} 
                    disabled={loading} 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    {issueTypes.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Estat</label>
                <div className="relative">
                  <select 
                    value={formData.status_id} 
                    onChange={(e) => setFormData({ ...formData, status_id: parseInt(e.target.value, 10) })} 
                    disabled={loading} 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    {statuses.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Prioritat</label>
                <div className="relative">
                  <select 
                    value={formData.priority_id} 
                    onChange={(e) => setFormData({ ...formData, priority_id: parseInt(e.target.value, 10) })} 
                    disabled={loading} 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    {priorities.map((pr) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Severitat</label>
                <div className="relative">
                  <select 
                    value={formData.severity_id} 
                    onChange={(e) => setFormData({ ...formData, severity_id: parseInt(e.target.value, 10) })} 
                    disabled={loading} 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    {severities.map((sv) => <option key={sv.id} value={sv.id}>{sv.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Assignat a</label>
                <div className="relative">
                  <select 
                    value={formData.assigned_to_id || ""} 
                    onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value })} 
                    disabled={loading} 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Sense assignar</option>
                    {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                </div>
              </div>

              {/* Data Límit Section */}
              <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 mt-2">
                <label className="text-sm font-medium text-gray-600">Data Límit (Deadline)</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    disabled={loading}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none cursor-text"
                  />
                </div>
                
                {/* bloc de botons per als atajos de dates límits */}
                {deadlineShortcuts && deadlineShortcuts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {deadlineShortcuts.map(shortcut => (
                      <button
                        key={shortcut.id}
                        type="button"
                        onClick={() => handleShortcutClick(shortcut)}
                        disabled={loading}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {shortcut.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}