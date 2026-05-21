import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { issueService } from '../services/issueService';

export default function BulkInsert({ onBack, onShowNotification }) {
  const { currentUser } = useContext(UserContext);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      onShowNotification("El text no pot estar buit", "error");
      return;
    }
    setLoading(true);

    try {
      const response = await issueService.bulkInsert(currentUser.apiKey, text);
      onShowNotification(response.message || "Creats correctament!", "success");
      setText("");
      setTimeout(() => { if (onBack) onBack(); }, 1500);
    } catch (error) {
      onShowNotification("Error en la inserció massiva.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-[Inter]">
      <main className="flex-1 flex flex-col px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Inserció Massiva (Bulk)</h2>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Afegeix <span className="font-bold text-gray-900">un títol per línia</span>. El sistema crearà una incidència per cada línia amb els valors per defecte de Taiga.
            </p>
          </div>

          {/* Text Area Container */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="relative w-full h-[400px]">
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ej:&#10;Falta botó Login&#10;Error 500 en perfil&#10;Actualitzar logos"
                className="w-full h-full p-6 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none resize-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              onClick={handleSubmit} 
              disabled={loading || !text.trim()} 
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              {loading ? 'Processant...' : 'Crear Totes les Incidències'}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}