import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/b17c0973-adbe-4345-a35b-d3a6c71a432a.jpg";
const FOUNDATION_IMG = "https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/0c5d1eec-8864-44f7-aadf-d68d86f70894.jpg";

const sections = [
  {
    id: "foundation",
    icon: "Layers",
    emoji: "🪨",
    title: "Фундамент",
    subtitle: "Основа вашего дома",
    color: "#7c5c3a",
    content: [
      {
        heading: "Выбор типа фундамента",
        text: "Для каркасного дома чаще всего выбирают свайно-винтовой, ленточный или плитный фундамент. Свайно-винтовой — самый быстрый и экономичный вариант, подходит для большинства грунтов.",
      },
      {
        heading: "Глубина заложения",
        text: "Глубина зависит от уровня промерзания грунта в вашем регионе. Для Москвы и Подмосковья — не менее 1.5 м. Для южных регионов — от 0.8 м.",
      },
      {
        heading: "Этапы работ",
        text: "1. Геодезическая разметка участка\n2. Земляные работы (копка траншей)\n3. Опалубка и армирование\n4. Заливка бетона (марка М200–М300)\n5. Выдержка 28 суток\n6. Гидроизоляция и засыпка пазух",
      },
    ],
    sidebar: {
      title: "Важно знать",
      items: [
        "Не экономьте на геологии грунта — это убережёт от трещин",
        "Армирование двойной сеткой увеличивает прочность на 40%",
        "Свайный фундамент можно залить за 1–2 дня",
        "Гидроизоляция продлевает срок службы на 20+ лет",
      ],
    },
    calc: {
      title: "Расчёт ленточного фундамента",
      params: [
        { label: "Периметр дома", unit: "м", min: 20, max: 120, default: 40, step: 2, key: "perimeter" },
        { label: "Ширина ленты", unit: "мм", min: 200, max: 500, default: 300, step: 50, key: "width" },
        { label: "Глубина", unit: "м", min: 0.5, max: 2.5, default: 1.5, step: 0.1, key: "depth" },
      ],
      compute: (p: Record<string, number>) => {
        const vol = (p.perimeter * (p.width / 1000) * p.depth);
        const concrete = Math.ceil(vol * 1.05);
        const armorKg = Math.ceil(vol * 90);
        const planks = Math.ceil(p.perimeter * p.depth * 2 * 0.05);
        return [
          { label: "Бетон (м³)", value: concrete },
          { label: "Арматура (кг)", value: armorKg },
          { label: "Доска опалубки (м³)", value: planks },
        ];
      },
    },
  },
  {
    id: "walls",
    icon: "LayoutGrid",
    emoji: "🪵",
    title: "Стены",
    subtitle: "Каркас и обшивка",
    color: "#8B6914",
    content: [
      {
        heading: "Каркас из дерева",
        text: "Основа стен — стойки 150×50 мм с шагом 600 мм (под стандартный утеплитель). Нижняя и верхняя обвязки из доски 150×50 мм или бруса 150×150 мм.",
      },
      {
        heading: "Утепление",
        text: "Минеральная вата 150–200 мм в несколько слоев с перехлёстом стыков. Снаружи — ветрозащитная мембрана, изнутри — пароизоляция.",
      },
      {
        heading: "Обшивка",
        text: "Снаружи: OSB-3 (9–12 мм) + вентзазор + сайдинг / имитация бруса. Внутри: OSB-3 (9 мм) или ГКЛ под отделку.",
      },
    ],
    sidebar: {
      title: "Совет мастера",
      items: [
        "Шаг стоек 600 мм — стандарт для минваты 600×1200 мм",
        "Пароизоляция — только изнутри, иначе конденсат в стене",
        "Перехлёст пароизоляции минимум 15 см",
        "Угловые усиления — диагональные укосины или OSB-плиты",
      ],
    },
    calc: {
      title: "Расчёт материалов стен",
      params: [
        { label: "Периметр дома", unit: "м", min: 20, max: 120, default: 40, step: 2, key: "perimeter" },
        { label: "Высота стен", unit: "м", min: 2.5, max: 4, default: 3, step: 0.1, key: "height" },
        { label: "Толщина утеплителя", unit: "мм", min: 100, max: 250, default: 150, step: 50, key: "insulation" },
      ],
      compute: (p: Record<string, number>) => {
        const area = p.perimeter * p.height;
        const studs = Math.ceil((p.perimeter / 0.6) + (p.perimeter / 10) * 2);
        const osb = Math.ceil(area / 2.88 * 1.1);
        const insul = Math.ceil(area * (p.insulation / 50));
        return [
          { label: "Стойки 150×50 (шт)", value: studs },
          { label: "OSB-3 листов (шт)", value: osb },
          { label: "Утеплитель (пачки)", value: insul },
        ];
      },
    },
  },
  {
    id: "roof",
    icon: "Home",
    emoji: "🏠",
    title: "Крыша",
    subtitle: "Стропила и кровля",
    color: "#6B4226",
    content: [
      {
        heading: "Стропильная система",
        text: "Для каркасного дома чаще всего делают двускатную крышу. Стропила из доски 200×50 мм с шагом 600–1200 мм. Конёк, мауэрлат, ветровые доски.",
      },
      {
        heading: "Кровельный пирог",
        text: "Снизу вверх: пароизоляция → утеплитель 200 мм → контробрешётка → обрешётка → кровельный материал. Вентиляционный зазор обязателен!",
      },
      {
        heading: "Кровельные материалы",
        text: "Металлочерепица — популярный выбор (служит 50+ лет). Мягкая кровля — тихо и эстетично. Профнастил — бюджетный вариант. Для экостиля — деревянная дранка или камыш.",
      },
    ],
    sidebar: {
      title: "Параметры крыши",
      items: [
        "Угол уклона 30–45° — оптимально для снеговой нагрузки",
        "Вынос карниза не менее 500 мм — защита стен от дождя",
        "Вентиляция конька продлевает срок кровли",
        "Снегозадержатели обязательны для металлочерепицы",
      ],
    },
    calc: {
      title: "Расчёт кровельного материала",
      params: [
        { label: "Длина дома", unit: "м", min: 5, max: 20, default: 8, step: 0.5, key: "length" },
        { label: "Ширина дома", unit: "м", min: 5, max: 15, default: 6, step: 0.5, key: "width" },
        { label: "Угол ската", unit: "°", min: 15, max: 60, default: 35, step: 5, key: "angle" },
      ],
      compute: (p: Record<string, number>) => {
        const koef = 1 / Math.cos((p.angle * Math.PI) / 180);
        const roofArea = Math.ceil(p.length * p.width * koef * 2 * 1.1);
        const timber = Math.ceil((p.length / 0.6 * 2 + 4) * 1.05);
        const insul = Math.ceil(p.length * p.width * koef * 0.04 * 2);
        return [
          { label: "Кровля (м²)", value: roofArea },
          { label: "Стропила (шт)", value: timber },
          { label: "Утеплитель (м³)", value: insul },
        ];
      },
    },
  },
  {
    id: "electric",
    icon: "Zap",
    emoji: "⚡",
    title: "Электрификация",
    subtitle: "Проводка и щиты",
    color: "#9C6E1E",
    content: [
      {
        heading: "Ввод в дом",
        text: "Подключение от ближайшего столба СИП-кабелем. Ввод через металлическую трубу. Щиток учёта на улице или в доме — по требованию ТУ от энергосбыта.",
      },
      {
        heading: "Внутренняя разводка",
        text: "Кабель ВВГнг-LS в гофре. Разводка: розеточная группа 2.5 мм², освещение 1.5 мм², электроплита/духовка 6 мм². Укладка в каркасе до обшивки OSB.",
      },
      {
        heading: "Распределительный щит",
        text: "Вводной автомат → счётчик → УЗО → автоматы по группам. Минимум: кухня, санузел, жилые комнаты, уличное освещение — отдельными группами.",
      },
    ],
    sidebar: {
      title: "Нормы и безопасность",
      items: [
        "ПУЭ-7: все розетки в ванной — только через УЗО 10–30 мА",
        "Заземление обязательно — контур из уголка 63×63 мм",
        "Гофра в каркасе — ПВХ внутри, металл в местах нагрева",
        "Подключение к сети — только энергосбыт или лицензиат",
      ],
    },
    calc: {
      title: "Расчёт кабеля и автоматов",
      params: [
        { label: "Площадь дома", unit: "м²", min: 30, max: 300, default: 80, step: 5, key: "area" },
        { label: "Кол-во комнат", unit: "шт", min: 1, max: 10, default: 4, step: 1, key: "rooms" },
        { label: "Санузлов", unit: "шт", min: 1, max: 4, default: 1, step: 1, key: "baths" },
      ],
      compute: (p: Record<string, number>) => {
        const cableM = Math.ceil(p.area * 3.5);
        const automat = Math.ceil(p.rooms * 2 + p.baths * 3 + 4);
        const uzo = Math.ceil(p.baths + 1);
        return [
          { label: "Кабель ВВГ (м)", value: cableM },
          { label: "Автоматов (шт)", value: automat },
          { label: "УЗО (шт)", value: uzo },
        ];
      },
    },
  },
  {
    id: "sewage",
    icon: "Waves",
    emoji: "💧",
    title: "Канализация",
    subtitle: "Септик и трубопровод",
    color: "#4A7C59",
    content: [
      {
        heading: "Внутренняя канализация",
        text: "Трубы ПП или ПВХ. Стояк 110 мм выводится через кровлю (фановая труба). Горизонтальные ветки 50 мм с уклоном 3 см/м. Ревизии через каждые 15 м.",
      },
      {
        heading: "Наружная канализация",
        text: "Труба 110 мм от дома до септика с уклоном 2 см/м. Глубина заложения ниже промерзания или утепление скорлупой. Расстояние до септика от дома — 5–50 м.",
      },
      {
        heading: "Септик или выгребная яма",
        text: "Накопительная ёмкость: просто, но нужно откачивать. Септик + поле фильтрации: не требует обслуживания. Станция биологической очистки: лучшее качество, есть электропотребление.",
      },
    ],
    sidebar: {
      title: "Нормы СНиП",
      items: [
        "Септик — не ближе 5 м от дома, 50 м от скважины",
        "Уклон наружной трубы 2 см на 1 м — обязательно",
        "Фановая труба выше кровли на 50 см минимум",
        "Ревизии на каждом повороте трубы",
      ],
    },
    calc: {
      title: "Расчёт септика",
      params: [
        { label: "Кол-во жильцов", unit: "чел", min: 1, max: 10, default: 4, step: 1, key: "people" },
        { label: "Длина трубы", unit: "м", min: 5, max: 100, default: 20, step: 5, key: "length" },
        { label: "Санузлов", unit: "шт", min: 1, max: 4, default: 1, step: 1, key: "baths" },
      ],
      compute: (p: Record<string, number>) => {
        const vol = Math.ceil(p.people * 0.2 * 3 * 1.25);
        const pipe = Math.ceil(p.length * 1.1);
        const fitting = Math.ceil(p.baths * 3 + 4);
        return [
          { label: "Объём септика (м³)", value: vol },
          { label: "Труба 110 мм (м)", value: pipe },
          { label: "Фитингов (шт)", value: fitting },
        ];
      },
    },
  },
  {
    id: "heating",
    icon: "Flame",
    emoji: "🔥",
    title: "Отопление",
    subtitle: "Котёл и радиаторы",
    color: "#B5451B",
    content: [
      {
        heading: "Выбор котла",
        text: "Газ — самый экономичный при наличии. Электрокотёл — чистый, прост в монтаже. Твёрдотопливный — для автономии. Тепловой насос — инвестиция с окупаемостью 5–7 лет.",
      },
      {
        heading: "Разводка системы",
        text: "Двухтрубная система с принудительной циркуляцией — оптимально для каркасного дома. Трубы металлопластик или полипропилен. Радиаторы биметаллические или алюминиевые.",
      },
      {
        heading: "Тёплый пол",
        text: "Идеально для каркасного дома с открытой планировкой. Электрический тёплый пол — под плитку в санузлах. Водяной — под весь первый этаж, в стяжку 50–70 мм.",
      },
    ],
    sidebar: {
      title: "Нормы теплопотерь",
      items: [
        "Каркасный дом: 30–50 Вт/м² при хорошем утеплении",
        "Запас котла 20–30% от расчётной мощности",
        "Расширительный бак 10% от объёма системы",
        "Предохранительный клапан обязателен в любой системе",
      ],
    },
    calc: {
      title: "Расчёт системы отопления",
      params: [
        { label: "Площадь дома", unit: "м²", min: 30, max: 300, default: 80, step: 5, key: "area" },
        { label: "Высота потолков", unit: "м", min: 2.4, max: 4, default: 2.8, step: 0.1, key: "height" },
        { label: "Кол-во комнат", unit: "шт", min: 1, max: 10, default: 4, step: 1, key: "rooms" },
      ],
      compute: (p: Record<string, number>) => {
        const power = Math.ceil(p.area * 40 / 1000 * 1.25);
        const radiators = Math.ceil(p.rooms * 1.5);
        const pipe = Math.ceil(p.area * 1.8);
        return [
          { label: "Мощность котла (кВт)", value: power },
          { label: "Радиаторов (шт)", value: radiators },
          { label: "Трубы (м)", value: pipe },
        ];
      },
    },
  },
];

function Calculator({ calc }: { calc: typeof sections[0]["calc"] }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(calc.params.map((p) => [p.key, p.default]))
  );
  const results = calc.compute(values);

  return (
    <div className="bg-[hsl(var(--earth-cream))] border border-[hsl(var(--earth-sand))] rounded-xl p-5 wood-texture">
      <h4 className="font-serif text-xl font-semibold text-[hsl(var(--earth-brown))] mb-5">
        🧮 {calc.title}
      </h4>
      <div className="space-y-4 mb-6">
        {calc.params.map((param) => (
          <div key={param.key}>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-[hsl(var(--earth-deep))]">
                {param.label}
              </label>
              <span className="text-sm font-semibold text-[hsl(var(--earth-ochre))]">
                {values[param.key]} {param.unit}
              </span>
            </div>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={values[param.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [param.key]: parseFloat(e.target.value) }))
              }
              className="w-full"
              style={{
                background: `linear-gradient(to right, hsl(38,70%,52%) 0%, hsl(38,70%,52%) ${((values[param.key] - param.min) / (param.max - param.min)) * 100}%, hsl(43,40%,72%) ${((values[param.key] - param.min) / (param.max - param.min)) * 100}%, hsl(43,40%,72%) 100%)`
              }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {results.map((r) => (
          <div key={r.label} className="bg-white/60 rounded-lg p-3 text-center border border-[hsl(var(--earth-sand))]">
            <div className="text-2xl font-bold font-serif text-[hsl(var(--earth-brown))]">{r.value}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-tight">{r.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-3 italic">
        * Расчёт приблизительный, для точного — обратитесь к проектировщику
      </p>
    </div>
  );
}

function SidebarBlock({ sidebar }: { sidebar: typeof sections[0]["sidebar"] }) {
  return (
    <div className="bg-[hsl(var(--earth-brown))] text-[hsl(var(--earth-cream))] rounded-xl p-5 sticky top-20">
      <h4 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[hsl(var(--earth-ochre))] flex items-center justify-center text-xs text-[hsl(var(--earth-deep))]">✓</span>
        {sidebar.title}
      </h4>
      <ul className="space-y-3">
        {sidebar.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm leading-snug">
            <span className="text-[hsl(var(--earth-ochre))] mt-0.5 shrink-0">▸</span>
            <span className="text-[hsl(var(--earth-sand))]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
                onClick={() => scrollTo("foundation")}
                className="bg-[hsl(var(--earth-ochre))] hover:bg-[hsl(38,65%,44%)] text-[hsl(var(--earth-deep))] font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Icon name="Play" size={16} />
                Начать читать
              </button>
              <button
                onClick={() => scrollTo("foundation")}
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
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-2 whitespace-nowrap px-3 py-1 rounded hover:bg-white/10 transition-all group"
              >
                <span className="w-5 h-5 rounded-full bg-[hsl(var(--earth-ochre))]/25 text-[hsl(var(--earth-ochre))] text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <span className="text-[hsl(var(--earth-cream))] text-sm group-hover:text-[hsl(var(--earth-ochre))] transition-colors">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

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
