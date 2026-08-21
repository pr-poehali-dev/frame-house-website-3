import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    yaContextCb?: Array<() => void>;
    Ya?: {
      Context: {
        AdvManager: {
          render: (params: { blockId: string; renderTo: string; type?: string }) => void;
        };
      };
    };
  }
}

interface YandexAdProps {
  blockId: string;
  type?: string;
  className?: string;
}

export default function YandexAd({ blockId, type, className }: YandexAdProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const containerId = `yandex_rtb_${blockId}-${rawId}`;
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;

    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya?.Context.AdvManager.render({
        blockId,
        renderTo: containerId,
        ...(type ? { type } : {}),
      });
    });
  }, [containerId, blockId, type]);

  return <div id={containerId} className={className ?? "col-span-full sm:col-span-1"} />;
}
