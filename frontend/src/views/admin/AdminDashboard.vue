<template>
  <div>
    <h1>Admin panel</h1>

    <nav style="margin-bottom: 20px">
      <router-link to="/admin/products">Produkty</router-link> |
      <router-link to="/admin/orders">Zamówienia</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
</script>
