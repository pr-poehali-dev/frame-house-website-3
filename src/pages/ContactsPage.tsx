import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";

const CONTACT_EMAIL = "yunaliev.ismail@yandex.ru";

const CONTACT_CARDS = [
  {
    icon: "Mail",
    title: "Email",
    text: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: "Clock",
    title: "Время ответа",
    text: "Отвечаем в течение 3 рабочих дней",
  },
  {
    icon: "Megaphone",
    title: "Реклама на сайте",
    text: "Отдельная форма для рекламодателей",
    href: "/advertise",
    internal: true,
  },
];

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="Контакты — КаркасДом"
        description="Контактная информация сайта dacha365.site: email для связи, реквизиты владельца, вопросы по конструктору дизайна участка и PDF-гайдам."
        path="/contacts"
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
          <div className="text-5xl mb-5">✉️</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4">
            Контакты
          </h1>
          <p className="text-[hsl(var(--earth-sand))]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Есть вопрос по конструктору дизайна участка, PDF-гайдам или предложение о сотрудничестве — напишите нам
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Карточки контактов */}
        <section>
          <div className="grid sm:grid-cols-3 gap-5">
            {CONTACT_CARDS.map((c) => {
              const Card = (
                <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-2xl p-6 h-full hover:border-[hsl(var(--earth-ochre))] transition-all">
                  <div className="w-10 h-10 bg-[hsl(var(--earth-ochre))]/15 rounded-xl flex items-center justify-center mb-4">
                    <Icon name={c.icon} size={20} className="text-[hsl(var(--earth-ochre))]" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[hsl(var(--earth-deep))] mb-2">{c.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed break-words">{c.text}</p>
                </div>
              );
              if (c.href && c.internal) {
                return <Link key={c.title} to={c.href}>{Card}</Link>;
              }
              if (c.href) {
                return <a key={c.title} href={c.href}>{Card}</a>;
              }
              return <div key={c.title}>{Card}</div>;
            })}
          </div>
        </section>

        {/* Реквизиты */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-deep))] mb-5">Реквизиты</h2>
          <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-2xl p-6 max-w-xl">
            <ul className="list-none pl-0 space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <li><strong className="text-[hsl(var(--earth-deep))]">ФИО:</strong> Юналиев Исмаил Амирович</li>
              <li><strong className="text-[hsl(var(--earth-deep))]">Статус:</strong> плательщик налога на профессиональный доход (самозанятый)</li>
              <li><strong className="text-[hsl(var(--earth-deep))]">ИНН:</strong> 342900286046</li>
              <li>
                <strong className="text-[hsl(var(--earth-deep))]">Email:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[hsl(var(--earth-brown))] underline hover:no-underline">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li><strong className="text-[hsl(var(--earth-deep))]">Сайт:</strong> dacha365.site</li>
            </ul>
          </div>
        </section>

        {/* Ссылки на документы */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-deep))] mb-5">Документы</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/offerta"
              className="inline-flex items-center gap-2 bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-4 py-2.5 text-sm text-[hsl(var(--earth-deep))] hover:border-[hsl(var(--earth-ochre))] transition-all"
            >
              <Icon name="FileText" size={16} className="text-[hsl(var(--earth-ochre))]" />
              Публичная оферта
            </Link>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-4 py-2.5 text-sm text-[hsl(var(--earth-deep))] hover:border-[hsl(var(--earth-ochre))] transition-all"
            >
              <Icon name="ShieldCheck" size={16} className="text-[hsl(var(--earth-ochre))]" />
              Политика конфиденциальности
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl px-4 py-2.5 text-sm text-[hsl(var(--earth-deep))] hover:border-[hsl(var(--earth-ochre))] transition-all"
            >
              <Icon name="Info" size={16} className="text-[hsl(var(--earth-ochre))]" />
              О проекте
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-10 mt-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <div className="text-2xl mb-2">🏡</div>
            <div className="font-serif text-xl text-[hsl(var(--earth-cream))]">КаркасДом</div>
          </Link>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-[hsl(var(--earth-sand))]/60">
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
