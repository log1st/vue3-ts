<template>
  <span :style="{display: 'none'}">
    <component
      :is="icon[1]"
      v-for="icon in icons.filter(([key]) => !key.startsWith('_'))"
      :id="`icon-${icon[0]}`"
      :key="icon[0]"
      :style="{
        height: '48px',
        width: '48px',
      }"
    />
  </span>
  <span>
    <component
      :is="icon[1]"
      v-for="icon in icons.filter(([key]) => key.startsWith('_'))"
      :key="icon[0]"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent, Component } from 'vue';

export default defineComponent({
  name: 'IconsMap',
  setup() {
    const icons: Array<[string, Component]> = [];

    ((r) => {
      r.keys().forEach((key) => {
        const name = key.replace(/\.\/(.*)\.inline\.svg/, '$1');
        icons.push([name, r(key).default]);
      });
    })(
      require.context('./assets'),
    );

    return {
      icons,
    };
  },
});
</script>
