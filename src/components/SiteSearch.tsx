import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { sections } from "@/components/sections";
import { articles } from "@/components/articles";

interface SiteSearchProps {
  variant?: "full" | "icon";
  className?: string;
}

export default function SiteSearch({ variant = "full", className }: SiteSearchProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = useCallback(
    (path: string) => {
      setOpen(false);
      navigate(path);
    },
    [navigate]
  );

  return (
    <>
      {variant === "full" ? (
        <button
          onClick={() => setOpen(true)}
          className={className ?? "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-[hsl(var(--earth-sand))] hover:text-[hsl(var(--earth-cream))] transition-all"}
        >
          <Icon name="Search" size={15} />
          <span className="hidden lg:inline">Поиск</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={className ?? "text-[hsl(var(--earth-sand))] p-1"}
          aria-label="Поиск по сайту"
        >
          <Icon name="Search" size={18} />
        </button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Поиск по темам и статьям..." />
        <CommandList>
          <CommandEmpty>Ничего не найдено</CommandEmpty>
          <CommandGroup heading="Разделы">
            {sections.map((s) => (
              <CommandItem
                key={s.id}
                value={`${s.title} ${s.subtitle}`}
                onSelect={() => go(`/${s.id}`)}
              >
                <span className="mr-2">{s.emoji}</span>
                <div className="flex flex-col">
                  <span>{s.title}</span>
                  <span className="text-xs text-muted-foreground">{s.subtitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Статьи">
            {articles.map((a) => (
              <CommandItem
                key={a.slug}
                value={`${a.title} ${a.excerpt}`}
                onSelect={() => go(`/articles/${a.slug}`)}
              >
                <span className="mr-2">{a.emoji}</span>
                <span>{a.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}