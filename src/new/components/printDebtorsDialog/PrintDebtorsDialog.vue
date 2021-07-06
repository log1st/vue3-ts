<template>
  <div :class="[$style.dialog, $style[type]]">
    <div :class="$style.title">
      Работа с печатной формой подачи документов
    </div>
    <form
      v-if="isActive"
      @submit.prevent="print"
      :class="[$style.form, $style[type]]"
    >
      <div :class="$style.documents">
        <div :class="$style.heading">Список документов в приложении</div>
        <div :class="$style.documentsHeader">
          <div :class="$style.documentsIcons">
            <Icon icon="eye" :class="$style.documentsIcon"/>
            <Icon icon="printer" :class="$style.documentsIcon"/>
          </div>
          <div :class="$style.documentsLabel">
            Настройка печати
          </div>
        </div>
        <Draggable
          :class="$style.documentsList"
          v-model="model.documents"
          :handle="`.${$style.documentHandle}`"
          :drag-class="$style.isDragging"
        >
          <div
            :class="$style.document"
            v-for="(document, index) in model.documents"
            :key="document.id || document.type"
          >
            <Icon icon="drag-n-sort" :class="$style.documentHandle"/>
            <Checkbox state="switch" :label="`${index + 1}. ${document.name}`" v-model="model.documents[index].is_active"/>
          </div>
        </Draggable>
      </div>
      <div :class="$style.services" v-if="false && type === 'judicial'">
        <div :class="$style.heading">Выбор услуги</div>
        <div :class="$style.servicesList">
          <Checkbox
            v-for="service in services"
            :key="service.value"
            :state="['radio', 'dark']"
            v-model="model.services[service.value]"
            :label="service.label"
          />
        </div>
      </div>
      <div :class="$style.period" v-if="['judicial', 'pretrial'].includes(type)">
        <div :class="$style.heading">Период расчета</div>
        <Checkbox
          :class="$style.allPeriod"
          v-model="model.allPeriod"
          :state="['radio', 'black']"
          label="Весь период"
          @update:modelValue="dropPeriod"
        />
        <div :class="$style.periodFields">
          <DateInput :with-days="false" auto-day="first" v-model="model.from" :is-disabled="model.allPeriod" placeholder="С" />
          <DateInput :with-days="false" auto-day="last" v-model="model.to" :is-disabled="model.allPeriod" placeholder="По" />
        </div>
        <Checkbox v-if="type === 'judicial'" :class="$style.moratorium" v-model="model.moratorium_enabled" state="switch" label="Мораторий расчёта пени"/>
      </div>
      <div :class="$style.actions">
        <Btn :state="['tertiary', 'vertical']" :class="$style.action" type="submit" prepend-icon="printer">
          Формирование и печать
        </Btn>
        <Btn :state="['tertiary', 'vertical']" :class="$style.action" @click="signAndSend" prepend-icon="flash-drive" v-if="['judicial', 'pretrial'].includes(type)">
          Подписать и отправить по ЭЦП
        </Btn>
      </div>
    </form>
    <div :class="$style.hint" v-else>
      Выберите должника
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from '@vue/composition-api';
import SelectInput from "@/new/components/selectInput/SelectInput";
import Btn from "@/new/components/btn/Btn";
import Icon from "@/new/components/icon/Icon";
import Draggable from 'vuedraggable'
import {useDicts} from "@/new/hooks/useDicts";
import Checkbox from "@/new/components/checkbox/Checkbox";
import DateInput from "@/new/components/dateInput/DateInput";
import {baseURL} from "@/settings/config";
import {useToast} from "@/new/hooks/useToast";
import {asyncAction} from "@/new/utils/asyncAction";
import {useDialog} from "@/new/hooks/useDialog";
import {dateToApiDate} from "@/new/utils/date";
import {useStore} from "@/new/hooks/useStore";

export default defineComponent({
  name: "PrintDebtorsDialog",
  components: {
    DateInput,
    Checkbox,
    Icon,
    Btn,
    SelectInput,
    Draggable,
  },
  props: {
    allSelected: Boolean,
    selectedItems: Array,
    selectedItem: Number,
    type: String,
    filters: Object,
  },
  setup(props, {emit}) {
    const store = useStore();

    const model = ref({
      documents: [],
      services: {},
      allPeriod: true,
      from: null,
      to: null,
      moratorium_enabled: true,
    });

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

    const fetchAvailableDocuments = async () => {
      const currentResponse = await axios({
        method: 'get',
        url: `${baseURL}/document_attachments/company`,
        params: {
          production_type: props.type,
          company_id: store.getters['getDefaultCompanyId'],
        }
      });
      const accountResponse = await axios({
        method: 'get',
        url: `${baseURL}/api/account/document/`,
      });
      const {data: {attachments, productions}} = await axios({
        method: 'get',
        url: `${baseURL}/document_attachments/defaults/`,
      });

      model.value.documents = [
        ...currentResponse.data,
        ...accountResponse.data
          .filter(({can_be_attached, id}) => can_be_attached && (currentResponse.data.findIndex(d => d.id === id) === -1))
          .map(document => ({
            ...document,
            type: 'organisation',
            production_type: props.type,
          }))
      ]

      model.value.documents.push(...(
        productions[props.type].filter(type => (
          model.value.documents.findIndex(d => d.type === type) === -1
        )).map(type => ({
          type,
          name: attachments[type].name,
          is_active: false,
        }))
      ))
    }

    onMounted(fetchAvailableDocuments)

    const {
      services,
    } = useDicts();

    let printUnsubscribe;
    onBeforeUnmount(() => {
      // printUnsubscribe && printUnsubscribe()
    });
    const print = async () => {
      if (!isActive.value) {
        return;
      }

      await axios({
        method: 'post',
        url: `${baseURL}/document_attachments/company_bulk_create/`,
        params: props.allSelected ? {...props.filters, filters: props.filters} : {},
        data: {
          company_id: store.getters['getDefaultCompanyId'],
          production_type: props.type,
          attachments: model.value.documents.map((document, index) => ({
            ...document,
            order_number: index + 1,
          })),

          ...(props.allSelected ? {
            filters: props.filters,
            ...props.filters,
          } : {}),
        }
      });

      const {data: {id: requestId}} = await axios({
        method: 'post',
        url: `${baseURL}/document_attachments/generate_merged/`,
        params: props.allSelected ? {...props.filters, filters: props.filters} : {},
        data: {
          production_type: props.type,
          company_id: store.getters['getDefaultCompanyId'],
          debtor_ids: props.selectedItems || [props.selectedItem],
          ...(model.value.allPeriod ? {} : {
            date_from: dateToApiDate(model.value.from),
            date_to: dateToApiDate(model.value.to),
          }),
          moratorium_enabled: model.value.moratorium_enabled,

          ...(props.allSelected ? {
            filters: props.filters,
            ...props.filters,
          } : {}),
        }
      });

      await showToast({
        message: 'Формирование данных, ожидайте...',
        type: 'warning',
      });

      emit('close');

      const {promise, unsubscribe} = asyncAction(
        async () => (await axios({
          method: 'get',
          url: `${baseURL}/document_attachments/status/${requestId}/`
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
          message: 'Документ сформирован и отправлен на почту',
          type: 'success',
        })
        await showDialog({
          component: 'downloadFile',
          payload: {
            title: 'Работа с документами',
            url: file_pdf
          }
        })
      } catch (e) {
        await showToast({
          message: 'Ошибка формирования документов',
          type: 'error',
        })
      }
    }

    const signAndSend = async () => {
      if(!isActive.value) {
        return;
      }

      emit('close')
    }

    watch(services, s => {
      model.value.services = s.reduce((acc, {value}) => ({
        ...acc,
        [value]: false,
      }), {})
    }, {
      deep: true,
      immediate: true,
    });

    const dropPeriod = () => {
      model.value.from = null;
      model.value.to = null;
    }

    return {
      model,

      services,

      signAndSend,
      print,

      isActive,

      dropPeriod,
    }
  }
});
</script>

<style lang="scss" module>
@import "./printDebtorsDialog";
</style>
