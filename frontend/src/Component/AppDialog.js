import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const AppDialogContext = createContext(null);

const DIALOG_STYLES = {
  info: {
    icon: "i",
    iconStyle: "bg-sky-50 text-sky-700",
    actionStyle: "bg-emerald-700 hover:bg-emerald-800",
  },
  success: {
    icon: "✓",
    iconStyle: "bg-emerald-50 text-emerald-700",
    actionStyle: "bg-emerald-700 hover:bg-emerald-800",
  },
  warning: {
    icon: "!",
    iconStyle: "bg-amber-50 text-amber-700",
    actionStyle: "bg-amber-600 hover:bg-amber-700",
  },
  error: {
    icon: "×",
    iconStyle: "bg-rose-50 text-rose-700",
    actionStyle: "bg-rose-600 hover:bg-rose-700",
  },
  danger: {
    icon: "!",
    iconStyle: "bg-rose-50 text-rose-700",
    actionStyle: "bg-rose-600 hover:bg-rose-700",
  },
};

const AppDialogView = ({ dialog, onClose }) => {
  const cancelButtonRef = useRef(null);
  const isConfirm = dialog.mode === "confirm";
  const style = DIALOG_STYLES[dialog.variant] || DIALOG_STYLES.info;
  const defaultTitles = {
    info: "Message",
    success: "Done",
    warning: "Please confirm",
    error: "Something went wrong",
    danger: "Please confirm",
  };

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose(false);
      }}
    >
      <section
        role={isConfirm ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby="app-dialog-title"
        aria-describedby="app-dialog-message"
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black ${style.iconStyle}`} aria-hidden="true">
            {style.icon}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id="app-dialog-title" className="text-sm font-extrabold text-slate-900">
              {dialog.title || defaultTitles[dialog.variant] || "Message"}
            </h2>
            <p id="app-dialog-message" className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">
              {dialog.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          {isConfirm && (
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={() => onClose(false)}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {dialog.cancelLabel || "Cancel"}
            </button>
          )}
          <button
            ref={!isConfirm ? cancelButtonRef : null}
            type="button"
            onClick={() => onClose(true)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold text-white transition ${style.actionStyle}`}
          >
            {dialog.confirmLabel || (isConfirm ? "Confirm" : "Okay")}
          </button>
        </div>
      </section>
    </div>
  );
};

export const AppDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const openDialog = useCallback((options) => new Promise((resolve) => {
    if (resolverRef.current) resolverRef.current(false);
    resolverRef.current = resolve;
    setDialog({ variant: "info", mode: "alert", ...options });
  }), []);

  const showAlert = useCallback((message, options = {}) => (
    openDialog({ ...options, message: String(message ?? ""), mode: "alert" }).then(() => undefined)
  ), [openDialog]);

  const showConfirm = useCallback((message, options = {}) => (
    openDialog({ ...options, message: String(message ?? ""), mode: "confirm" })
  ), [openDialog]);

  const closeDialog = useCallback((result) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setDialog(null);
    resolve?.(result);
  }, []);

  return (
    <AppDialogContext.Provider value={{ alert: showAlert, confirm: showConfirm }}>
      {children}
      {dialog && <AppDialogView dialog={dialog} onClose={closeDialog} />}
    </AppDialogContext.Provider>
  );
};

export const useAppDialog = () => {
  const context = useContext(AppDialogContext);
  if (!context) throw new Error("useAppDialog must be used within AppDialogProvider.");
  return context;
};
