<script setup lang="ts">
import { AvatarImage as AvatarImagePrimitive } from 'radix-vue'
import type { AvatarImageProps } from 'radix-vue'

const props = defineProps<AvatarImageProps>()
</script>

<template>
  <AvatarImagePrimitive
    v-bind="props"
    class="aspect-square h-full w-full"
  />
</template>
