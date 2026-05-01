import { useState, useRef } from 'react';
import { parseInput } from '../parse';
import { CATEGORY_MAP } from '../categories';

interface Props {
  onAdd: (description: string, amount: number, categoryId: string) => void;
}

export default function QuickAdd({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [preview, setPreview] = useState<ReturnType<typeof parseInput>>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(v: string) {
    setValue(v);
    setPreview(parseInput(v));
  }

  function handleSubmit() {
    if (!preview) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      inputRef.current?.focus();
      return;
    }
    onAdd(preview.description, preview.amount, preview.category);
    setValue('');
    setPreview(null);
    inputRef.current?.focus();
  }

  const cat = preview ? CATEGORY_MAP[preview.category] : null;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className={`relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 transition-all focus-within:border-violet-500/60 focus-within:bg-white/8 ${shake ? 'animate-shake' : ''}`}>
        {/* Превью категории */}
        <div className="text-2xl w-9 text-center flex-shrink-0 transition-all duration-200">
          {cat ? cat.icon : '✏️'}
        </div>

        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none text-white text-base placeholder-white/30 font-medium"
          placeholder="хлеб 50  /  такси 350  /  кино 800"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          autoComplete="off"
          autoFocus
        />

        {/* Превью суммы */}
        {preview && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-white font-bold text-base leading-tight">
                {preview.amount.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-xs leading-tight" style={{ color: cat?.color }}>
                {cat?.label}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!preview}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: cat ? cat.color + '33' : '#ffffff22', color: cat?.color ?? '#fff' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Подсказка */}
      {!value && (
        <p className="text-center text-white/25 text-xs mt-2">
          Введите название и сумму — категория определится сама
        </p>
      )}
    </div>
  );
}
