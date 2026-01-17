<template>
  <div>
    <h1>Products</h1>

    <p v-if="loading">Loading...</p>
    <p v-if="error" style="color: red">{{ error }}</p>

    <ul v-if="products.length">
      <li v-for="product in products" :key="product.id">
        {{ product.name }} — {{ product.price }} zł
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const products = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    products.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
