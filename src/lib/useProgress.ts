/** Envuelve loadProgress/saveProgress en estado React reactivo. */
import { useCallback, useState } from 'react';
import { loadProgress, saveProgress, resetProgress, type Progress } from './storage';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleVisited = useCallback(
    (stopId: string) => {
      update((p) => {
        const visited = { ...p.visited };
        if (visited[stopId]) delete visited[stopId];
        else visited[stopId] = new Date().toISOString();
        return { ...p, visited };
      });
    },
    [update]
  );

  const markVisited = useCallback(
    (stopId: string) => {
      update((p) => ({ ...p, visited: { ...p.visited, [stopId]: new Date().toISOString() } }));
    },
    [update]
  );

  const markRead = useCallback(
    (sectionId: string) => {
      update((p) => ({ ...p, read: { ...p.read, [sectionId]: true } }));
    },
    [update]
  );

  const isRead = useCallback((sectionId: string) => Boolean(progress.read[sectionId]), [progress.read]);

  const toggleChecklist = useCallback(
    (itemId: string) => {
      update((p) => ({ ...p, checklist: { ...p.checklist, [itemId]: !p.checklist[itemId] } }));
    },
    [update]
  );

  const setCurrentStop = useCallback(
    (stopId: string | undefined) => {
      update((p) => ({ ...p, currentStop: stopId }));
    },
    [update]
  );

  const reset = useCallback(() => {
    resetProgress();
    setProgress(loadProgress());
  }, []);

  return {
    progress,
    visited: progress.visited,
    checklist: progress.checklist,
    currentStop: progress.currentStop,
    toggleVisited,
    markVisited,
    markRead,
    isRead,
    toggleChecklist,
    setCurrentStop,
    reset,
  };
}
