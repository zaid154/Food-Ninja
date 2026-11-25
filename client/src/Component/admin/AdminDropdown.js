import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const AdminDropdown = ({
  label, sublabel, value, options = [], onChange, placeholder = "Select...",
  variant = "filter", compact = false, portal = false, triggerClassName = "",
  allowAdd = false, onAddOption, addLabel = "Add New Option", addPlaceholder = "Type a new option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const [newOptionText, setNewOptionText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const dropdownRef = useRef(null);
  const panelRef = useRef(null);
  const isDishStyle = variant === "dish";
  const items = options.map((option) => typeof option === "object" ? option : { value: option, label: option });
  const selected = items.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event) => {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "mousedown" && (dropdownRef.current?.contains(event.target) || panelRef.current?.contains(event.target))) return;
      setIsOpen(false);
      setIsAdding(false);
    };
    const position = () => {
      if (!portal) return;
      const rect = dropdownRef.current?.querySelector("button")?.getBoundingClientRect();
      if (!rect) return;
      const height = Math.min(items.length * 38 + 8, 248);
      const opensDown = rect.bottom + height + 8 < window.innerHeight;
      setPanelStyle({ position: "fixed", left: rect.left, width: rect.width, top: opensDown ? rect.bottom + 4 : Math.max(8, rect.top - height - 4), zIndex: 1000 });
    };
    position();
    const documentEvents = ["mousedown", "keydown"];
    const windowEvents = [["resize", false], ["scroll", true]];
    documentEvents.forEach((name) => document.addEventListener(name, close));
    windowEvents.forEach(([name, capture]) => window.addEventListener(name, position, capture));
    return () => {
      documentEvents.forEach((name) => document.removeEventListener(name, close));
      windowEvents.forEach(([name, capture]) => window.removeEventListener(name, position, capture));
    };
  }, [isOpen, items.length, portal]);

  const selectOption = (option) => { onChange(option.value); setIsOpen(false); };
  const createOption = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const option = newOptionText.trim();
    if (!option) return;
    onAddOption?.(option);
    onChange(option);
    setNewOptionText("");
    setIsAdding(false);
    setIsOpen(false);
  };
  const handleInputKey = (event) => {
    if (event.key === "Enter") createOption(event);
    if (event.key === "Escape") { event.stopPropagation(); setIsAdding(false); }
  };

  const menu = isOpen && (
    <div
      ref={panelRef}
      role="listbox"
      style={portal ? panelStyle : undefined}
      className={cx(!portal && ("absolute left-0 right-0 top-full mt-1 " + (isDishStyle ? "z-50" : "z-[80]")), "overflow-hidden rounded-xl border border-slate-200 bg-white animate-in fade-in zoom-in-95 duration-150", isDishStyle ? "py-1 shadow-2xl" : "p-1 shadow-xl")}
    >
      <div className={cx("overflow-y-auto [scrollbar-width:thin]", isDishStyle ? "max-h-36 divide-y divide-slate-50 [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent" : "max-h-60")}>
        {items.map((option) => {
          const active = option.value === value;
          return (
            <button key={option.value} type="button" role="option" aria-selected={active} onClick={() => selectOption(option)}
              className={cx("flex w-full items-center justify-between text-left text-xs transition", isDishStyle ? "px-3 py-1.5" : "gap-3 rounded-lg px-2.5 py-2", active ? "bg-emerald-50 font-bold text-emerald-900" : "text-slate-700 hover:bg-slate-50")}>
              <span className="truncate">{option.label}</span>
              {!isDishStyle && option.count !== undefined && <span className="shrink-0 text-[10px] font-semibold text-slate-400">{option.count}</span>}
              {active && <svg className={cx("h-3.5 w-3.5 shrink-0", isDishStyle ? "text-emerald-600" : "text-emerald-700")} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          );
        })}
      </div>
      {allowAdd && (
        <div className="border-t border-slate-100 bg-slate-50/80 p-1.5">
          {isAdding ? (
            <div className="flex items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
              <input autoFocus value={newOptionText} onChange={(event) => setNewOptionText(event.target.value)} onKeyDown={handleInputKey} placeholder={addPlaceholder} className="w-full rounded-lg border border-emerald-500 bg-white px-2 py-1 text-[11px] outline-none" />
              <button type="button" onClick={createOption} className="shrink-0 rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-emerald-800">Add</button>
              <button type="button" onClick={() => setIsAdding(false)} className="shrink-0 px-1 text-xs font-bold text-slate-400 hover:text-slate-600">✕</button>
            </div>
          ) : (
            <button type="button" onClick={(event) => { event.stopPropagation(); setIsAdding(true); }} className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-800">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-w-0" ref={dropdownRef}>
      {label && <label className={cx("flex items-center justify-between font-bold", isDishStyle ? "mb-1 text-[11px] text-slate-700" : "mb-1 text-[10px] tracking-wide text-slate-500")}><span>{label}</span>{sublabel && <span className="text-[10px] font-normal text-slate-400">{sublabel}</span>}</label>}
      <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}
        className={cx("flex w-full items-center justify-between gap-2 border bg-white text-left font-semibold transition focus:outline-none", isDishStyle ? "rounded-xl px-3 py-1.5 text-xs" : "rounded-lg px-3 text-xs " + (compact ? "py-1.5" : "py-2.5"), isOpen ? "border-emerald-600 ring-2 ring-emerald-600/10" : "border-slate-200 hover:border-slate-300", triggerClassName)}>
        <span className={cx("truncate", isDishStyle ? "font-medium" : "", isDishStyle && (value ? "text-slate-800" : "text-slate-400"), !isDishStyle && "text-slate-800")}>{selected?.label || value || placeholder}</span>
        <svg className={cx("h-4 w-4 shrink-0 text-slate-400 transition-transform", isOpen && "rotate-180 text-emerald-700")} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {portal && menu ? createPortal(menu, document.body) : menu}
    </div>
  );
};

export default AdminDropdown;