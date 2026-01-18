import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    totalItems(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice(state) {
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
  },

  actions: {
    addToCart(product, quantity = 1) {
      const existing = this.items.find(
        i => i.product_id === product.id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity
        });
      }
    },

    increase(productId) {
      this.items = this.items.map(item =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    },

    decrease(productId) {
      const item = this.items.find(i => i.product_id === productId);
      if (!item) return;

      if (item.quantity > 1) {
        this.items = this.items.map(i =>
          i.product_id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      } else {
        this.removeFromCart(productId);
      }
    },

    removeFromCart(productId) {
      this.items = this.items.filter(
        item => item.product_id !== productId
      );
    },

    clear() {
      this.items = [];
    }
  }
});
