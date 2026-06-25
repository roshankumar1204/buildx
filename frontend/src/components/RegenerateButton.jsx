import { useState } from 'react';
import { regenerateStage } from '../lib/api';

export function RegenerateButton({ stage, payload, onResult }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const data = await regenerateStage(stage, payload);
      onResult(data);
    } catch (err) {
      alert(`Regeneration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10
                 text-gray-400 hover:text-white hover:border-violet-500/50
                 transition-colors disabled:opacity-40 flex items-center gap-1.5"
    >
      {loading ? (
        <span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      ) : '↻'}
      Regenerate
    </button>
  );
}