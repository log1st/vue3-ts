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
        <Checkbox v-model="model.force" :class="[$style.field, $style.fieldRight]">
          <template #preLabel>
            <div :class="$style.fieldLabel">
              Перезаказать
            </div>
          </template>
        </Checkbox>
      </div>
      <div :class="$style.error" v-if="'type' in errorsMap">
        {{errorsMap.type}}
      </div>
      <div :class="$style.error" v-if="'type' in errorsMap">
        {{errorsMap.type}}
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
import {useErrors} from "@/new/hooks/useErrors";
import {useStore} from "@/new/hooks/useStore";
// @TODO: remove
import qs from "qs";

export default defineComponent({
  name: "setOfChargesDialog",
  components: {Checkbox, Icon, Btn},
  props: {
    allSelected: Boolean,
    selectedItems: Array,
    selectedItem: Number,
    type: String,
    filters: Object,
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
      rights: null,
      data: null,
      force: false,
    })

    const {
      clearErrors,
      setErrors,
      errorsMap,
    } = useErrors();

    const store = useStore();

    let printUnsubscribe;
    onBeforeUnmount(() => {
      printUnsubscribe && printUnsubscribe()
    });
    const submit = async () => {
      clearErrors();
      try {

        emit('close');

          const {data: {id: requestId}} = await axios({
            method: 'post',
            url: `${baseURL}/rosreestr/status/`,
            params: props.allSelected ? {...props.filters, filters: props.filters} : {},
            data: {
              company_id: store.getters['getDefaultCompanyId'],
              debtor_ids: (props.selectedItems || [props.selectedItem]).map((id) => id),
              type: [model.value.data && 'data', model.value.rights && 'rights'].filter(Boolean),
              force: model.value.force,

              ...(props.allSelected ? {
                filters: props.filters,
                ...props.filters,
              } : {}),
            },
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
          });


          await showToast({
            message: 'Заказ выписки из ЕГРН',
            type: 'warning',
          });

          const {promise, unsubscribe} = asyncAction(
            async () => (await axios({
              method: 'get',
              url: `${baseURL}/rosreestr/status/${requestId}/`
            })).data,
            async({status, file_pdf, ...etc}) => ({
              1: {status: true, payload: {file_pdf}},
              2: {status: true, error: etc},
            }[status] || {status: false}),
          );

          printUnsubscribe = unsubscribe;
          try {
            const {file_pdf} = await promise;
            await showToast({
              message: 'Запрос на выписку из ЕГРН успешно сформирован',
              type: 'success',
            })
          } catch (e) {
            const cadnumError = e?.stats?.errors.find(({msg}) => msg === 'Cadnum not found')?.msg
            if(cadnumError)  {
              await showToast({
                title: cadnumError,
                type: 'error'
              })
            } else {
              await showToast({
                title: 'Ошибка формирования запроса выписки',
                message: Object.values(e?.stats?.errors || {}).map(({msg}) => (msg).join(', ')),
                type: 'error',
              })
            }
          }
      } catch (e) {
        setErrors(
          Object.entries(e.response.data).reduce((acc, [key, [message]]) => ([
            ...acc,
            [key, message]
          ]), [])
        )
      }
    }

    return {
      isActive,

      submit,

      model,

      errorsMap,
    }
  }
})
</script>

<style lang="scss" module>
@import "./extractFromEgrnDialog";
</style>
