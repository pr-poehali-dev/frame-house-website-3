import { useState } from "react";
import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";

interface ShareButtonsProps {
  url: string;
  title: string;
  source: string;
}

const NETWORKS = [
  {
    id: "vk",
    label: "ВКонтакте",
    color: "#0077FF",
    getUrl: (url: string, title: string) =>
      `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M13.16 18.28c-6.34 0-10.24-4.42-10.4-11.76h3.28c.11 5.35 2.5 7.62 4.35 8.09V6.52h3.1v4.65c1.82-.2 3.74-2.31 4.39-4.65h3.09c-.5 2.87-2.6 4.98-4.09 5.85 1.5.71 3.89 2.54 4.79 5.91h-3.4c-.7-2.24-2.44-3.98-4.78-4.21v4.21h-.33z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "#26A5E4",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M21.9 4.4c.25-1.1-.86-2-1.9-1.6L2.4 10.1c-1.15.44-1.14 2.06.02 2.48l4.5 1.63 1.72 5.5c.3.97 1.55 1.2 2.18.42l2.5-3.08 4.55 3.34c.9.66 2.2.17 2.42-.93l3.6-15zM8.4 13.3l9.5-6.1c.32-.2.65.2.37.46l-7.8 7.14a1.6 1.6 0 0 0-.5.98l-.3 2.7-1.27-5.18z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.94-.27-.1-.46-.15-.66.15-.2.3-.75.94-.92 1.13-.17.2-.34.22-.63.08-.3-.15-1.24-.46-2.37-1.47-.87-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.14.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5-.17 0-.37-.02-.56-.02-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.5.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.4.25-.7.25-1.3.17-1.4-.07-.12-.27-.19-.56-.34z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.53 3.68 1.44 5.2L2 22l4.94-1.4A9.95 9.95 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.46-4.66-1.28l-.33-.2-3.1.87.83-3-.22-.35A7.94 7.94 0 0 1 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
      </svg>
    ),
  },
  {
    id: "ok",
    label: "Одноклассники",
    color: "#EE8208",
    getUrl: (url: string, title: string) =>
      `https://connect.ok.ru/offer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <circle cx="12" cy="6.2" r="3.2" />
        <path d="M16.3 12.4a6.9 6.9 0 0 1-2.9 1.6l2.9 2.9a1.15 1.15 0 0 1-1.63 1.63l-2.67-2.68-2.67 2.68A1.15 1.15 0 0 1 7.7 16.9l2.9-2.9a6.9 6.9 0 0 1-2.9-1.6 1.15 1.15 0 0 1 1.55-1.7 4.6 4.6 0 0 0 6.5 0 1.15 1.15 0 0 1 1.55 1.7z" />
      </svg>
    ),
  },
];

export default function ShareButtons({ url, title, source }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (networkId: string, shareUrl: string) => {
    reachGoal("article_share_click", { network: networkId, source });
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      reachGoal("article_share_click", { network: "copy_link", source });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard недоступен — молча игнорируем
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[hsl(var(--muted-foreground))] mr-1 flex items-center gap-1.5">
        <Icon name="Share2" size={14} />
        Поделиться:
      </span>
      {NETWORKS.map((n) => (
        <button
          key={n.id}
          onClick={() => handleShare(n.id, n.getUrl(url, title))}
          aria-label={`Поделиться в ${n.label}`}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:opacity-85 hover:scale-105 transition-all"
          style={{ backgroundColor: n.color }}
        >
          {n.svg}
        </button>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Скопировать ссылку"
        className="w-8 h-8 rounded-full flex items-center justify-center bg-[hsl(var(--earth-sand))]/60 text-[hsl(var(--earth-deep))] hover:bg-[hsl(var(--earth-sand))] transition-all"
      >
        <Icon name={copied ? "Check" : "Link2"} size={15} />
      </button>
    </div>
  );
}
