export function SpecInput({ spec, setSpec, onGenerate, onClear, loading, hasSavedData }) {
  return (
    <div className="flex gap-3">
      <input
        value={spec}
        onChange={(e) => setSpec(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
        placeholder='e.g. "Build a CRM for a logistics company"'
        className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm
                   placeholder:text-gray-500 outline-none focus:border-violet-500/50 transition-colors"
      />
      <button
        onClick={onClear}
        disabled={!hasSavedData && !spec.trim()}
        className="px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-gray-200
                   hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Clear
      </button>
      <button
        onClick={onGenerate}
        disabled={loading || !spec.trim()}
        className="px-6 py-3 rounded-lg bg-violet-600 text-white text-sm font-medium
                   hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Generating...
          </>
        ) : 'Generate'}
      </button>
    </div>
  );
}