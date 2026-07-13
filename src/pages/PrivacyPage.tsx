import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Seo from "@/components/Seo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="Политика конфиденциальности — КаркасДом"
        description="Политика конфиденциальности сайта dacha365.site: сбор данных, использование cookie, Яндекс.Метрика, защита персональных данных пользователей."
        path="/privacy"
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <h1 className="font-serif text-4xl font-bold text-[hsl(var(--earth-deep))] mb-2">Политика конфиденциальности</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-10">Последнее обновление: 30 июня 2026 г.</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-[hsl(var(--earth-deep))]">

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">1. Общие положения</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Настоящая Политика конфиденциальности описывает, как сайт <strong>dacha365.site</strong> («Сайт», «мы») собирает, использует и защищает информацию о пользователях при использовании нашего сайта. Используя Сайт, вы соглашаетесь с условиями настоящей Политики.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">2. Какие данные мы собираем</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">Сайт может автоматически собирать следующие данные:</p>
            <ul className="list-disc pl-5 space-y-1 text-[hsl(var(--muted-foreground))]">
              <li>IP-адрес и тип браузера</li>
              <li>Страницы, которые вы посещаете, и время посещения</li>
              <li>Источник перехода на сайт (поисковик, реклама и т.д.)</li>
              <li>Файлы cookie и аналогичные технологии</li>
            </ul>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-3">
              Мы не собираем персональные данные (имя, email, телефон) без вашего явного согласия.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">3. Использование файлов cookie</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Сайт использует файлы cookie для корректной работы и улучшения пользовательского опыта. Cookie — небольшие текстовые файлы, сохраняемые на вашем устройстве. Вы можете отключить cookie в настройках браузера, однако это может повлиять на работу некоторых функций сайта.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">4. Яндекс.Метрика</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Для анализа посещаемости мы используем сервис <strong>Яндекс.Метрика</strong>. Этот сервис собирает обезличенную статистику о посетителях (страницы, время на сайте, источники переходов). Данные передаются на серверы Яндекса и обрабатываются в соответствии с <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--earth-brown))] underline hover:no-underline">политикой конфиденциальности Яндекса</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">5. Рекламная сеть Яндекса (РСЯ)</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              На Сайте размещена реклама от Рекламной сети Яндекса. Яндекс может использовать файлы cookie для показа релевантной рекламы на основе ваших интересов. Подробнее об обработке данных в РСЯ читайте в <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--earth-brown))] underline hover:no-underline">политике конфиденциальности Яндекса</a>. Вы можете отказаться от персонализированной рекламы в настройках браузера или на сайте <a href="https://yandex.ru/tune/ad" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--earth-brown))] underline hover:no-underline">yandex.ru/tune/ad</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">6. Передача данных третьим лицам</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Мы не продаём и не передаём ваши данные третьим лицам, за исключением сервисов аналитики и рекламы, указанных выше, которые действуют в рамках собственных политик конфиденциальности.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">7. Защита данных</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Мы принимаем технические и организационные меры для защиты информации от несанкционированного доступа, изменения или уничтожения.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">8. Права пользователей</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Вы вправе запросить информацию о собранных данных, потребовать их удаления или ограничения обработки. Для этого свяжитесь с нами через форму обратной связи на сайте.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">9. Изменения Политики</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Мы оставляем за собой право изменять настоящую Политику. Актуальная версия всегда доступна на этой странице. Дата последнего обновления указана в начале документа.
            </p>
          </section>

        </div>
      </main>

      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-serif text-xl text-[hsl(var(--earth-cream))] mb-2">КаркасДом</div>
          <div className="flex justify-center gap-4 text-xs text-[hsl(var(--earth-sand))]/60">
            <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
            <Link to="/advertise" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Реклама на сайте</Link>
            <Link to="/offerta" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Публичная оферта</Link>
            <Link to="/privacy" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Политика конфиденциальности</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}