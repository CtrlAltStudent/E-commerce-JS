<template>
  <div>
    <h1>Create Order</h1>

    <button @click="createOrder" :disabled="loading">
      {{ loading ? 'Creating...' : 'Create sample order' }}
    </button>

    <p v-if="error" style="color: red; margin-top: 10px">
      {{ error }}
    </p>

    <pre v-if="result" style="margin-top: 10px"
      >{{ result }}
    </pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const result = ref(null)
const error = ref(null)

const createOrder = async () => {
  loading.value = true
  error.value = null
  result.value = null

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ product_id: 1, quantity: 1 }],
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Order failed')
    }

    result.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
