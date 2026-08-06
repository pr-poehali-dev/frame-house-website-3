import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { sections } from "@/components/sections";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";

const STATS = [
  { value: "6", label: "разделов строительства" },
  { value: "30+", label: "тем и инструкций" },
  { value: "6", label: "калькуляторов материалов" },
  { value: "0 ₽", label: "стоимость всех инструкций" },
];

const WHY_ITEMS = [
  {
    icon: "BookOpen",
    title: "Пошаговые инструкции",
    text: "Каждый этап строительства разобран по шагам — от выбора типа фундамента до монтажа котла отопления. Никаких лишних слов, только суть.",
  },
  {
    icon: "Calculator",
    title: "Калькуляторы материалов",
    text: "Встроенные калькуляторы помогут рассчитать нужное количество материалов для каждого этапа — бетон, доски, кровельное покрытие, трубы.",
  },
  {
    icon: "ShieldCheck",
    title: "Проверенные нормы",
    text: "Все рекомендации основаны на актуальных строительных нормах и правилах (СНиП, ГОСТ). Мы следим за обновлениями и актуализируем материал.",
  },
  {
    icon: "Layers",
    title: "Полный цикл",
    text: "Сайт охватывает весь процесс — от закладки фундамента до подключения отопления. Не нужно искать информацию на десятках разных ресурсов.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="О проекте КаркасДом: руководство по строительству каркасных домов"
        description="КаркасДом — бесплатный информационный ресурс по строительству каркасных домов: 6 разделов, 30+ инструкций, 6 калькуляторов материалов, актуальные нормы СНиП и ГОСТ."
        path="/about"
      />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--earth-deep))]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--earth-ochre))] rounded-sm flex items-center justify-center text-lg">🏡</div>
              <span className="font-serif text-xl text-[hsl(var(--earth-cream))] font-semibold">КаркасДом</span>
            </Link>
            <div className="flex items-center gap-2">
              <SiteSearch variant="icon" />
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all">
                <Icon name="ArrowLeft" size={14} />
                На главную
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[hsl(var(--earth-deep))] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-5xl mb-5">🏡</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4">
            О проекте КаркасДом
          </h1>
          <p className="text-[hsl(var(--earth-sand))]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Бесплатный информационный ресурс для тех, кто строит или планирует строить каркасный дом. Пошаговые инструкции, нормы и калькуляторы — всё в одном месте.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[hsl(var(--earth-brown))] py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-3xl font-bold text-[hsl(var(--earth-ochre))]">{s.value}</div>
                <div className="text-xs text-[hsl(var(--earth-sand))]/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* О ПРОЕКТЕ */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[hsl(var(--earth-deep))] mb-5">Что такое КаркасДом?</h2>
          <div className="space-y-4 text-[hsl(var(--muted-foreground))] leading-relaxed text-base">
            <p>
              <strong className="text-[hsl(var(--earth-deep))]">КаркасДом</strong> — это информационный сайт, посвящённый строительству каркасных домов своими руками. Мы собрали всё необходимое: от выбора типа фундамента до монтажа системы отопления.
            </p>
            <p>
              Каркасное строительство становится всё популярнее в России — дома строятся быстро, стоят дешевле кирпичных и при правильном утеплении отлично держат тепло. Однако найти полную, структурированную и актуальную информацию на русском языке бывает непросто. Именно для этого и создан наш ресурс.
            </p>
            <p>
              Все материалы на сайте написаны понятным языком и ориентированы на людей без строительного образования, которые хотят разобраться в процессе и построить дом самостоятельно или грамотно контролировать подрядчиков.
            </p>
          </div>
        </section>

        {/* ПОЧЕМУ МЫ */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[hsl(var(--earth-deep))] mb-8">Почему КаркасДом?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-2xl p-6">
                <div className="w-10 h-10 bg-[hsl(var(--earth-ochre))]/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon} size={20} className="text-[hsl(var(--earth-ochre))]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[hsl(var(--earth-deep))] mb-2">{item.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* РАЗДЕЛЫ */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-[hsl(var(--earth-deep))] mb-3">Разделы сайта</h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-8">Сайт охватывает все основные этапы строительства каркасного дома:</p>
          <div className="space-y-3">
            {sections.map((s, i) => (
              <Link
                key={s.id}
                to={`/${s.id}`}
                className="group flex items-center gap-4 bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-5 py-4 hover:border-[hsl(var(--earth-ochre))] transition-all hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--earth-ochre))]/15 flex items-center justify-center text-sm font-bold text-[hsl(var(--earth-ochre))] shrink-0">
                  {i + 1}
                </div>
                <div className="text-xl shrink-0">{s.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[hsl(var(--earth-deep))] group-hover:text-[hsl(var(--earth-brown))] transition-colors">{s.title}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">{s.subtitle}</div>
                </div>
                <Icon name="ArrowRight" size={16} className="text-[hsl(var(--earth-ochre))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ */}
        <section className="bg-[hsl(var(--earth-sand))]/20 border border-[hsl(var(--earth-sand))]/40 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-[hsl(var(--earth-deep))] mb-3">Важное замечание</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            Все материалы на сайте носят исключительно информационный характер. Расчёты в калькуляторах являются ориентировочными и не заменяют профессиональную проектную документацию. Перед началом строительства рекомендуем проконсультироваться с лицензированными специалистами и получить официальный проект дома.
          </p>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10 mt-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-serif text-xl text-[hsl(var(--earth-cream))] mb-4">КаркасДом</div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[hsl(var(--earth-sand))]/60">
            <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
            <Link to="/about" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">О проекте</Link>
            <Link to="/contacts" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Контакты</Link>
            <Link to="/advertise" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Реклама на сайте</Link>
            <Link to="/offerta" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Публичная оферта</Link>
            <Link to="/privacy" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Политика конфиденциальности</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}