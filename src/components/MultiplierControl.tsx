interface Props {
  multiplier: number;
  onChange: (value: number) => void;
}

const MIN = 0.25;
const MAX = 10;
const DEFAULT = 1;

function clamp(value: number) {
  if (Number.isNaN(value)) return MIN;
  return Math.min(MAX, Math.max(MIN, value));
}

export default function MultiplierControl({ multiplier, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="multiplier-range" className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Scale
        </label>
        <div className="flex items-center gap-1">
          <input
            id="multiplier-number"
            type="number"
            min={MIN}
            max={MAX}
            step={0.05}
            value={multiplier}
            onChange={(e) => onChange(Number(e.target.value))}
            onBlur={(e) => onChange(clamp(Number(e.target.value)))}
            className="w-20 rounded-lg border border-stone-300 bg-white px-2 py-1 text-right text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          />
          <span className="text-stone-500 dark:text-stone-400">×</span>
          <button
            type="button"
            onClick={() => onChange(DEFAULT)}
            disabled={multiplier === DEFAULT}
            className="ml-1 rounded-lg border border-stone-300 bg-white px-2 py-1 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            Reset
          </button>
        </div>
      </div>
      <input
        id="multiplier-range"
        type="range"
        min={MIN}
        max={MAX}
        step={0.05}
        value={multiplier}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-600"
      />
      <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500">
        <span>{MIN}×</span>
        <span>{MAX}×</span>
      </div>
    </div>
  );
}
