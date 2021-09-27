<template>
  <form
    :class="$style.container"
    @submit.prevent="submit"
  >
    <div :class="$style.header">
      <div :class="$style.title">
        {{ t(variants.length ? 'titleFull': 'title') }}
      </div>
      <div
        v-if="variants.length"
        :class="$style.actions"
      >
        <button
          type="button"
          :class="$style.action"
          @click="selectItem(variants[0]?.cadnum || null)"
        >
          {{ t('action.selectDefault') }}
        </button>
        <button
          :class="$style.action"
          type="button"
          @click="expandAll"
        >
          {{ t('action.expandAll') }}
        </button>
        <button
          :class="$style.action"
          type="button"
          @click="collapseAll"
        >
          {{ t('action.collapseAll') }}
        </button>
      </div>
    </div>
    <div
      v-if="variants.length"
      :class="$style.variants"
    >
      <div
        v-for="variant in variants"
        :key="variant.id"
        :class="[
          $style.variant,
          variant.expanded && $style.expanded
        ]"
        @click="selectItem(variant.cadnum)"
      >
        <div :class="$style.heading">
          <Checkbox
            state="default"
            :true-value="variant.cadnum"
            :model-value="selectedItem"
          />
          <div :class="$style.name">
            {{ variant.cadnum }}
            <template v-if="!variant.expanded">
              , {{ variant.address }}
            </template>
          </div>
          <Icon
            :class="$style.toggle"
            icon="chevron"
            @click.stop="variant.expanded = !variant.expanded"
          />
        </div>
        <template v-if="variant.expanded">
          <div :class="$style.address">
            {{ variant.address }}
          </div>
          <div :class="$style.data">
            <div
              v-for="key in ['land_category', 'object_name', 'cad_cost', 'area']"
              :key="key"
              :class="$style.line"
            >
              <div :class="$style.label">
                {{ t(key) }}
              </div>
              <div :class="$style.label">
                {{ variant[key] }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <Btn
        v-if="selectedItem"
        :class="$style.submit"
        type="submit"
        state="primary"
      >
        {{ t('submit') }}
      </Btn>
    </div>
  </form>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, toRefs, watch,
} from 'vue';
import { Debtor } from '@/hooks/useDebtors';
import { StandardizedDebtorAddress, useRosreestr } from '@/hooks/useRosreestr';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import Icon from '@/components/icon/Icon.vue';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import Btn from '@/components/btn/Btn.vue';

export default defineComponent({
  name: 'CadastralSelector',
  components: { Btn, Checkbox, Icon },
  props: {
    id: Number as PropType<Debtor['pk']>,
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const { t } = useLocalI18n('debtor.common.owners.cadastral');
    const { id } = toRefs(props);

    const {
      fetchStandardizedDebtorAddresses,
      updateStandardizedDebtorAddress,
    } = useRosreestr();

    const selectedItem = ref<StandardizedDebtorAddress['cadnum'] | null>(null);
    const variants = ref<Array<StandardizedDebtorAddress & {expanded: boolean}>>([]);

    watch(id, async (newId) => {
      variants.value = [];
      if (!newId) {
        return;
      }
      const { status, response } = await fetchStandardizedDebtorAddresses({ id: newId });

      if (status) {
        variants.value = ((response.suggests as Array<StandardizedDebtorAddress>) || [

        ]).map((item) => ({
          ...item,
          expanded: false,
        }));
      }
    }, { immediate: true });

    const selectItem = (cadNum: StandardizedDebtorAddress['cadnum']) => {
      selectedItem.value = cadNum;
    };

    const submit = async () => {
      if (!id.value || !selectedItem.value) {
        return;
      }
      const { status } = await updateStandardizedDebtorAddress({
        id: id.value,
        cad_num: selectedItem.value,
      });

      if (!status) {
        return;
      }

      emit('refresh');
    };

    const collapseAll = () => {
      variants.value = variants.value.map((item) => ({
        ...item,
        expanded: false,
      }));
    };

    const expandAll = () => {
      variants.value = variants.value.map((item) => ({
        ...item,
        expanded: true,
      }));
    };

    return {
      selectedItem,
      selectItem,
      submit,
      variants,
      t,
      collapseAll,
      expandAll,
    };
  },
});
</script>

<style lang="scss" module>
@import "./cadastralSelector";
</style>
