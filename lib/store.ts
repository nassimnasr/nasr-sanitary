import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productNumber: string;
  nameEn: string;
  nameAr: string;
  image?: string | null;
  price: number;
  color: string;
  brandName: string;
  quantity: number;
  stock?: number;
};

type AddCartItemInput = Omit<CartItem, "quantity">;

type CartState = {
  items: CartItem[];
  addToCart: (item: AddCartItemInput, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            const nextQuantity = existing.quantity + quantity;
            const boundedQuantity =
              typeof item.stock === "number"
                ? Math.min(nextQuantity, item.stock)
                : nextQuantity;

            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.max(1, boundedQuantity) }
                  : i
              ),
            };
          }

          const initialQuantity =
            typeof item.stock === "number"
              ? Math.min(quantity, item.stock)
              : quantity;

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: Math.max(1, initialQuantity),
              },
            ],
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;

            const boundedQuantity =
              typeof item.stock === "number"
                ? Math.min(quantity, item.stock)
                : quantity;

            return {
              ...item,
              quantity: Math.max(1, boundedQuantity),
            };
          }),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "nasr-sanitary-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
