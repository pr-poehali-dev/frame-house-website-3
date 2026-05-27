import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { sections, FOUNDATION_IMG } from "@/components/sections";
import Calculator from "@/components/Calculator";
import SidebarBlock from "@/components/SidebarBlock";
import HeroSection from "@/components/HeroSection";

export default function Index() {
  const [activeSection, setActiveSection] = useState("foundation");
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: "-80px 0px -50% 0px" }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--earth-deep))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--earth-ochre))] rounded-sm flex items-center justify-center text-lg">🏡</div>
              <span className="font-serif text-xl text-[hsl(var(--earth-cream))] font-semibold">КаркасДом</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? "bg-[hsl(var(--earth-ochre))] text-[hsl(var(--earth-deep))]"
                      : "text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))]"
                  }`}
                >
                  {s.emoji} {s.title}
                </button>
              ))}
            </div>

            <button
              className="md:hidden text-[hsl(var(--earth-cream))] p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[hsl(var(--earth-deep))] border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2 animate-fade-in">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-3 py-2 rounded text-sm text-left transition-all ${
                  activeSection === s.id
                    ? "bg-[hsl(var(--earth-ochre))] text-[hsl(var(--earth-deep))] font-semibold"
                    : "text-[hsl(var(--earth-sand))]"
                }`}
              >
                {s.emoji} {s.title}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <HeroSection onScrollTo={scrollTo} />

      {/* SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {sections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el; }}
            className="scroll-mt-20"
          >
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: section.color + "22", border: `2px solid ${section.color}44` }}
              >
                {section.emoji}
              </div>
              <div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] font-medium tracking-widest uppercase mb-1">
                  Этап {idx + 1}
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-deep))] leading-none">
                  {section.title}
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">{section.subtitle}</p>
              </div>
            </div>

            {idx === 0 && (
              <div className="rounded-2xl overflow-hidden mb-10 h-64 md:h-80">
                <img
                  src={FOUNDATION_IMG}
                  alt="Фундамент каркасного дома"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 space-y-5">
                {section.content.map((block, bi) => (
                  <div
                    key={bi}
                    className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-6 wood-texture"
                  >
                    <h3
                      className="font-serif text-xl font-semibold mb-3"
                      style={{ color: section.color }}
                    >
                      {block.heading}
                    </h3>
                    <p className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {block.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <SidebarBlock sidebar={section.sidebar} />
              </div>
            </div>

            <Calculator calc={section.calc} />

            {idx < sections.length - 1 && (
              <div className="mt-16 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(var(--earth-sand))] to-transparent" />
                <span className="text-[hsl(var(--earth-sand))] text-xl">{sections[idx + 1].emoji}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[hsl(var(--earth-sand))] to-transparent" />
              </div>
            )}
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-3xl mb-3">🏡</div>
          <div className="font-serif text-2xl text-[hsl(var(--earth-cream))] mb-2">КаркасДом</div>
          <p className="text-sm text-[hsl(var(--earth-sand))]/70 max-w-md mx-auto leading-relaxed">
            Информационный ресурс по строительству каркасных домов.<br/>Все расчёты носят ориентировочный характер.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-xs text-[hsl(var(--earth-sand))]/60 hover:text-[hsl(var(--earth-ochre))] transition-colors"
              >
                {s.emoji} {s.title}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
