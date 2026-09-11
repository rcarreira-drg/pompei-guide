/** Cuaderno de notas personales por parada. Autoguardado con debounce y copia al portapapeles. */
import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@/lib/useProgress';

export default function StopNotes({ stopId }: { stopId: string }) {
  const { notes, setNote } = useProgress();
  const saved = notes[stopId] ?? '';
  const [text, setText] = useState(saved);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sincroniza si cambia la parada
  useEffect(() => {
    setText(notes[stopId] ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopId]);

  function handleChange(value: string) {
    setText(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(stopId, value), 400);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="stop-notes box">
      <p className="kicker">CUADERNO</p>
      <textarea
        className="stop-notes-textarea"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Apunta aquí lo que quieras recordar de esta parada…"
        rows={4}
        aria-label="Notas personales de esta parada"
      />
      <div className="stop-notes-footer">
        <span className="mono stop-notes-count">{text.length} CARACTERES</span>
        <button type="button" className="btn btn-sm" onClick={copy}>
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
    </div>
  );
}
