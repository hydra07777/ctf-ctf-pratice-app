import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../api/client.js';

const socket = io('http://localhost:4000');

export function CompetitionPage() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [compRes, challRes, lbRes] = await Promise.all([
          api.get(`/competitions/${id}`),
          api.get('/challenges', { params: { competitionId: id } }),
          api.get(`/competitions/${id}/leaderboard`),
        ]);
        setCompetition(compRes.data);
        setChallenges(challRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    socket.emit('join_competition', id);
    socket.on('score_updated', (lb) => {
      setLeaderboard(lb);
    });

    return () => {
      socket.off('score_updated');
    };
  }, [id]);

  const now = new Date();
  const endTime = competition?.endTime ? new Date(competition.endTime) : null;

  const remaining = useMemo(() => {
    if (!endTime) return null;
    const diffMs = endTime.getTime() - now.getTime();
    if (diffMs <= 0) return 'Terminé';
    const totalSec = Math.floor(diffMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }, [endTime, now]);

  const handleSubmitFlag = async (ctfId) => {
    const flag = flags[ctfId] || '';
    if (!flag) return;
    try {
      const res = await api.post('/submissions', { ctfId, flag });
      if (res.data.isCorrect) {
        alert('Bonne réponse !');
      } else {
        alert('Mauvais flag');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur de soumission');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!competition) {
    return <div>Compétition introuvable.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between rounded border border-slate-800 bg-slate-900/70 px-4 py-3">
          <div>
            <h1 className="text-xl font-semibold">{competition.title}</h1>
            <p className="text-sm text-slate-300">{competition.description}</p>
          </div>
          <div className="text-right text-sm">
            <div>Status : {competition.status}</div>
            <div>Temps restant : {remaining ?? '-'}</div>
          </div>
        </div>

        <div className="space-y-3">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="rounded border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{c.title}</h2>
                  <p className="text-sm text-slate-300">{c.description}</p>
                </div>
                <div className="text-sm text-cyan-300">{c.points} pts</div>
              </div>
              <div className="mt-2 text-sm">
                <a
                  href={`http://localhost:4000/${c.zipPath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Télécharger les fichiers
                </a>
              </div>
              <div className="mt-3 flex gap-2 text-sm">
                <input
                  placeholder="Soumettre un flag"
                  value={flags[c.id] || ''}
                  onChange={(e) =>
                    setFlags((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => handleSubmitFlag(c.id)}
                  className="rounded bg-cyan-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-cyan-400"
                >
                  Tester
                </button>
              </div>
            </div>
          ))}

          {challenges.length === 0 && (
            <p className="text-sm text-slate-300">Aucun CTF disponible pour cette compétition.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="mb-2 text-lg font-semibold">Leaderboard</h2>
          <div className="space-y-1 text-sm">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.userId}
                className="flex items-center justify-between rounded border border-slate-800 bg-slate-950/60 px-3 py-2"
              >
                <span>
                  #{idx + 1} {entry.username}
                </span>
                <span className="font-semibold text-cyan-300">
                  {entry.totalPoints} pts
                </span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-slate-300">Pas encore de scores.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
