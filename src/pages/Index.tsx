import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { sections, HERO_IMG } from "@/components/sections";
import Seo from "@/components/Seo";
import FaqSection from "@/components/FaqSection";
import SiteSearch from "@/components/SiteSearch";

export default function Index() {
  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="КаркасДом — строительство от фундамента до ключа"
        description="Полное руководство по строительству каркасного дома: фундамент, стены, крыша, электрика, канализация, отопление. Калькуляторы материалов и ИИ-конструктор дизайна участка."
        path="/"
      />

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
                <Link
                  key={s.id}
                  to={`/${s.id}`}
                  className="px-3 py-1.5 rounded text-sm font-medium text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all"
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
              <Link
                to="/designer"
                className="ml-3 inline-flex items-center gap-1.5 bg-[hsl(var(--earth-ochre))] hover:bg-[hsl(38,65%,44%)] text-[hsl(var(--earth-deep))] font-semibold px-4 py-1.5 rounded-lg text-sm transition-all hover:scale-105"
              >
                <Icon name="Sparkles" size={14} />
                Дизайн участка
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
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
            <Link
              to={`/${sections[0].id}`}
              className="inline-flex items-center gap-2 bg-[hsl(var(--earth-ochre))] hover:bg-[hsl(38,65%,44%)] text-[hsl(var(--earth-deep))] font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              <Icon name="Play" size={16} />
              Начать с фундамента
            </Link>
          </div>
        </div>

        {/* Полоска этапов */}
        <div className="absolute bottom-0 left-0 right-0 bg-[hsl(var(--earth-brown))]/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-1 overflow-x-auto">
            {sections.map((s, i) => (
              <Link
                key={s.id}
                to={`/${s.id}`}
                className="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded hover:bg-white/10 transition-all group"
              >
                <span className="w-5 h-5 rounded-full bg-[hsl(var(--earth-ochre))]/25 text-[hsl(var(--earth-ochre))] text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <span className="text-[hsl(var(--earth-cream))] text-sm group-hover:text-[hsl(var(--earth-ochre))] transition-colors">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* КАРТОЧКИ РАЗДЕЛОВ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(var(--earth-deep))] mb-2">Этапы строительства</h2>
        <p className="text-[hsl(var(--muted-foreground))] mb-10">Выберите раздел — откроется отдельная страница с инструкцией и калькулятором</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s, i) => (
            <Link
              key={s.id}
              to={`/${s.id}`}
              className="group bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-2xl p-6 wood-texture hover:border-[hsl(var(--earth-ochre))] hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: s.color + "22", border: `2px solid ${s.color}44` }}
                >
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[hsl(var(--muted-foreground))] tracking-widest uppercase mb-1">Этап {i + 1}</div>
                  <h3 className="font-serif text-xl font-bold text-[hsl(var(--earth-deep))] group-hover:text-[hsl(var(--earth-brown))] transition-colors">{s.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{s.subtitle}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium" style={{ color: s.color }}>
                <span>{s.content.length} темы</span>
                <span>·</span>
                <span>калькулятор</span>
                <Icon name="ArrowRight" size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* БАННЕР КОНСТРУКТОРА */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          to="/designer"
          className="group flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-[hsl(var(--earth-deep))] to-[hsl(var(--earth-brown))] rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <div className="text-6xl shrink-0">🌿</div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--earth-ochre))]/20 border border-[hsl(var(--earth-ochre))]/40 rounded-full px-3 py-1 mb-2 text-xs text-[hsl(var(--earth-ochre))] font-medium">
              Новинка
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[hsl(var(--earth-cream))] mb-2">
              Конструктор дизайна участка
            </h2>
            <p className="text-[hsl(var(--earth-sand))]/80 text-sm md:text-base">
              Загрузите фото своего участка — ИИ нарисует дизайн в любом стиле: английский сад, прованс, японский, минимализм. Готовый результат за 49 ₽.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[hsl(var(--earth-ochre))] text-[hsl(var(--earth-deep))] font-semibold px-6 py-3 rounded-xl group-hover:scale-105 transition-all shrink-0">
            <Icon name="Sparkles" size={16} />
            Попробовать
          </div>
        </Link>
      </section>

      {/* БАННЕР PDF-ГАЙДОВ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          to="/guides"
          className="group flex flex-col md:flex-row items-center gap-6 bg-white/70 border border-[hsl(var(--earth-sand))]/60 wood-texture rounded-2xl p-8 hover:border-[hsl(var(--earth-ochre))] hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          <div className="text-6xl shrink-0">📖</div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--earth-brown))]/10 border border-[hsl(var(--earth-brown))]/30 rounded-full px-3 py-1 mb-2 text-xs text-[hsl(var(--earth-brown))] font-medium">
              Скачать PDF
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[hsl(var(--earth-deep))] mb-2">
              PDF-гайды по каждому этапу стройки
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] text-sm md:text-base">
              Подробные инструкции по фундаменту, стенам, крыше, электрике, канализации и отоплению — держите на телефоне прямо на стройке. От 149 ₽.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[hsl(var(--earth-brown))] text-white font-semibold px-6 py-3 rounded-xl group-hover:scale-105 transition-all shrink-0">
            <Icon name="Download" size={16} />
            Смотреть гайды
          </div>
        </Link>
      </section>

      <FaqSection />

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-3xl mb-3">🏡</div>
          <div className="font-serif text-2xl text-[hsl(var(--earth-cream))] mb-2">КаркасДом</div>
          <p className="text-sm text-[hsl(var(--earth-sand))]/70 max-w-md mx-auto leading-relaxed">
            Информационный ресурс по строительству каркасных домов.<br/>Все расчёты носят ориентировочный характер.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/about" className="text-xs text-[hsl(var(--earth-sand))]/50 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              О проекте
            </Link>
            <Link to="/articles" className="text-xs text-[hsl(var(--earth-sand))]/50 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Статьи
            </Link>
            <Link to="/guides" className="text-xs text-[hsl(var(--earth-sand))]/50 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Гайды
            </Link>
            <Link to="/advertise" className="text-xs text-[hsl(var(--earth-sand))]/50 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Реклама на сайте
            </Link>
            <Link to="/offerta" className="text-xs text-[hsl(var(--earth-sand))]/50 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Публичная оферта
            </Link>
            <Link to="/privacy" className="text-xs text-[hsl(var(--earth-sand))]/50 hover:text-[hsl(var(--earth-ochre))] transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {sections.map((s) => (
              <Link
                key={s.id}
                to={`/${s.id}`}
                className="text-xs text-[hsl(var(--earth-sand))]/60 hover:text-[hsl(var(--earth-ochre))] transition-colors"
              >
                {s.emoji} {s.title}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}