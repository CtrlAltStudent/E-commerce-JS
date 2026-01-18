<template>
  <div>
    <h1>Cart</h1>

    <p v-if="cart.items.length === 0">
      Cart is empty
    </p>

    <div v-else>
      <div
        v-for="item in cart.items"
        :key="item.product_id"
        style="margin-bottom: 10px"
      >
        <strong>{{ item.name }}</strong>

        <div style="margin-top: 5px">
          <button @click="cart.decrease(item.product_id)">−</button>

          <span style="margin: 0 10px">
            {{ item.quantity }}
          </span>

          <button @click="cart.increase(item.product_id)">+</button>
        </div>

  <div style="margin-top: 5px">
    {{ item.quantity }} × {{ item.price }} zł =
    <strong>{{ item.quantity * item.price }} zł</strong>
  </div>
</div>

      <hr />

      <p><strong>Total items:</strong> {{ cart.totalItems }}</p>
      <p><strong>Total price:</strong> {{ cart.totalPrice }} zł</p>

      <button
        @click="checkout"
        :disabled="loading || cart.items.length === 0"
      >
        {{ loading ? 'Składanie zamówienia...' : 'Złóż zamówienie' }}
      </button>

      <p v-if="error" style="color:red">{{ error }}</p>
      <p v-if="success" style="color:green">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const checkout = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity
          }))
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error?.message || data.message || 'Order failed')
    }

    success.value = `Zamówienie złożone. Numer: ${data.order_number}`
    cart.clear()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
