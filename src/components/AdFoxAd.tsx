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
      adfoxCode?: {
        create: (params: {
          ownerId: number;
          containerId: string;
          params: Record<string, string>;
        }) => void;
      };
    };
  }
}

interface AdFoxAdProps {
  ownerId: number;
  params: Record<string, string>;
  className?: string;
}

export default function AdFoxAd({ ownerId, params, className }: AdFoxAdProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const containerId = `adfox_${rawId}`;
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;

    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya?.adfoxCode?.create({
        ownerId,
        containerId,
        params,
      });
    });
  }, [containerId, ownerId, params]);

  return <div id={containerId} className={className} />;
}
