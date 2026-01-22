<template>
  <div>
    <p v-if="loading">Loading product...</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <div v-if="product">
      <!-- OBRAZ PRODUKTU -->
      <img
        :src="imageSrc"
        :alt="product.name"
        @error="onImageError"
        style="max-width: 400px; display: block; margin-bottom: 20px"
      />

      <h1>{{ product.name }}</h1>

      <p><strong>Price:</strong> {{ product.price }} zł</p>
      <p><strong>Stock:</strong> {{ product.stock }}</p>

      <div v-if="product.description">
        <h3>Description</h3>
        <div v-html="product.description"></div>
      </div>

      <div style="margin-top: 15px">
        <input
          type="number"
          min="1"
          :max="product.stock"
          v-model.number="quantity"
        />
        <button @click="addToCart">
          Add to cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const cart = useCartStore()

const product = ref(null)
const quantity = ref(1)

const loading = ref(false)
const error = ref(null)

// ŚCIEŻKA DO OBRAZU NA PODSTAWIE NAZWY PRODUKTU
const imageSrc = computed(() => {
  if (!product.value) return ''
  return `/images/products/large/${product.value.name}.jpg`
})

// FALLBACK, JEŚLI BRAK OBRAZKA
const onImageError = (event) => {
  event.target.src = '/images/no-image.jpg'
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${route.params.id}`
    )
    if (!res.ok) throw new Error('Product not found')

    product.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const addToCart = () => {
  cart.addToCart(product.value, quantity.value)
}
</script>
