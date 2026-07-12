import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { articles } from "@/components/articles";
import Seo from "@/components/Seo";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="Статьи о строительстве каркасного дома своими руками"
        description="Практические статьи о строительстве каркасного дома: расчёт фундамента, утепление, смета, разрешения на строительство, частые ошибки самостройщиков."
        path="/articles"
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--earth-deep))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--earth-ochre))] rounded-sm flex items-center justify-center text-lg">🏡</div>
              <span className="font-serif text-xl text-[hsl(var(--earth-cream))] font-semibold">КаркасДом</span>
            </Link>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all">
              <Icon name="ArrowLeft" size={14} />
              На главную
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[hsl(var(--earth-deep))] pt-28 pb-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-5xl mb-5">📚</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4">
            Статьи о строительстве
          </h1>
          <p className="text-[hsl(var(--earth-sand))]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Практические разборы: расчёты, смета, ошибки и нюансы строительства каркасного дома своими руками
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="group bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-2xl p-6 wood-texture hover:border-[hsl(var(--earth-ochre))] hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: a.color + "22", border: `2px solid ${a.color}44` }}
                >
                  {a.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[hsl(var(--muted-foreground))] tracking-widest uppercase mb-1">{a.readTime} чтения</div>
                  <h2 className="font-serif text-lg font-bold text-[hsl(var(--earth-deep))] group-hover:text-[hsl(var(--earth-brown))] transition-colors leading-snug">
                    {a.title}
                  </h2>
                </div>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{a.excerpt}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium" style={{ color: a.color }}>
                <span>Читать статью</span>
                <Icon name="ArrowRight" size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10 mt-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <div className="text-2xl mb-2">🏡</div>
            <div className="font-serif text-xl text-[hsl(var(--earth-cream))]">КаркасДом</div>
          </Link>
        </div>
      </footer>
    </div>
  );
}
