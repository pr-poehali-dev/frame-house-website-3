import type { Section } from "@/components/sections";

interface SidebarBlockProps {
  sidebar: Section["sidebar"];
}

export default function SidebarBlock({ sidebar }: SidebarBlockProps) {
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
