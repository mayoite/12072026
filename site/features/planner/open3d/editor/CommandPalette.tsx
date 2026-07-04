"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  buildPaletteCommands,
  filterPaletteCommands,
  runPaletteCommand,
  type PaletteCommand,
  type PaletteCommandHandlers,
} from "../lib/commands/paletteCommands";
import styles from "./command-palette.module.css";

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handlers: PaletteCommandHandlers;
}

export function CommandPalette({ open, onOpenChange, handlers }: CommandPaletteProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = useMemo(() => buildPaletteCommands(), []);
  const results = useMemo(
    () => filterPaletteCommands(commands, query),
    [commands, query],
  );

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
     
    setSelectedIndex(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  const execute = useCallback(
    (command: PaletteCommand) => {
      runPaletteCommand(command.id, handlers);
      onOpenChange(false);
    },
    [handlers, onOpenChange],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, Math.max(0, results.length - 1)));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = results[selectedIndex];
        if (item) execute(item);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    },
    [execute, onOpenChange, results, selectedIndex],
  );

  if (!open) return null;

  return (
    <div
      className={styles.commandPaletteOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => onOpenChange(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") onOpenChange(false);
      }}
    >
      <div
        className={styles.commandPalettePanel}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className={styles.commandPaletteSearch}>
          <label className="sr-only" htmlFor={`${id}-palette-search`}>
            Search commands
          </label>
          <input
            ref={inputRef}
            id={`${id}-palette-search`}
            type="search"
            value={query}
            placeholder="Search tools and actions…"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={onKeyDown}
          />
          <span className={styles.commandPaletteHint}>Esc to close</span>
        </div>
        <div className={styles.commandPaletteResults} role="listbox" aria-label="Command results">
          {results.length === 0 ? (
            <p className={styles.commandPaletteEmpty}>No matching commands</p>
          ) : (
            results.map((command, index) => (
              <button
                key={command.id}
                type="button"
                className={styles.commandPaletteItem}
                data-active={index === selectedIndex}
                role="option"
                aria-selected={index === selectedIndex}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => execute(command)}
              >
                <span className={styles.commandPaletteItemMeta}>
                  <span className={styles.commandPaletteItemLabel}>{command.label}</span>
                  <span className={styles.commandPaletteItemCategory}>{command.categoryLabel}</span>
                </span>
                {command.shortcut ? (
                  <kbd className={styles.commandPaletteShortcut}>{command.shortcut}</kbd>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
