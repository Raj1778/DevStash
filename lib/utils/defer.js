export function defer(task, { timeout = 1500 } = {}) {
  if (typeof window === 'undefined') {
    // On server, just run immediately
    task();
    return;
  }

  const run = () => {
    try { task(); } catch (_) {}
  };

  // Prefer requestIdleCallback when available
  const ric = window.requestIdleCallback || function (cb) { return setTimeout(() => cb({ timeRemaining: () => 0 }), timeout); };
  ric(run, { timeout });
}

export function raf(task) {
  if (typeof window === 'undefined') { task(); return; }
  const r = window.requestAnimationFrame || setTimeout;
  r(task);
}

