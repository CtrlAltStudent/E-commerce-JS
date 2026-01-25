<template>
  <div>
    <h1>Products</h1>

    <!-- MENU KATEGORII -->
    <CategoryMenu @select="onCategorySelect" />

    <p v-if="loading">Loading...</p>
    <p v-if="error" style="color: red">{{ error }}</p>

    <h2>Promocje</h2>

    <ul v-if="promoProducts.length">
      <li v-for="p in promoProducts" :key="p.id">
        <strong>{{ p.name }}</strong><br />
        <span style="text-decoration: line-through">
          {{ p.price }} zł
        </span>
        →
        <strong style="color:red">
          {{ p.final_price }} zł
        </strong>
      </li>
    </ul>

    <hr />

    <h2>Nowości</h2>

    <p v-if="loadingNewest">Loading newest products...</p>

    <ul v-if="newestProducts.length">
      <li v-for="p in newestProducts" :key="p.id">
        <strong>{{ p.name }}</strong>
        — {{ p.price }} zł
      </li>
    </ul>

    <hr />
    <NewestProducts />


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
import NewestProducts from '@/components/NewestProducts.vue'


const cart = useCartStore()

const products = ref([])
const quantities = ref({})
const selectedCategory = ref(null)

const loading = ref(false)
const error = ref(null)

const newestProducts = ref([])
const loadingNewest = ref(false)

const promoProducts = ref([])
const loadingPromo = ref(false)

const fetchNewest = async () => {
  loadingNewest.value = true
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/new?limit=4`
    )
    if (!res.ok) throw new Error('Failed to fetch newest products')
    newestProducts.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    loadingNewest.value = false
  }
}

const fetchPromotions = async () => {
  loadingPromo.value = true
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/promotions`
    )
    promoProducts.value = await res.json()
  } finally {
    loadingPromo.value = false
  }
}

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

onMounted(() => {
  fetchProducts()
  fetchNewest()
  fetchPromotions()
})


</script>
