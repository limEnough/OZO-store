<template v-if="options?.length">
  <template
    v-for="(option, index) in options"
    :key="`radio-${name}-${index}`"
  >
    <label
      :class="{ [`type-${type}`]: type }"
      class="radio-component"
      v-bind="styleAttrs"
    >
      <!-- Input -->
      <input
        :checked="getChecked(option)"
        :value="getValue(option)"
        :name="`radio-${name}-${uuid}`"
        :disabled="disabled || isDisabledOption(option)"
        ref="refRadio"
        type="radio"
        class="radio-component__input blind"
        v-bind="functionalAttrs"
        @click="handleClick($event)"
      />

      <!-- Icon (basic type에만 노출)  -->
      <span
        v-if="type === 'basic'"
        class="radio-component__icon"
      >
      </span>

      <!-- Label -->
      <slot
        :label="getLabel(option)"
        :option="option"
        name="label"
      >
        <span class="radio-component__label">
          {{ getLabel(option) }}
        </span>
      </slot>
    </label>
  </template>
</template>

<script lang="ts">
  // declare additional options
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import radioComposable, { radioEmits, radioProps } from '@/composables/elements/radio';

  const emits = defineEmits(radioEmits);
  const props = defineProps(radioProps);

  const {
    refRadio,
    styleAttrs,
    functionalAttrs,

    uuid,

    getValue,
    getLabel,
    getChecked,
    isDisabledOption,

    handleClick,
  } = radioComposable(emits, props);
</script>

<style lang="scss" scoped>
  @import '@/styles/components/elements/radio.scss';
</style>
