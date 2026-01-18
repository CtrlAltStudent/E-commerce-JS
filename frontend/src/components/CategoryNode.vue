<template>
  <li>
    <div
      style="cursor: pointer; padding: 4px 0"
      @click="selectCategory"
    >
      {{ category.name }}
    </div>

    <ul
      v-if="category.children && category.children.length"
      style="list-style: none; padding-left: 15px"
    >
      <CategoryNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        @select="emitSelect"
      />
    </ul>
  </li>
</template>

<script setup>
import CategoryNode from './CategoryNode.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const selectCategory = () => {
  emit('select', props.category.id)
}

const emitSelect = (id) => {
  emit('select', id)
}
</script>
