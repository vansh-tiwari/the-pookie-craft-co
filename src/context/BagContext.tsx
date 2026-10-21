"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import type { Product } from "@/types";
import type { Choices } from "@/lib/enquiry";
import {
  addBagItem,
  BAG_STORAGE_KEY,
  createBagItem,
  readBag,
  type BagItem,
} from "@/lib/bag";
interface BagContextValue {
  items: BagItem[];
  ready: boolean;
  storageNotice: string;
  add: (product: Product, choices: Choices) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  giftNote: string;
  setGiftNote: (note: string) => void;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
}
const GIFT_NOTE_STORAGE_KEY = "pookie_gift_note_v1";
const BagContext = createContext<BagContextValue | null>(null);
export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const ref = useRef<BagItem[]>([]);
  const [ready, setReady] = useState(false);
  const [storageNotice, setStorageNotice] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [giftNote, setGiftNoteState] = useState("");
  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => setIsOpen(false), []);

  const setGiftNote = useCallback((note: string) => {
    setGiftNoteState(note);
    try {
      localStorage.setItem(GIFT_NOTE_STORAGE_KEY, note);
    } catch {
      // ignore storage failure
    }
  }, []);

  useEffect(() => {
    try {
      const savedNote = localStorage.getItem(GIFT_NOTE_STORAGE_KEY);
      if (savedNote) setGiftNoteState(savedNote);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const value = localStorage.getItem(BAG_STORAGE_KEY);
      const saved = value ? readBag(JSON.parse(value)) : [];
      ref.current = saved;
      setItems(saved);
    } catch {
      setStorageNotice(
        "Your bag is available in this tab, but could not be restored from this browser.",
      );
    }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === GIFT_NOTE_STORAGE_KEY && event.newValue !== null) {
        setGiftNoteState(event.newValue);
      }
      if (event.key !== BAG_STORAGE_KEY) return;
      try {
        const next = event.newValue ? readBag(JSON.parse(event.newValue)) : [];
        ref.current = next;
        setItems(next);
      } catch {
        setStorageNotice(
          "Another tab changed your bag, but it could not be read. Please review your items.",
        );
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function commit(next: BagItem[]) {
    ref.current = next;
    setItems(next);
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(next));
      setStorageNotice("");
    } catch {
      setStorageNotice(
        "Your browser could not save this bag. Keep this tab open until you send your enquiry.",
      );
    }
  }
  function add(product: Product, choices: Choices) {
    if (!ready) throw new Error("Your bag is still loading. Please try again.");
    commit(addBagItem(ref.current, createBagItem(product, choices)));
    openBag();
  }
  function setQuantity(key: string, quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99)
      throw new Error("Choose a quantity between 1 and 99.");
    commit(
      ref.current.map((i) =>
        i.key === key ? { ...i, choices: { ...i.choices, quantity } } : i,
      ),
    );
  }
  return (
    <BagContext.Provider
      value={{
        items,
        ready,
        storageNotice,
        add,
        setQuantity,
        remove: (key) => commit(ref.current.filter((i) => i.key !== key)),
        clear: () => {
          commit([]);
          setGiftNote("");
        },
        count: items.reduce((sum, i) => sum + i.choices.quantity, 0),
        giftNote,
        setGiftNote,
        isOpen,
        openBag,
        closeBag,
      }}
    >
      {children}
    </BagContext.Provider>
  );
}
export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("Bag controls need a BagProvider.");
  return context;
}
