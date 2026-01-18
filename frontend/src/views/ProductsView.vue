<template>
  <div>
    <h1>Products</h1>

    <p v-if="loading">Loading...</p>
    <p v-if="error" style="color: red">{{ error }}</p>

    <ul v-if="products.length">
      <li v-for="product in products" :key="product.id">
        <strong>{{ product.name }}</strong>
        — {{ product.price }} zł

        <input
          type="number"
          min="1"
          :max="product.stock"
          v-model.number="quantities[product.id]"
          style="width: 60px; margin-left: 10px;"
        />

        <button @click="addToCart(product)">
          Add to cart
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'

const products = ref([])
const quantities = ref({})
const cart = useCartStore()
const loading = ref(false)
const error = ref(null)

const addToCart = (product) => {
  const qty = quantities.value[product.id] || 1
  cart.addToCart(product, qty)
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)
    if (!res.ok) throw new Error('Failed to fetch products')

    products.value = await res.json()

    // domyślna ilość = 1 dla każdego produktu
    products.value.forEach(p => {
      quantities.value[p.id] = 1
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
