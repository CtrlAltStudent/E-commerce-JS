<template>
  <div>
    <h1>Products</h1>

    <!-- MENU KATEGORII -->
    <CategoryMenu @select="onCategorySelect" />

    <p v-if="loading">Loading...</p>
    <p v-if="error" style="color: red">{{ error }}</p>

    <ul v-if="products.length">
      <li v-for="product in products" :key="product.id">
        <strong
          style="cursor: pointer; text-decoration: underline"
          @click="$router.push(`/products/${product.id}`)"
        >
          {{ product.name }}
        </strong>
        — {{ product.price }} zł

        <input
          type="number"
          min="1"
          :max="product.stock"
          v-model.number="quantities[product.id]"
          style="width: 60px; margin-left: 10px"
        />

        <button @click="addToCart(product)">
          Add to cart
        </button>
      </li>
    </ul>

    <p v-if="!loading && products.length === 0">
      Brak produktów w tej kategorii
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import CategoryMenu from '@/components/CategoryMenu.vue'

const cart = useCartStore()

const products = ref([])
const quantities = ref({})
const selectedCategory = ref(null)

const loading = ref(false)
const error = ref(null)

const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    let url = `${import.meta.env.VITE_API_URL}/api/products`

    if (selectedCategory.value) {
      url += `?category_id=${selectedCategory.value}`
    }

    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch products')

    products.value = await res.json()

    // reset ilości
    quantities.value = {}
    products.value.forEach(p => {
      quantities.value[p.id] = 1
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const onCategorySelect = (categoryId) => {
  selectedCategory.value = categoryId
  fetchProducts()
}

const addToCart = (product) => {
  const qty = quantities.value[product.id] || 1
  cart.addToCart(product, qty)
}

onMounted(fetchProducts)
</script>
