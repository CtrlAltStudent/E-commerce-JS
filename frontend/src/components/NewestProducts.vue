<template>
  <div style="margin-bottom: 30px">
    <h2>🆕 Nowości</h2>

    <p v-if="loading">Loading...</p>

    <ul v-if="products.length">
      <li v-for="p in products" :key="p.id">
        <strong
          style="cursor:pointer; text-decoration:underline"
          @click="$router.push(`/products/${p.id}`)"
        >
          {{ p.name }}
        </strong>
        — {{ p.price }} zł
      </li>
    </ul>

    <p v-if="!loading && products.length === 0">
      Brak nowości
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/newest?limit=5`
    )
    products.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>
