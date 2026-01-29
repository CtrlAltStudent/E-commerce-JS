<template>
  <div>
    <h2>Zamówienia – panel admina</h2>

    <p v-if="loading">Ładowanie…</p>
    <p v-if="error" style="color:red">{{ error }}</p>

    <table v-if="orders.length" border="1" cellpadding="6">
      <thead>
        <tr>
          <th>ID</th>
          <th>Numer</th>
          <th>Status</th>
          <th>Kwota</th>
          <th>Pozycje</th>
          <th>Akcja</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td>{{ o.id }}</td>
          <td>{{ o.order_number }}</td>

          <td>
            <select v-model="o.status">
              <option>Nowe</option>
              <option>W realizacji</option>
              <option>Wysłane</option>
              <option>Anulowane</option>
            </select>
          </td>

          <td>{{ o.total }} zł</td>

          <td>
            <ul>
              <li
                v-for="item in o.items"
                :key="item.product_id"
              >
                {{ item.product_name || item.product_id }}
                × {{ item.quantity }}
              </li>
            </ul>
          </td>

          <td>
            <button @click="saveStatus(o)">✓</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && orders.length === 0">
      Brak zamówień
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL

const orders = ref([])
const loading = ref(false)
const error = ref(null)

const fetchOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(`${apiUrl}/api/orders?admin=1`)
    if (!res.ok) throw new Error('Nie udało się pobrać zamówień')
    orders.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const saveStatus = async (order) => {
  try {
    const res = await fetch(
      `${apiUrl}/api/orders/${order.id}/status?admin=1`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: order.status }),
      }
    )

    if (!res.ok) {
      throw new Error('Błąd zapisu statusu')
    }
  } catch (err) {
    alert(err.message)
  }
}

onMounted(fetchOrders)
</script>
