"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  reference: string;
  intervalMs?: number;
  onUpdate?: (data: { status: string | null; txHash?: string | null; receivedAmount?: number | null }) => void;
};

export default function PollingStatus({ reference, intervalMs = 5000, onUpdate }: Props) {
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;
    let timer: any;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/deposit/status?reference=${encodeURIComponent(reference)}`);
        if (!res.ok) return;
        const data = await res.json();
        onUpdate && onUpdate(data);
        if (data.status === "confirmed" || data.status === "failed") {
          stopped.current = true;
          return;
        }
      } catch (e) {
        // ignore
      }
      if (!stopped.current) timer = setTimeout(fetchStatus, intervalMs);
    };

    fetchStatus();

    return () => {
      stopped.current = true;
      if (timer) clearTimeout(timer);
    };
  }, [reference, intervalMs, onUpdate]);

  return null;
}
