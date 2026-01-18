<template>
  <div>
    <nav style="margin-bottom: 20px">
      <router-link to="/">Products</router-link> |
      <router-link to="/order">Order</router-link>
      <router-link to="/cart">Cart</router-link>
    </nav>

    <router-view />
  </div>
</template>
