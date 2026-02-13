<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AdminLayout from './AdminLayout.vue'
import ClientLayout from './ClientLayout.vue'

const page = usePage()
const user = computed(() => (page.props.auth as any)?.user)
const isSuperUser = computed(() => Boolean(user.value?.isSuperUser))
</script>

<template>
  <AdminLayout v-if="isSuperUser">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
  </AdminLayout>

  <ClientLayout v-else>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
  </ClientLayout>
</template>
