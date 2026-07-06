// Utility to mimic Svelte stores in React/Next.js
// These provide similar reactivity patterns using React state

import { useState, useEffect, useCallback } from 'react';

/**
 * Simple writable store implementation for React
 * Similar to Svelte stores but using React state
 */
export class WritableStore<T> {
  private value: T;
  private listeners: Set<(value: T) => void> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    this.value = newValue;
    this.listeners.forEach((listener) => listener(newValue));
  }

  update(updater: (current: T) => T): void {
    this.set(updater(this.value));
  }

  subscribe(listener: (value: T) => void): () => void {
    listener(this.value);
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  mutate(fn: (value: T) => void, description?: string): void {
    const newValue = fn(this.value);
    this.set(newValue);
  }
}

/**
 * Derived store that computes a value based on other stores
 */
export class DerivedStore<T> {
  private getter: () => T;
  private listeners: Set<(value: T) => void> = new Set();
  private currentValue: T;

  constructor(getter: () => T) {
    this.getter = getter;
    this.currentValue = getter();
  }

  get(): T {
    return this.currentValue;
  }

  private notify(): void {
    this.currentValue = this.getter();
    this.listeners.forEach((listener) => listener(this.currentValue));
  }

  subscribe(listener: (value: T) => void): () => void {
    listener(this.currentValue);
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  refresh(): void {
    this.notify();
  }
}

/**
 * Hook to use a writable store in a React component
 */
export function useStore<T>(store: WritableStore<T>): [T, (value: T) => void] {
  const [state, setState] = useState<T>(store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe((value) => {
      setState(value);
    });
    return unsubscribe;
  }, [store]);

  const set = useCallback((value: T) => {
    store.set(value);
  }, [store]);

  return [state, set];
}

/**
 * Hook to use a derived store in a React component
 */
export function useDerivedStore<T>(store: DerivedStore<T>): T {
  const [state, setState] = useState<T>(store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe((value) => {
      setState(value);
    });
    return unsubscribe;
  }, [store]);

  return state;
}
