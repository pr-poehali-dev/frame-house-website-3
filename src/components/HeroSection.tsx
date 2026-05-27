import Icon from "@/components/ui/icon";
import { HERO_IMG, sections } from "@/components/sections";

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export default function HeroSection({ onScrollTo }: HeroSectionProps) {
  return (
    <section className="relative h-[90vh] min-h-[500px] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(25,45%,12%)] via-[hsl(25,45%,12%)]/50 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--earth-ochre))]/20 border border-[hsl(var(--earth-ochre))]/40 rounded-full px-4 py-1.5 mb-5">
            <span className="text-[hsl(var(--earth-ochre))] text-sm font-medium">Полное руководство по строительству</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[hsl(var(--earth-cream))] leading-none mb-4">
            Каркасный<br/>
            <span className="text-[hsl(var(--earth-ochre))]">дом</span> своими<br/>руками
          </h1>
          <p className="text-[hsl(var(--earth-sand))] text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            От фундамента до отопления — пошаговые инструкции, нормы и калькуляторы материалов для каждого этапа строительства
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onScrollTo("foundation")}
              className="bg-[hsl(var(--earth-ochre))] hover:bg-[hsl(38,65%,44%)] text-[hsl(var(--earth-deep))] font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <Icon name="Play" size={16} />
              Начать читать
            </button>
            <button
              onClick={() => onScrollTo("foundation")}
              className="border border-[hsl(var(--earth-sand))]/50 text-[hsl(var(--earth-cream))] hover:bg-white/10 px-6 py-3 rounded-lg transition-all flex items-center gap-2"
            >
              <Icon name="Calculator" size={16} />
              Калькуляторы
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[hsl(var(--earth-brown))]/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-1 overflow-x-auto">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onScrollTo(s.id)}
              className="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded hover:bg-white/10 transition-all group"
            >
              <span className="w-5 h-5 rounded-full bg-[hsl(var(--earth-ochre))]/25 text-[hsl(var(--earth-ochre))] text-xs flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-[hsl(var(--earth-cream))] text-sm group-hover:text-[hsl(var(--earth-ochre))] transition-colors">{s.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
