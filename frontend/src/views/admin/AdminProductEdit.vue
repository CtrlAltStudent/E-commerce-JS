<template>
  <div>
    <h2>Edycja produktu</h2>

    <p v-if="loading">Ładowanie…</p>
    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="success" style="color:green">Zapisano zmiany</p>

    <router-link
      v-if="product"
      :to="`/admin/products/${product.id}/images`"
    >
      Zdjęcia
    </router-link>


    <form v-if="product" @submit.prevent="save">
      <div>
        <label>Nazwa</label><br />
        <input v-model="form.name" />
      </div>

      <div>
        <label>Cena</label><br />
        <input type="number" step="0.01" v-model.number="form.price" />
      </div>

      <div>
        <label>Cena promocyjna</label><br />
        <input type="number" step="0.01" v-model.number="form.promo_price" />
      </div>

      <div>
        <label>Stan magazynowy</label><br />
        <input type="number" v-model.number="form.stock" />
      </div>

      <div>
        <label>Aktywny</label>
        <input type="checkbox" v-model="form.is_active" />
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Zapisywanie…' : 'Zapisz' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const apiUrl = import.meta.env.VITE_API_URL

const product = ref(null)
const form = ref({})
const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch(`${apiUrl}/api/products/${route.params.id}`)
    if (!res.ok) throw new Error('Nie znaleziono produktu')

    product.value = await res.json()

    // kopia do formularza
    form.value = {
      name: product.value.name,
      price: product.value.price,
      promo_price: product.value.promo_price,
      stock: product.value.stock,
      is_active: product.value.is_active
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const save = async () => {
  saving.value = true
  error.value = null
  success.value = false

  try {
    const res = await fetch(
      `${apiUrl}/api/products/${route.params.id}?admin=1`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      }
    )

    if (!res.ok) throw new Error('Błąd zapisu')

    success.value = true
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}
</script>
