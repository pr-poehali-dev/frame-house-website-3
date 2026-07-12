import Icon from "@/components/ui/icon";

interface Style {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  preview: string;
}

interface DesignerHeroProps {
  styles: Style[];
  fileRef: React.RefObject<HTMLInputElement>;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (file: File) => void;
}

export default function DesignerHero({ styles, fileRef, onDrop, onFileChange }: DesignerHeroProps) {
  return (
    <>
      <section className="bg-gradient-to-br from-[hsl(var(--earth-deep))] to-[hsl(var(--earth-brown))] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--earth-ochre))]/20 border border-[hsl(var(--earth-ochre))]/40 rounded-full px-4 py-1.5 mb-5">
            <Icon name="Sparkles" size={14} className="text-[hsl(var(--earth-ochre))]" />
            <span className="text-[hsl(var(--earth-ochre))] text-sm font-medium">ИИ-визуализация за 49 ₽</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[hsl(var(--earth-cream))] mb-4 leading-tight">
            Как будет выглядеть<br/>ваш участок?
          </h2>
          <p className="text-[hsl(var(--earth-sand))]/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Загрузите фото своего участка — ИИ перерисует его в любом стиле: английский сад, японский, прованс, минимализм. Готовый результат через 2 минуты.
          </p>

          {/* Стили-теги */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {styles.filter(s => s.id !== "custom").map(s => (
              <span key={s.id} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-[hsl(var(--earth-cream))] text-sm px-3 py-1.5 rounded-full">
                {s.emoji} {s.label}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-[hsl(var(--earth-cream))] text-sm px-3 py-1.5 rounded-full">
              ✏️ Свой вариант
            </span>
          </div>

          {/* Фичи */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "Clock", title: "2 минуты", desc: "Результат готов быстро" },
              { icon: "Layers", title: "До 3 стилей", desc: "Сравните варианты" },
              { icon: "Download", title: "Скачайте", desc: "Сохраните изображение" },
            ].map(f => (
              <div key={f.title} className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
                <Icon name={f.icon as "Clock"} size={22} className="text-[hsl(var(--earth-ochre))] mx-auto mb-2" />
                <div className="font-bold text-[hsl(var(--earth-cream))] mb-0.5">{f.title}</div>
                <div className="text-xs text-[hsl(var(--earth-sand))]/70">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-[hsl(var(--earth-dark))] text-center mb-6">
          Шаг 1 — загрузите фото участка
        </h2>
        <div
          className="border-2 border-dashed border-[hsl(var(--earth-brown))]/40 rounded-2xl p-12 text-center cursor-pointer hover:border-[hsl(var(--earth-brown))] hover:bg-[hsl(var(--earth-sand))]/10 transition-all bg-white/60 shadow-sm"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <div className="w-16 h-16 bg-[hsl(var(--earth-ochre))]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="ImagePlus" size={32} className="text-[hsl(var(--earth-ochre))]" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-[hsl(var(--earth-dark))] mb-2">
            Перетащите фото сюда
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
            или нажмите для выбора файла
          </p>
          <span className="inline-flex items-center gap-2 bg-[hsl(var(--earth-brown))] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            <Icon name="Upload" size={15} />
            Выбрать фото
          </span>
          <p className="text-xs text-[hsl(var(--muted-foreground))]/60 mt-4">JPG, PNG — до 10 МБ</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { step: "1", text: "Загрузите фото участка" },
            { step: "2", text: "Выберите стиль дизайна" },
            { step: "3", text: "Получите результат" },
          ].map(i => (
            <div key={i.step} className="bg-white/70 border border-[hsl(var(--earth-sand))]/50 rounded-xl p-3 text-center">
              <div className="w-7 h-7 bg-[hsl(var(--earth-ochre))]/20 text-[hsl(var(--earth-ochre))] rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">{i.step}</div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{i.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-[hsl(var(--earth-ochre))]/10 border border-[hsl(var(--earth-ochre))]/25 rounded-xl p-4 text-center">
          <p className="text-sm text-[hsl(var(--earth-dark))]">
            ✨ Выберите <strong>1, 2 или 3 стиля</strong> — ИИ сгенерирует все варианты, вы сравниваете и выбираете лучший. <strong>49 ₽</strong> за каждый стиль.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="font-serif text-lg font-bold text-[hsl(var(--earth-dark))] text-center mb-4">
            Пример результата
          </h3>
          <div className="rounded-2xl overflow-hidden border border-[hsl(var(--earth-sand))]/50 shadow-sm bg-white/60">
            <img
              src="https://cdn.poehali.dev/projects/c2c6592c-528a-42df-8c08-ee1f67195614/files/83ca5248-731c-43de-b72f-983173822a82.jpg"
              alt="Пример результата — до и после дизайна участка в английском стиле"
              className="w-full h-auto block"
            />
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-2">
            Слева — исходное фото участка, справа — результат в стиле «Английский сад»
          </p>
        </div>
      </div>
    </>
  );
}
