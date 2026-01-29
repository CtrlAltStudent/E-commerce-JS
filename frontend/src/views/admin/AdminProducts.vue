<template>
  <div>
    <h2>Produkty – panel admina</h2>

    <p v-if="loading">Loading...</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <router-link to="/admin/products/new">
      ➕ Dodaj produkt
    </router-link>

    <table v-if="products.length" border="1" cellpadding="6">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nazwa</th>
          <th>Cena</th>
          <th>Stock</th>
          <th>Aktywny</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.price }}</td>
          <td>{{ p.stock }}</td>
          <td>{{ p.is_active ? 'TAK' : 'NIE' }}</td>
          <td>
            <!-- suwak -->
            <label class="switch">
              <input
                type="checkbox"
                :checked="p.is_active"
                @change="toggleActive(p)"
              />
              <span class="slider"></span>
            </label>

            <router-link
              :to="`/admin/products/${p.id}`"
              style="margin-left: 10px"
            >
              Edytuj
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && products.length === 0">
      Brak produktów
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const loading = ref(false)
const error = ref(null)

const apiUrl = import.meta.env.VITE_API_URL

const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(`${apiUrl}/api/products?includeInactive=1`)
    if (!res.ok) throw new Error('Failed to fetch products')
    products.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const toggleActive = async (product) => {
  try {
    await fetch(`${apiUrl}/api/products/${product.id}?admin=1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_active: !product.is_active
      })
    })

    // lokalnie – bez zmiany kolejności
    product.is_active = !product.is_active
  } catch {
    alert('Błąd przy zmianie statusu')
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}
.switch input {
  opacity: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.3s;
}
.slider::before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}
input:checked + .slider {
  background-color: #4caf50;
}
input:checked + .slider::before {
  transform: translateX(22px);
}
</style>
