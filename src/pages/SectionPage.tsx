import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Icon from "@/components/ui/icon";
import { sections, FOUNDATION_IMG } from "@/components/sections";
import { articles } from "@/components/articles";
import Calculator from "@/components/Calculator";
import PageSidebar from "@/components/PageSidebar";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const idx = sections.findIndex((s) => s.id === sectionId);
  const section = sections[idx];
  const prevSection = idx > 0 ? sections[idx - 1] : null;
  const nextSection = idx < sections.length - 1 ? sections[idx + 1] : null;
  const relatedArticles = articles.filter((a) => a.relatedSection === sectionId);

  useEffect(() => {
    if (!section) navigate("/", { replace: true });
    else window.scrollTo({ top: 0 });
  }, [sectionId, section, navigate]);

  if (!section) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title={section.seoTitle || `${section.title} — КаркасДом`}
        description={section.seoDescription || section.subtitle}
        path={`/${section.id}`}
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--earth-deep))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-[hsl(var(--earth-ochre))] rounded-sm flex items-center justify-center text-lg">🏡</div>
              <span className="font-serif text-xl text-[hsl(var(--earth-cream))] font-semibold">КаркасДом</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {sections.map((s) => (
                <Link
                  key={s.id}
                  to={`/${s.id}`}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    s.id === sectionId
                      ? "bg-[hsl(var(--earth-ochre))] text-[hsl(var(--earth-deep))]"
                      : "text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))]"
                  }`}
                >
                  {s.emoji} {s.title}
                </Link>
              ))}
              <Link
                to="/articles"
                className="px-3 py-1.5 rounded text-sm font-medium text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all"
              >
                📚 Статьи
              </Link>
              <Link
                to="/guides"
                className="px-3 py-1.5 rounded text-sm font-medium text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all"
              >
                📖 Гайды
              </Link>
              <SiteSearch />
            </div>

            {/* Mobile: текущий раздел + кнопка назад */}
            <div className="md:hidden flex items-center gap-2">
              <span className="text-[hsl(var(--earth-ochre))] text-sm font-medium">
                {section.emoji} {section.title}
              </span>
              <SiteSearch variant="icon" />
              <Link to="/articles" className="text-[hsl(var(--earth-sand))] p-1">
                <Icon name="BookOpen" size={18} />
              </Link>
              <Link to="/" className="text-[hsl(var(--earth-sand))] p-1">
                <Icon name="Home" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO MINI */}
      <div className="pt-14">
        <div
          className="relative h-48 md:h-64 bg-cover bg-center flex items-end"
          style={{
            backgroundImage: section.id === "foundation" ? `url(${FOUNDATION_IMG})` : undefined,
            backgroundColor: section.id !== "foundation" ? section.color + "33" : undefined,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(25,45%,12%)] via-[hsl(25,45%,12%)]/60 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-6 w-full">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--earth-sand))]/70 mb-2">
              <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
              <span>/</span>
              <span className="text-[hsl(var(--earth-sand))]">{section.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: section.color + "33", border: `2px solid ${section.color}55` }}
              >
                {section.emoji}
              </div>
              <div>
                <div className="text-xs text-[hsl(var(--earth-sand))]/60 tracking-widest uppercase">Этап {idx + 1} из {sections.length}</div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(var(--earth-cream))] leading-none">
                  {section.title}
                </h1>
                <p className="text-[hsl(var(--earth-sand))]/80 text-sm">{section.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Левая часть: статьи + калькулятор */}
          <div className="lg:col-span-2 space-y-5">
            {section.content.map((block, bi) => (
              <div key={bi}>
                {bi === 0 && section.photo && (
                  <div className="rounded-2xl overflow-hidden mb-5 h-56 md:h-72">
                    <img
                      src={section.photo}
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-6 wood-texture">
                  <h2
                    className="font-serif text-xl font-semibold mb-3"
                    style={{ color: section.color }}
                  >
                    {block.heading}
                  </h2>
                  <p className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {block.text}
                  </p>
                </div>
              </div>
            ))}

            <Calculator calc={section.calc} />

            {/* Статьи по теме */}
            {relatedArticles.length > 0 && (
              <div>
                <h2 className="font-serif text-lg font-semibold text-[hsl(var(--earth-dark))] mb-3">
                  Статьи по теме «{section.title}»
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {relatedArticles.map((a) => (
                    <Link
                      key={a.slug}
                      to={`/articles/${a.slug}`}
                      className="group bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-4 hover:border-[hsl(var(--earth-ochre))] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: a.color + "22", border: `2px solid ${a.color}44` }}
                        >
                          {a.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-[hsl(var(--earth-deep))] group-hover:text-[hsl(var(--earth-brown))] transition-colors leading-snug">
                            {a.title}
                          </div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{a.readTime} чтения</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[hsl(var(--earth-brown))] hover:opacity-70 transition-opacity"
                >
                  Все статьи <Icon name="ArrowRight" size={12} />
                </Link>
              </div>
            )}

            {/* Prev / Next навигация */}
            <div className="flex gap-3 pt-2">
              {prevSection ? (
                <Link
                  to={`/${prevSection.id}`}
                  className="flex-1 flex items-center gap-3 bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-xl p-4 hover:border-[hsl(var(--earth-ochre))] transition-all group"
                >
                  <Icon name="ChevronLeft" size={18} className="text-[hsl(var(--earth-ochre))] shrink-0" />
                  <div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Назад</div>
                    <div className="font-semibold text-sm text-[hsl(var(--earth-deep))] group-hover:text-[hsl(var(--earth-brown))]">
                      {prevSection.emoji} {prevSection.title}
                    </div>
                  </div>
                </Link>
              ) : <div className="flex-1" />}

              {nextSection && (
                <Link
                  to={`/${nextSection.id}`}
                  className="flex-1 flex items-center justify-end gap-3 bg-[hsl(var(--earth-ochre))]/10 border border-[hsl(var(--earth-ochre))]/40 rounded-xl p-4 hover:bg-[hsl(var(--earth-ochre))]/20 transition-all group"
                >
                  <div className="text-right">
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Следующий этап</div>
                    <div className="font-semibold text-sm text-[hsl(var(--earth-deep))] group-hover:text-[hsl(var(--earth-brown))]">
                      {nextSection.emoji} {nextSection.title}
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-[hsl(var(--earth-ochre))] shrink-0" />
                </Link>
              )}
            </div>
          </div>

          {/* Правая часть: сайдбар */}
          <div className="lg:col-span-1">
            <PageSidebar sidebar={section.sidebar} />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <div className="text-2xl mb-2">🏡</div>
            <div className="font-serif text-xl text-[hsl(var(--earth-cream))]">КаркасДом</div>
          </Link>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {sections.map((s) => (
              <Link
                key={s.id}
                to={`/${s.id}`}
                className={`text-xs transition-colors ${
                  s.id === sectionId
                    ? "text-[hsl(var(--earth-ochre))]"
                    : "text-[hsl(var(--earth-sand))]/60 hover:text-[hsl(var(--earth-ochre))]"
                }`}
              >
                {s.emoji} {s.title}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/about" className="text-xs text-[hsl(var(--earth-sand))]/40 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              О проекте
            </Link>
            <Link to="/offerta" className="text-xs text-[hsl(var(--earth-sand))]/40 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Публичная оферта
            </Link>
            <Link to="/privacy" className="text-xs text-[hsl(var(--earth-sand))]/40 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}