import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "С чего начать строительство каркасного дома своими руками?",
    answer:
      "Начните с проекта и расчёта фундамента: определите тип грунта, нагрузку дома и выберите подходящий фундамент — свайно-винтовой, ленточный или плитный. Дальше — возведение каркаса стен, кровля, а затем инженерные системы: электрика, канализация, отопление.",
  },
  {
    question: "Сколько стоит построить каркасный дом самостоятельно?",
    answer:
      "Стоимость зависит от площади, материалов и региона. Самостоятельное строительство обычно обходится на 30–40% дешевле найма бригады за счёт экономии на работе. Используйте калькуляторы материалов на каждом этапе, чтобы точнее оценить бюджет под свой проект.",
  },
  {
    question: "Какой фундамент лучше для каркасного дома?",
    answer:
      "Для лёгких каркасных домов чаще всего выбирают свайно-винтовой фундамент — он быстрый и подходит для большинства грунтов. На пучинистых и слабых грунтах лучше подойдёт монолитная плита, а ленточный фундамент — универсальный вариант при наличии цокольного этажа.",
  },
  {
    question: "Сколько по времени занимает строительство каркасного дома?",
    answer:
      "Коробка каркасного дома силами бригады возводится за 1–2 месяца, самостоятельно — обычно за 3–5 месяцев с учётом выходных и погодных условий. Полная отделка и подключение инженерных систем добавляют ещё 1–3 месяца.",
  },
  {
    question: "Нужно ли разрешение на строительство каркасного дома?",
    answer:
      "Для жилого дома на участке ИЖС или в СНТ, как правило, требуется уведомление о начале строительства в местную администрацию согласно Градостроительному кодексу РФ. Уточняйте актуальные требования в вашем муниципалитете перед началом работ.",
  },
  {
    question: "Какие ошибки чаще всего допускают при строительстве каркасного дома?",
    answer:
      "Самые частые ошибки — экономия на гидро- и пароизоляции, неправильный шаг стоек каркаса, отсутствие вентиляционного зазора и заниженное сечение бруса. Все эти моменты подробно разобраны в разделах «Фундамент», «Стены» и «Крыша» на этом сайте.",
  },
];

export default function FaqSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(var(--earth-deep))] mb-2">
        Частые вопросы
      </h2>
      <p className="text-[hsl(var(--muted-foreground))] mb-8">
        Ответы на популярные вопросы о строительстве каркасного дома своими руками
      </p>

      <div className="bg-white/70 border border-[hsl(var(--earth-sand))]/60 rounded-2xl px-6 wood-texture">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-serif text-lg text-[hsl(var(--earth-deep))] hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
