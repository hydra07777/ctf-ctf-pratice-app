import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';

export function CompetitionsListPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/competitions');
        setCompetitions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div>Chargement des compétitions...</div>;
  }

  if (!competitions.length) {
    return <div>Aucune compétition disponible pour le moment.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Compétitions disponibles</h1>
      <div className="space-y-3">
        {competitions.map((c) => (
          <Link
            key={c.id}
            to={`/competitions/${c.id}`}
            className="block rounded border border-slate-800 bg-slate-900/70 p-4 hover:border-cyan-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{c.title}</h2>
                <p className="text-sm text-slate-300">{c.description}</p>
              </div>
              <div className="text-sm text-slate-300">Status : {c.status}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
