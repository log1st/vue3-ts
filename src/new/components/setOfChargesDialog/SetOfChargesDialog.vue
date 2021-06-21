<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      Работа с печатной формой свода начислений
    </div>
    <form
      v-if="isActive"
      @submit.prevent="submit"
      :class="$style.form"
    >
      <Btn
        :state="['tertiary', 'vertical']"
        prepend-icon="eye"
        label="Просмотр и печать"
        type="submit"
        :class="$style.action"
      />
    </form>
    <div :class="$style.hint" v-else>
      Выберите должника
    </div>
  </div>
</template>

<script>
import {computed, defineComponent} from "@vue/composition-api";
import {useToast} from "@/new/hooks/useToast";
import {useDialog} from "@/new/hooks/useDialog";
import Btn from "@/new/components/btn/Btn";
import {baseURL} from "@/settings/config";

export default defineComponent({
  name: "setOfChargesDialog",
  components: {Btn},
  props: {
    allSelected: Boolean,
    selectedItems: Array,
    selectedItem: Number,
    type: String,
  },
  setup(props, {emit}) {
    const isActive = computed(() => (
      props.allSelected
      || props.selectedItems?.length
      || props.selectedItem > -1
    ));

    const {
      showToast,
    } = useToast();

    const {
      showDialog,
    } = useDialog();

    const submit = async () => {
      await showToast({
        message: 'Формирование свода начислений...',
        type: 'warning',
      });

      const {
        data: {
          document,
        }
      } = await axios({
        method: 'post',
        url: `${baseURL}/constructor/render`,
        data: {
          company_id: localStorage.getItem('defaultCompany'),
          production_type: props.type,
          template_type_id: 3,
          debtor_ids: props.selectedItems || [props.selectedItem],
        }
      });

      if(document) {
        await showToast({
          message: 'Свод начилений готов и отправлен вам на почту!',
          type: 'success',
        });
        await showDialog({
          component: 'downloadFile',
          payload: {
            title: 'Работа с документами',
            url: document.file,
          },
        });
        emit('close')
      } else {
        await showToast({
          message: 'Ошибка формирования документов',
          type: 'error',
        })
      }
    }

    return {
      isActive,

      submit,
    }
  }
})
</script>

<style lang="scss" module>
@import "./setOfChargesDialog";
</style>
