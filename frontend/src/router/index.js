import { createRouter, createWebHistory } from 'vue-router'

import ProductsView from '../views/ProductsView.vue'
import OrderView from '../views/OrderView.vue'
import CartView from '../views/CartView.vue'
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/products/:id',
      name: 'product',
      component: ProductView,
    },

    // ===== ADMIN =====
    {
      path: '/admin',
      component: () => import('../views/admin/AdminDashboard.vue'),
      children: [
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../views/admin/AdminProducts.vue'),
        },
        {
          path: 'products/:id',
          name: 'admin-product-edit',
          component: () => import('../views/admin/AdminProductEdit.vue'),
        },
      ],
    },
  ],
})

export default router
