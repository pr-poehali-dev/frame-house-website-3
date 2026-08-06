import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Seo from "@/components/Seo";
import SiteSearch from "@/components/SiteSearch";

export default function OffertaPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--earth-light))]">
      <Seo
        title="Публичная оферта — КаркасДом"
        description="Публичная оферта сайта dacha365.site: условия заказа, оплаты и оказания услуги «Конструктор дизайна участка», порядок возврата средств, контакты и реквизиты."
        path="/offerta"
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <h1 className="font-serif text-4xl font-bold text-[hsl(var(--earth-deep))] mb-2">Публичная оферта</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-10">Последнее обновление: 13 июля 2026 г.</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-[hsl(var(--earth-deep))]">

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">1. Общие положения</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Настоящий документ является публичной офертой самозанятого <strong>Юналиева Исмаила Амировича</strong> (далее — «Исполнитель») и содержит все существенные условия оказания услуги «Конструктор дизайна участка» на сайте <strong>dacha365.site</strong> (далее — «Сайт»). Оплата услуги на Сайте означает полное и безоговорочное принятие условий настоящей оферты (акцепт).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">2. Контакты</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              По всем вопросам, связанным с заказом, оплатой или возвратом средств, обращайтесь по электронной почте:{" "}
              <a href="mailto:yunaliev.ismail@yandex.ru" className="text-[hsl(var(--earth-brown))] underline hover:no-underline">
                yunaliev.ismail@yandex.ru
              </a>
              . Ответ на обращение направляется в течение 3 рабочих дней.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">3. Услуга и порядок заказа</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">
              Исполнитель оказывает услугу «Конструктор дизайна участка» — автоматическую генерацию изображения участка в выбранном пользователем стиле дизайна с помощью искусственного интеллекта на основе загруженной пользователем фотографии.
            </p>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">Порядок оформления заказа:</p>
            <ul className="list-disc pl-5 space-y-1 text-[hsl(var(--muted-foreground))]">
              <li>пользователь загружает фотографию своего участка на странице «Конструктор дизайна»;</li>
              <li>выбирает один или несколько стилей дизайна (стоимость указывается за каждый стиль отдельно);</li>
              <li>заполняет контактные данные (имя, email, телефон) и производит оплату;</li>
              <li>после оплаты услуга оказывается автоматически — результат генерируется и становится доступен пользователю.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">4. Оплата</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Стоимость услуги составляет <strong>62 ₽</strong> за один вариант дизайна. При выборе нескольких стилей стоимость суммируется. Оплата производится на 100% предоплатной основе через платёжный сервис <strong>Робокасса</strong> банковской картой или иным доступным на странице оплаты способом. Услуга считается оплаченной с момента поступления денежных средств Исполнителю.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">5. Оказание услуги</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Услуга оказывается в электронном виде и не предполагает физической доставки. Генерация результата запускается автоматически сразу после подтверждения оплаты и занимает, как правило, до 2 минут на один выбранный стиль. Готовое изображение отображается на странице результата и доступно для скачивания пользователем самостоятельно.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">6. Возврат и отказ от услуги</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">
              Поскольку оказание услуги начинается автоматически сразу после оплаты, отказаться от услуги и получить возврат денежных средств можно <strong>до момента запуска генерации результата</strong>, то есть в течение времени между оплатой и фактическим стартом обработки запроса.
            </p>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">
              Если генерация результата не была завершена по технической причине (сбой на стороне Исполнителя, ошибка сервиса) и пользователь не получил готовое изображение, денежные средства возвращаются в полном объёме.
            </p>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">Порядок возврата:</p>
            <ul className="list-disc pl-5 space-y-1 text-[hsl(var(--muted-foreground))]">
              <li>направьте обращение на email <a href="mailto:yunaliev.ismail@yandex.ru" className="text-[hsl(var(--earth-brown))] underline hover:no-underline">yunaliev.ismail@yandex.ru</a> с указанием даты оплаты, суммы и причины возврата;</li>
              <li>обращение рассматривается Исполнителем в течение 3 рабочих дней с момента поступления;</li>
              <li>при подтверждении оснований для возврата денежные средства перечисляются в полном объёме на карту, с которой была произведена оплата, в течение 10 рабочих дней с даты принятия решения.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-3">7. Реквизиты Исполнителя</h2>
            <ul className="list-none pl-0 space-y-1 text-[hsl(var(--muted-foreground))]">
              <li><strong>ФИО:</strong> Юналиев Исмаил Амирович</li>
              <li><strong>Статус:</strong> плательщик налога на профессиональный доход (самозанятый)</li>
              <li><strong>ИНН:</strong> 342900286046</li>
              <li><strong>Email:</strong> yunaliev.ismail@yandex.ru</li>
            </ul>
          </section>

        </div>
      </main>

      <footer className="bg-[hsl(var(--earth-deep))] text-[hsl(var(--earth-sand))] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="font-serif text-xl text-[hsl(var(--earth-cream))] mb-2">КаркасДом</div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[hsl(var(--earth-sand))]/60">
            <Link to="/" className="hover:text-[hsl(var(--earth-ochre))] transition-colors">Главная</Link>
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