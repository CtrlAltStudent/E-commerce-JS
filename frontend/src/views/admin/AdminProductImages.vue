<template>
  <div>

    <p v-if="error" style="color:red">{{ error }}</p>

    <h2 v-if="product">
      Zdjęcia produktu: <strong>{{ product.name }}</strong>
    </h2>

    <!-- UPLOAD -->
    <div style="margin-bottom: 16px">
      <input type="file" @change="onFile" />
      <button @click="upload" :disabled="!file">
        Dodaj zdjęcie
      </button>
    </div>

    <hr />

    <!-- LISTA -->
    <p v-if="images.length === 0">
      Brak zdjęć
    </p>

    <ul v-else>
      <li
        v-for="img in images"
        :key="img.id"
        style="margin-bottom: 20px"
      >
        <!-- PODGLĄD -->
        <img
          :src="apiUrl + img.url"
          style="max-width: 200px; display: block; margin-bottom: 6px"
        />

        <!-- INFO -->
        <label>
          <input
            type="radio"
            :checked="img.is_primary"
            disabled
          />
          Główne
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const apiUrl = import.meta.env.VITE_API_URL
const route = useRoute()

const images = ref([])
const product = ref(null)
const file = ref(null)
const error = ref(null)

const fetchImages = async () => {
  try {
    const res = await fetch(
      `${apiUrl}/api/products/${route.params.id}/images`
    )
    if (!res.ok) throw new Error('Błąd pobierania zdjęć')
    images.value = await res.json()
  } catch (err) {
    error.value = err.message
  }
}

const fetchProduct = async () => {
  const res = await fetch(`${apiUrl}/api/products/${route.params.id}`)
  if (res.ok) {
    product.value = await res.json()
  }
}


const onFile = (e) => {
  file.value = e.target.files[0]
}

const upload = async () => {
  try {
    const form = new FormData()
    form.append('images', file.value)

    const res = await fetch(
      `${apiUrl}/api/products/${route.params.id}/images?admin=1`,
      {
        method: 'POST',
        body: form,
      }
    )

    if (!res.ok) throw new Error('Błąd uploadu')

    file.value = null
    await fetchImages()
  } catch (err) {
    error.value = err.message
  }
}

onMounted(() => {
  fetchProduct()
  fetchImages()
})

</script>
