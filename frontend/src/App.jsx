import { useState } from 'react';
import { SpecInput } from './components/SpecInput';
import { ResultTabs } from './components/ResultTabs';
import { generatePlan } from './lib/api';

export default function App() {
  const [spec, setSpec] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!spec.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await generatePlan(spec);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200 flex flex-col">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold text-white">AI Software Architect</h1>
        <p className="text-xs text-gray-500">Turn a one-line requirement into a full engineering plan</p>
      </header>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <SpecInput spec={spec} setSpec={setSpec} onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <ResultTabs result={result} setResult={setResult} spec={spec} />
          </div>
        )}
      </div>
    </div>
  );
}