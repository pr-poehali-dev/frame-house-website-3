import Icon from "@/components/ui/icon";

interface Style {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  preview: string;
}

interface DesignerStyleStepProps {
  styles: Style[];
  imagePreview: string;
  selectedStyles: string[];
  customDesc: string;
  totalPrice: number;
  pricePer: number;
  canProceed: boolean;
  onToggleStyle: (id: string) => void;
  onCustomDescChange: (v: string) => void;
  onReset: () => void;
  onProceed: () => void;
}

export default function DesignerStyleStep({
  styles,
  imagePreview,
  selectedStyles,
  customDesc,
  totalPrice,
  pricePer,
  canProceed,
  onToggleStyle,
  onCustomDescChange,
  onReset,
  onProceed,
}: DesignerStyleStepProps) {
  const lastPreview = selectedStyles.filter((s) => s !== "custom").slice(-1)[0];
  const lastStyle = styles.find((s) => s.id === lastPreview);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))] mb-3">Ваш участок</h2>
        <div className="rounded-2xl overflow-hidden shadow-md h-56 md:h-72">
          <img src={imagePreview} alt="Ваш участок" className="w-full h-full object-cover" />
        </div>

        {/* Превью описание */}
        {lastStyle && (
          <div className="mt-3 p-3 bg-[hsl(var(--earth-sand))]/20 border border-[hsl(var(--earth-sand))]/50 rounded-xl transition-all">
            <p className="text-xs text-[hsl(var(--earth-brown))] font-medium mb-0.5">
              {lastStyle.emoji} {lastStyle.label}:
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{lastStyle.preview}</p>
          </div>
        )}

        <button onClick={onReset} className="mt-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--earth-brown))] flex items-center gap-1">
          <Icon name="RefreshCw" size={12} /> Загрузить другое фото
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))]">Выберите стили</h2>
          {selectedStyles.length > 0 && (
            <span className="text-xs bg-[hsl(var(--earth-brown))] text-white px-2 py-0.5 rounded-full">
              {selectedStyles.length} выбрано
            </span>
          )}
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">
          Можно выбрать несколько — получите все варианты и сравните
        </p>

        <div className="space-y-2">
          {styles.map((s) => {
            const checked = selectedStyles.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onToggleStyle(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  checked
                    ? "border-[hsl(var(--earth-brown))] bg-[hsl(var(--earth-sand))]/20"
                    : "border-[hsl(var(--earth-sand))]/50 bg-white/70 hover:border-[hsl(var(--earth-brown))]/50"
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  checked ? "bg-[hsl(var(--earth-brown))] border-[hsl(var(--earth-brown))]" : "border-[hsl(var(--earth-sand))]"
                }`}>
                  {checked && <Icon name="Check" size={12} className="text-white" />}
                </div>
                <span className="text-xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[hsl(var(--earth-dark))]">{s.label}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.desc}</div>
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">{pricePer} ₽</span>
              </button>
            );
          })}
        </div>

        {/* Поле своего описания */}
        {selectedStyles.includes("custom") && (
          <div className="mt-3">
            <textarea
              value={customDesc}
              onChange={(e) => onCustomDescChange(e.target.value)}
              placeholder="Опишите желаемый дизайн: растения, материалы, стиль... Например: «розарий с фонтаном и беседкой, дорожки из камня»"
              rows={3}
              className="w-full border border-[hsl(var(--earth-sand))] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[hsl(var(--earth-brown))] resize-none bg-white/80"
            />
          </div>
        )}

        {/* Итог и кнопка */}
        {selectedStyles.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedStyles.length > 1 && (
              <div className="flex items-center justify-between bg-white/60 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-4 py-2.5">
                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                  {selectedStyles.length} варианта × {pricePer} ₽
                </span>
                <span className="font-bold text-[hsl(var(--earth-brown))]">{totalPrice} ₽</span>
              </div>
            )}
            <button
              onClick={onProceed}
              disabled={!canProceed}
              className="w-full bg-[hsl(var(--earth-brown))] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Icon name="Sparkles" size={16} />
              {selectedStyles.length > 1
                ? `Сгенерировать ${selectedStyles.length} варианта за ${totalPrice} ₽`
                : `Сгенерировать за ${pricePer} ₽`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
