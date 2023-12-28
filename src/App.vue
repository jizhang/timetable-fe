<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import Alert from '@/components/Alert.vue'
</script>

<template>
  <router-view />
  <Alert />
</template>

<style lang="scss">
#app {
  font-size: 14px;
}
</style>
