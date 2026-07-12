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
  Dialog,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  SearchField,
} from "react-aria-components";
import {
  buildPaletteCommands,
  filterPaletteCommands,
  runPaletteCommand,
  type PaletteCommand,
  type PaletteCommandHandlers,
} from "@/features/planner/project/lib/commands/paletteCommands";
import styles from "./command-palette.module.css";

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handlers: PaletteCommandHandlers;
}

export function CommandPalette({ open, onOpenChange, handlers }: CommandPaletteProps) {
  const id = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const commands = useMemo(() => buildPaletteCommands(), []);
  const results = useMemo(
    () => filterPaletteCommands(commands, query),
    [commands, query],
  );

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      setQuery("");
      setSelectedKey(null);
      searchInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSelectedKey(results[0]?.id ?? null);
    });
    return () => cancelAnimationFrame(frame);
  }, [query, results]);

  const execute = useCallback(
    (command: PaletteCommand) => {
      runPaletteCommand(command.id, handlers);
      onOpenChange(false);
    },
    [handlers, onOpenChange],
  );

  const onSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (results.length > 0) {
          listBoxRef.current?.focus();
        }
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = results.find((command) => command.id === selectedKey) ?? results[0];
        if (item) execute(item);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    },
    [execute, onOpenChange, results, selectedKey],
  );

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      className={styles.commandPaletteOverlay}
      isDismissable
    >
      <Modal className={styles.commandPalettePanel}>
        <Dialog aria-label="Command palette" className="outline-none">
          <SearchField
            className={styles.commandPaletteSearch}
            value={query}
            onChange={setQuery}
            aria-label="Search commands"
          >
            <Label className="sr-only" htmlFor={`${id}-palette-search`}>
              Search commands
            </Label>
            <Input
              ref={searchInputRef}
              id={`${id}-palette-search`}
              type="search"
              placeholder="Search tools and actions…"
              autoComplete="off"
              spellCheck={false}
              onKeyDown={onSearchKeyDown}
            />
            <span className={styles.commandPaletteHint}>Esc to close</span>
          </SearchField>
          {results.length === 0 ? (
            <p className={styles.commandPaletteEmpty}>No matching commands</p>
          ) : (
            <ListBox
              ref={listBoxRef}
              className={styles.commandPaletteResults}
              aria-label="Command results"
              items={results}
              selectionMode="single"
              selectedKeys={selectedKey ? [selectedKey] : []}
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                setSelectedKey(typeof key === "string" ? key : null);
              }}
              onAction={(key) => {
                const command = results.find((item) => item.id === key);
                if (command) execute(command);
              }}
            >
              {(command) => (
                <ListBoxItem
                  id={command.id}
                  textValue={command.label}
                  className={styles.commandPaletteItem}
                >
                  <span className={styles.commandPaletteItemMeta}>
                    <span className={styles.commandPaletteItemLabel}>{command.label}</span>
                    <span className={styles.commandPaletteItemCategory}>{command.categoryLabel}</span>
                  </span>
                  {command.shortcut ? (
                    <kbd className={styles.commandPaletteShortcut}>{command.shortcut}</kbd>
                  ) : null}
                </ListBoxItem>
              )}
            </ListBox>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
