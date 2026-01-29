<template>
  <div>
    <h2>Dodaj nowy produkt</h2>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="success" style="color:green">Produkt dodany</p>

    <form @submit.prevent="save">
      <div>
        <label>Nazwa</label><br />
        <input v-model="form.name" required />
      </div>

      <div>
        <label>Cena</label><br />
        <input type="number" step="0.01" v-model.number="form.price" required />
      </div>

      <div>
        <label>Stan magazynowy</label><br />
        <input type="number" v-model.number="form.stock" required />
      </div>

      <div>
        <label>ID kategorii</label><br />
        <input type="number" v-model.number="form.category_id" required />
      </div>

      <div>
        <label>Aktywny</label>
        <input type="checkbox" v-model="form.is_active" />
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Zapisywanie…' : 'Dodaj produkt' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const apiUrl = import.meta.env.VITE_API_URL
const router = useRouter()

const form = ref({
  name: '',
  price: 0,
  stock: 0,
  category_id: null,
  is_active: true,
})

const saving = ref(false)
const error = ref(null)
const success = ref(false)

const save = async () => {
  saving.value = true
  error.value = null

  try {
    const res = await fetch(`${apiUrl}/api/products?admin=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (!res.ok) throw new Error('Błąd zapisu produktu')

    success.value = true
    setTimeout(() => router.push('/admin/products'), 800)
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}
</script>
