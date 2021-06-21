<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      <Icon icon="egrn-excerpt" :class="$style.titleIcon"/>
      Получение выписок из ЕГРН
    </div>
    <form
      v-if="isActive"
      @submit.prevent="submit"
      :class="$style.form"
    >
      <div :class="$style.description">
        Обращаем Ваше внимание, что произойдет списание с Вашего лицевого счета суммы за услугу по получению выписки ЕГРН с официального сайта Росреестра, согласно тарифному плану.
      </div>
      <div :class="$style.fields">
        <Checkbox
          v-model="model.data"
          :class="$style.field"
        >
          <template #label>
            <div :class="$style.fieldLabel">
              Выписка из ЕГРН - <span>10 руб/шт</span>
            </div>
          </template>
        </Checkbox>
        <Checkbox
          v-model="model.rights"
          :class="$style.field"
        >
          <template #label>
            <div :class="$style.fieldLabel">
              Выписка из ЕГРН о переходе прав - <span>10 руб/шт</span>
            </div>
          </template>
        </Checkbox>
      </div>
      <div :class="$style.attention">Важно!</div>
      <div :class="$style.attentionHint">
        Мы не гарантируем корректную работа сайта Росреестра. Время<br/>
        получения выписки по регламенту Росреестра занимает до 5 дней.
      </div>
      <Btn
        state="primary"
        label="Отправить запрос"
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
import {computed, defineComponent, onBeforeUnmount, ref} from "@vue/composition-api";
import {useToast} from "@/new/hooks/useToast";
import {useDialog} from "@/new/hooks/useDialog";
import Btn from "@/new/components/btn/Btn";
import {baseURL} from "@/settings/config";
import Icon from "@/new/components/icon/Icon";
import Checkbox from "@/new/components/checkbox/Checkbox";
import {asyncAction} from "@/new/utils/asyncAction";

export default defineComponent({
  name: "setOfChargesDialog",
  components: {Checkbox, Icon, Btn},
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

    const model = ref({
      data: false,
      rights: false,
    })

    let printUnsubscribe;
    onBeforeUnmount(() => {
      printUnsubscribe && printUnsubscribe()
    });
    const submit = async () => {

      const {data: {id: requestId}} = await axios({
        method: 'post',
        url: `${baseURL}/rosreestr/status/`,
        data: {
          company_id: localStorage.getItem('defaultCompany'),
          debtors: (props.selectedItems || [props.selectedItem]).reduce((acc, debtor_id) => ([
            ...acc,
            ...[model.value.data && 'data', model.value.rights && 'rights'].filter(Boolean).map(type => ({
              debtor_id,
              type,
            }))
          ]), [])
        }
      });

      await showToast({
        message: 'Формирование выписки ЕГРН...',
        type: 'warning',
      });

      const {promise, unsubscribe} = asyncAction(
        async () => (await axios({
          method: 'get',
          url: `${baseURL}/rosreestr/status/${requestId}/`
        })).data,
        async({status, file_pdf}) => ({
          1: {status: true, payload: {file_pdf}},
          2: {status: true, error: true},
        }[status] || {status: false}),
        1000,
      );

      printUnsubscribe = unsubscribe;
      try {
        const {file_pdf} = await promise;
        await showToast({
          message: 'Документ готов и отправлен вам на почту',
          type: 'success',
        })
        await showDialog({
          component: 'downloadFile',
          payload: {
            title: 'Работа с документами',
            url: file_pdf
          }
        })
        emit('close');
      } catch (e) {
        await showToast({
          message: 'Ошибка формирования документов',
          type: 'error',
        })
      }
    }

    return {
      isActive,

      submit,

      model,
    }
  }
})
</script>

<style lang="scss" module>
@import "./extractFromEgrnDialog";
</style>
