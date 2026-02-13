<script setup lang="ts">
defineProps<{ error: any }>();
</script>

<template>
  <div class="container">
    <div class="title">Erro no Servidor</div>

    <span>{{ error.message }}</span>
  </div>
</template>