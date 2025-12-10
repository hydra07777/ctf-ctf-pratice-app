import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function AdminCompetitionPage() {
  const [competitions, setCompetitions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);

  const loadCompetitions = async () => {
    // simple: fetch all competitions via GET /competitions (not implemented),
    // so for now we only allow creation and assume IDs connues.
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/competitions', { title, description });
      setTitle('');
      setDescription('');
      alert('Compétition créée');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur de création');
    }
  };

  const handleStart = async (id) => {
    try {
      await api.post(`/competitions/${id}/start`, { durationMinutes });
      alert('Compétition démarrée');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur de démarrage');
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xl rounded border border-slate-800 bg-slate-900/70 p-5">
        <h1 className="mb-4 text-xl font-semibold">Administration des compétitions</h1>
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
          >
            Créer la compétition
          </button>
        </form>
      </div>

      <div className="rounded border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="mb-3 text-lg font-semibold">Démarrer une compétition (ID manuel)</h2>
        <p className="mb-3 text-sm text-slate-300">
          Pour le moment, saisis simplement l'ID de la compétition que tu as créée via Postman
          ou la base (ex: 1), puis clique sur "Démarrer".
        </p>
        <div className="flex items-center gap-3 text-sm">
          <label className="mb-1 block text-sm">Durée (minutes)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="w-24 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <div className="mt-3 flex gap-2 text-sm">
          <input
            id="competition-id-input"
            placeholder="ID de la compétition (ex: 1)"
            className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={() => {
              const id = document.getElementById('competition-id-input').value;
              if (!id) return;
              handleStart(id);
            }}
            className="rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
          >
            Démarrer
          </button>
        </div>
      </div>
    </div>
  );
}
