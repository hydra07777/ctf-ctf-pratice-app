import { useState } from 'react';
import { api } from '../api/client.js';

export function UploadCTFPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(100);
  const [expectedFlag, setExpectedFlag] = useState('');
  const [competitionId, setCompetitionId] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!zipFile) {
      setError('Veuillez sélectionner un fichier zip');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('points', points);
    formData.append('expectedFlag', expectedFlag);
    if (competitionId) formData.append('competitionId', competitionId);
    formData.append('zipFile', zipFile);

    setLoading(true);
    try {
      await api.post('/challenges', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('CTF créé avec succès');
      setTitle('');
      setDescription('');
      setPoints(100);
      setExpectedFlag('');
      setCompetitionId('');
      setZipFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'upload du CTF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900/60 p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Uploader un CTF</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="h-24 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm">Points</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Flag attendu</label>
            <input
              value={expectedFlag}
              onChange={(e) => setExpectedFlag(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">ID de compétition (optionnel)</label>
            <input
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Fichier zip</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-200"
            />
          </div>
        </div>
        {message && <p className="text-sm text-emerald-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? 'Upload...' : 'Créer le CTF'}
        </button>
      </form>
    </div>
  );
}
