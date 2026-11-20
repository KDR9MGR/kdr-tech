"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Looping background music for the public site, played from a YouTube embed.
 *
 * - The embed is visually hidden, so only the audio is heard.
 * - It is driven with plain postMessage commands (enablejsapi=1) instead of
 *   YouTube's iframe_api script, so the site's script-src CSP stays untouched.
 * - Browsers block autoplay with sound until the visitor interacts, so the
 *   track is requested on load and then started by the first click / key /
 *   tap if the browser refused.
 * - The floating button pauses/resumes it; the choice is remembered, and a
 *   visitor who switched it off never gets the YouTube embed loaded again.
 */

const VIDEO_ID = "0u31qTtS-q8";
const YT_ORIGIN = "https://www.youtube.com";
const VOLUME = 35; // 0-100: background level, not foreground
const LOAD_DELAY_MS = 1500; // keep the heavy embed off the critical path
const STORAGE_KEY = "kdr-music";

const GESTURE_EVENTS = ["click", "keydown", "touchend", "pointerup"] as const;

const BackgroundMusic = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const heardPlayer = useRef(false);
  const handshakeTimer = useRef<number | undefined>(undefined);
  const offRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [off, setOff] = useState(false); // visitor chose silence
  const [loadPlayer, setLoadPlayer] = useState(false);
  const [playing, setPlaying] = useState(false);

  const post = useCallback((payload: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(payload), YT_ORIGIN);
  }, []);
  const command = useCallback(
    (func: string, args: unknown[] = []) => post({ event: "command", func, args }),
    [post]
  );

  useEffect(() => {
    offRef.current = off;
  }, [off]);

  // Read the saved preference, then load the player a moment after page load.
  useEffect(() => {
    let isOff = false;
    try {
      isOff = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {}
    setOff(isOff);
    setMounted(true);
    if (isOff) return;
    const t = window.setTimeout(() => setLoadPlayer(true), LOAD_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Listen to the player's state so the button reflects what is really playing.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== iframeRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data || typeof data !== "object") return;

      if (!heardPlayer.current) {
        heardPlayer.current = true;
        command("setVolume", [VOLUME]);
      }
      if (data.event === "onReady") command("setVolume", [VOLUME]);

      let state: unknown;
      if (data.event === "onStateChange") state = data.info;
      else if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
        state = (data.info as { playerState?: unknown }).playerState;
      }
      if (typeof state === "number") {
        setPlaying(state === 1);
        if (state === 0 && !offRef.current) command("playVideo"); // loop fallback
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [command]);

  // Ask the player to start talking to us (it ignores us until it has loaded).
  const handleLoad = useCallback(() => {
    heardPlayer.current = false;
    window.clearInterval(handshakeTimer.current);
    let tries = 0;
    const hello = () => {
      if (heardPlayer.current || ++tries > 20) {
        window.clearInterval(handshakeTimer.current);
        return;
      }
      post({ event: "listening", id: 1, channel: "widget" });
    };
    hello();
    handshakeTimer.current = window.setInterval(hello, 500);
  }, [post]);

  useEffect(() => () => window.clearInterval(handshakeTimer.current), []);

  // Autoplay with sound is usually refused until the visitor interacts:
  // start on the first real gesture, then stop listening.
  useEffect(() => {
    if (!loadPlayer || off || playing) return;
    const start = () => command("playVideo");
    GESTURE_EVENTS.forEach((ev) => window.addEventListener(ev, start, { capture: true, passive: true }));
    return () => {
      GESTURE_EVENTS.forEach((ev) => window.removeEventListener(ev, start, { capture: true }));
    };
  }, [loadPlayer, off, playing, command]);

  // Don't keep playing in a background tab.
  useEffect(() => {
    let resumeOnShow = false;
    const onVisibility = () => {
      if (document.hidden) {
        resumeOnShow = playing;
        if (playing) command("pauseVideo");
      } else if (resumeOnShow && !offRef.current) {
        resumeOnShow = false;
        command("playVideo");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing, command]);

  const toggle = () => {
    const turnOff = playing;
    setOff(turnOff);
    offRef.current = turnOff;
    try {
      localStorage.setItem(STORAGE_KEY, turnOff ? "off" : "on");
    } catch {}
    if (turnOff) {
      command("pauseVideo");
    } else if (loadPlayer) {
      command("playVideo");
    } else {
      setLoadPlayer(true); // first play after opting out: the embed autoplays on mount
    }
  };

  if (!mounted) return null;

  const waiting = loadPlayer && !off && !playing; // loaded, but the browser wants a gesture
  const label = playing ? "Pause music" : "Play music";

  return (
    <>
      {loadPlayer && (
        <iframe
          ref={iframeRef}
          title="Background music"
          src={`${YT_ORIGIN}/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&fs=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(
            window.location.origin
          )}`}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={handleLoad}
          className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[113px] w-[200px] opacity-0"
        />
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-pressed={playing}
        className="group fixed bottom-6 left-6 z-[100]"
      >
        <span
          className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-[#1A0C3D]/90 backdrop-blur transition-all duration-200 hover:scale-110 ${
            playing ? "border-[#F0328A]/70 neon-pink" : "border-[#43226F] hover:border-[#F0328A]/60"
          }`}
        >
          {waiting && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-[#F0328A]/70 motion-safe:animate-ping"
            />
          )}
          {playing ? (
            <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
              {[0, 0.3, 0.15, 0.45].map((delay) => (
                <span
                  key={delay}
                  className="vice-eq-bar h-full w-[3px] rounded-full bg-gradient-to-t from-[#F0328A] to-[#FFC857]"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </span>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-[#C0B3DA] group-hover:text-[#FFF1E8]"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <path d="m22 9-6 6M16 9l6 6" />
            </svg>
          )}
        </span>
        {/* absolute: the label must not widen the button's clickable area */}
        <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#1A0C3D] px-3 py-2 text-sm font-medium text-[#FFF1E8] opacity-0 shadow-lg ring-1 ring-[#43226F] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {label}
        </span>
      </button>
    </>
  );
};

export default BackgroundMusic;
