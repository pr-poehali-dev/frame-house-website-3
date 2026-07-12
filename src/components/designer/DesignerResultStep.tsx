import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";

interface ResultItem {
  styleId: string;
  label: string;
  emoji: string;
  url: string | null;
  error: string | null;
  loading: boolean;
}

interface DesignerResultStepProps {
  results: ResultItem[];
  activeResult: number;
  imagePreview: string;
  onSetActiveResult: (i: number) => void;
  onReset: () => void;
}

export default function DesignerResultStep({
  results,
  activeResult,
  imagePreview,
  onSetActiveResult,
  onReset,
}: DesignerResultStepProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-dark))]">
          {results.length > 1 ? "Сравните варианты" : "Ваш дизайн"}
        </h2>
        <button onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] border border-[hsl(var(--earth-sand))]/50 px-3 py-1.5 rounded-lg">
          <Icon name="RefreshCw" size={12} /> Новый дизайн
        </button>
      </div>

      {/* Tabs — если несколько */}
      {results.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {results.map((r, i) => (
            <button
              key={r.styleId}
              onClick={() => onSetActiveResult(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                activeResult === i
                  ? "bg-[hsl(var(--earth-brown))] text-white"
                  : "bg-white/70 border border-[hsl(var(--earth-sand))]/50 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--earth-brown))]/50"
              }`}
            >
              <span>{r.emoji}</span>
              {r.label}
              {r.loading && <Icon name="Loader" size={12} className="animate-spin" />}
              {r.error && <Icon name="AlertCircle" size={12} className="text-red-400" />}
              {r.url && !r.loading && <Icon name="CheckCircle" size={12} className={activeResult === i ? "text-white/80" : "text-[hsl(var(--earth-brown))]"} />}
            </button>
          ))}
        </div>
      )}

      {/* Активный результат */}
      {results[activeResult] && (
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 text-center font-medium">До</p>
            <div className="rounded-2xl overflow-hidden shadow h-64">
              <img src={imagePreview} alt="До" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 text-center font-medium">
              После — {results[activeResult].emoji} {results[activeResult].label}
            </p>
            <div className="rounded-2xl overflow-hidden shadow h-64 bg-[hsl(var(--earth-sand))]/20 flex items-center justify-center">
              {results[activeResult].loading && (
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-[hsl(var(--earth-sand))] border-t-[hsl(var(--earth-brown))] rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Генерирую...</p>
                </div>
              )}
              {results[activeResult].error && (
                <div className="text-center px-4">
                  <Icon name="AlertCircle" size={32} className="mx-auto mb-2 text-red-400" />
                  <p className="text-sm text-red-500">{results[activeResult].error}</p>
                </div>
              )}
              {results[activeResult].url && (
                <img src={results[activeResult].url!} alt="Результат" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Кнопки скачивания */}
      {results[activeResult]?.url && (
        <div className="flex gap-3 justify-center">
          <a
            href={results[activeResult].url!}
            download={`garden-${results[activeResult].styleId}.jpg`}
            onClick={() => reachGoal("designer_download", { style: results[activeResult].styleId })}
            className="flex items-center gap-2 bg-[hsl(var(--earth-brown))] text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all text-sm"
          >
            <Icon name="Download" size={16} />
            Скачать
          </a>
          {results.length > 1 && results.some((r, i) => i !== activeResult && r.url) && (
            <button
              onClick={() => {
                reachGoal("designer_download_all");
                results.forEach((r) => {
                  if (r.url) {
                    const a = document.createElement("a");
                    a.href = r.url!;
                    a.download = `garden-${r.styleId}.jpg`;
                    a.click();
                  }
                });
              }}
              className="flex items-center gap-2 border border-[hsl(var(--earth-sand))] text-[hsl(var(--earth-brown))] px-5 py-2.5 rounded-xl font-medium hover:bg-[hsl(var(--earth-sand))]/20 transition-all text-sm"
            >
              <Icon name="DownloadCloud" size={16} />
              Скачать все
            </button>
          )}
        </div>
      )}

      {/* Прогресс остальных */}
      {results.length > 1 && results.some((r) => r.loading) && (
        <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-4">
          Остальные варианты генерируются параллельно — переключайтесь между вкладками
        </p>
      )}
    </div>
  );
}
