import { useState } from "react";
import Icon from "@/components/ui/icon";

const BEFORE_IMG = "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/3e21339d-99c2-4b2d-8240-8aabb4663e2e.jpg";

const EXAMPLES = [
  { id: "english", label: "Английский сад", emoji: "🌹", after: "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/e4d85132-66c2-4c36-9523-b40712c8af03.jpg" },
  { id: "japanese", label: "Японский", emoji: "🎋", after: "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/f97e6254-510f-4b67-a31a-0f74d3b0c6e6.jpg" },
  { id: "minimalist", label: "Минимализм", emoji: "⬜", after: "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/522208a2-c25f-4844-8252-e003923fbccc.jpg" },
  { id: "russian", label: "Русская усадьба", emoji: "🍎", after: "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/a7f7c542-e76f-4bd8-af68-5369007523cd.jpg" },
  { id: "provence", label: "Прованс", emoji: "💜", after: "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/5c4f316d-4b35-476c-863d-edd950cab1a2.jpg" },
];

export default function StyleExamples() {
  const [active, setActive] = useState(0);
  const current = EXAMPLES[active];

  return (
    <div className="mt-8">
      <h3 className="font-serif text-lg font-bold text-[hsl(var(--earth-dark))] text-center mb-1">
        Примеры результата
      </h3>
      <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mb-4">
        Так ИИ может преобразить обычный участок в любом из стилей
      </p>

      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              active === i
                ? "bg-[hsl(var(--earth-brown))] text-white border-[hsl(var(--earth-brown))]"
                : "bg-white/70 text-[hsl(var(--earth-dark))] border-[hsl(var(--earth-sand))]/60 hover:border-[hsl(var(--earth-brown))]/50"
            }`}
          >
            {ex.emoji} {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5 text-center font-medium">До</p>
          <div className="rounded-2xl overflow-hidden border border-[hsl(var(--earth-sand))]/50 shadow-sm h-48 sm:h-64">
            <img src={BEFORE_IMG} alt="Участок до дизайна" className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1.5 text-center font-medium">
            После — {current.emoji} {current.label}
          </p>
          <div className="rounded-2xl overflow-hidden border border-[hsl(var(--earth-sand))]/50 shadow-sm h-48 sm:h-64">
            <img src={current.after} alt={`Пример дизайна участка в стиле ${current.label}`} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-[hsl(var(--muted-foreground))]/70 text-center mt-2 flex items-center justify-center gap-1">
        <Icon name="Sparkles" size={11} />
        Примеры сгенерированы ИИ для демонстрации возможностей конструктора
      </p>
    </div>
  );
}
