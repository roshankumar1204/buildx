export function CostFooter({ totalTokens, totalCost }) {
  if (!totalTokens) return null;
  return (
    <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-gray-500">
      <span>{totalTokens.toLocaleString()} tokens</span>
      <span>·</span>
      <span>${totalCost.toFixed(5)} est. cost</span>
    </div>
  );
}