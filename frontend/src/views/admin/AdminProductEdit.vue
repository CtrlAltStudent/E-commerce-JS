<template>
  <div v-if="product">
    <h2>Edycja produktu</h2>

    <label>
      Nazwa
      <input v-model="form.name" disabled />
    </label>

    <label>
      Cena
      <input type="number" v-model.number="form.price" />
    </label>

    <label>
      Cena promocyjna
      <input type="number" v-model.number="form.promo_price" />
    </label>

    <label>
      Stock
      <input type="number" v-model.number="form.stock" />
    </label>

    <label>
      Aktywny
      <input type="checkbox" v-model="form.is_active" />
    </label>

    <button @click="save" :disabled="saving">
      {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
    </button>

    <p v-if="success" style="color:green">Zapisano</p>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, } from 'vue-router'

const route = useRoute()


const product = ref(null)
const form = ref({})
const saving = ref(false)
const error = ref(null)
const success = ref(false)

const apiUrl = import.meta.env.VITE_API_URL

onMounted(async () => {
  const res = await fetch(`${apiUrl}/api/products/${route.params.id}`)
  product.value = await res.json()

  form.value = {
    name: product.value.name,
    price: product.value.price,
    promo_price: product.value.promo_price,
    stock: product.value.stock,
    is_active: product.value.is_active
  }
})

const save = async () => {
  saving.value = true
  error.value = null
  success.value = false

  try {
    const res = await fetch(
      `${apiUrl}/api/products/${route.params.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      }
    )

    if (!res.ok) throw new Error('Błąd zapisu')

    success.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>
