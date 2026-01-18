<template>
  <div>
    <h3>Kategorie</h3>

    <ul style="list-style: none; padding-left: 0">
      <CategoryNode
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        @select="select"
      />
    </ul>

    <button
      style="margin-top: 10px"
      @click="select(null)"
    >
      Wszystkie produkty
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoryNode from './CategoryNode.vue'

const emit = defineEmits(['select'])
const categories = ref([])

const select = (id) => {
  emit('select', id)
}

onMounted(async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/categories/tree`
  )
  categories.value = await res.json()
})
</script>
