<template>
  <span
    :class="priceClasses"
    class="price-component"
  >
    <template v-if="useUnit && priceFormat.unitDir === 'front'">
      <em class="price-component__unit">{{ priceFormat.unit }}</em>
    </template>

    <span class="price-component__number">{{ priceFormat.price }}</span>

    <template v-if="useUnit && priceFormat.unitDir === 'back'">
      <em class="price-component__unit">{{ priceFormat.unit }}</em>
    </template>
  </span>
</template>

<script setup lang="ts">
  import priceComposable, { priceEmits, priceProps } from '@/composables/elements/price';

  const emits = defineEmits(priceEmits);
  const props = defineProps(priceProps);

  const { priceFormat, priceClasses } = priceComposable(emits, props);
</script>

<style lang="scss" scoped>
  @import '@/styles/components/elements/price.scss';
</style>
