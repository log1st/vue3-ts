<template>
  <div :class="$style.dialog">
    <div :class="$style.title">
      Работа с печатной формой подачи документов
    </div>
    <form
      v-if="isActive"
      @submit.prevent="print"
      :class="$style.form"
    >
      <div :class="$style.documents">
        <div :class="$style.heading">Список документов в приложении</div>
        <div :class="$style.documentsHeader">
          <Icon icon="eye" :class="$style.documentsIcon"/>
          <Icon icon="printer" :class="$style.documentsIcon"/>
          <div :class="$style.documentsLabel">
            Настройка печати
          </div>
        </div>
        <Draggable
          :class="$style.documentsList"
          v-model="model.documentsOrder"
          :handle="`.${$style.documentHandle}`"
          :drag-class="$style.isDragging"
        >
          <div
            :class="$style.document"
            v-for="(document, index) in model.documentsOrder"
            :key="document"
          >
            <Icon icon="drag-n-sort" :class="$style.documentHandle"/>
            <Checkbox state="switch" :label="`${index + 1}. ${documentTypesMap[document]}`" v-model="model.documents[document]"/>
          </div>
        </Draggable>
      </div>
      <div :class="$style.services">
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
      <div :class="$style.period">
        <div :class="$style.heading">Период расчета</div>
        <Checkbox
          :class="$style.allPeriod"
          v-model="model.allPeriod"
          :state="['radio', 'black']"
          label="Весь период"
          @update:modelValue="dropPeriod"
        />
        <div :class="$style.periodFields">
          <DateInput v-model="model.from" :is-disabled="model.allPeriod" placeholder="С" />
          <DateInput v-model="model.to" :is-disabled="model.allPeriod" placeholder="По" />
        </div>
        <Checkbox :class="$style.moratorium" v-model="model.moratorium" state="switch" label="Мораторий расчёта пени"/>
      </div>
      <div :class="$style.actions">
        <Btn :state="['tertiary', 'vertical']" :class="$style.action" @click="signAndSend" prepend-icon="flash-drive">
          Подписать и отправить по ЭЦП
        </Btn>
        <Btn :state="['tertiary', 'vertical']" :class="$style.action" type="submit" prepend-icon="printer">
          Формирование и печать
        </Btn>
      </div>
    </form>
    <div :class="$style.hint" v-else>
      Выберите должника
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, getCurrentInstance, onBeforeUnmount, ref, watch} from '@vue/composition-api';
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
  },
  setup(props, {emit}) {
    const model = ref({
      documents: {},
      documentsOrder: [],
      services: {},
      allPeriod: true,
      from: null,
      to: null,
      moratorium: true,
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

    let printUnsubscribe;
    onBeforeUnmount(() => {
      // printUnsubscribe && printUnsubscribe()
    });
    const print = async () => {
      if (!isActive.value) {
        return;
      }

      const {data: {id: requestId}} = await axios({
        method: 'post',
        url: `${baseURL}/document_attachments/generate_merged/`,
        data: {
          production_type: props.type,
          company_id: localStorage.getItem('defaultCompany'),
          debtor_ids: props.selectedItems || [props.selectedItem],
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

    const {
      documentTypes,
      documentTypesMap,

      services,
    } = useDicts();

    watch(documentTypes, types => {
      model.value.documents = types.reduce((acc, {value}) => ({
        ...acc,
        [value]: true
      }), {});
      model.value.documentsOrder = types.map(({value}) => value);
    }, {
      deep: true,
      immediate: true,
    });

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

      documentTypesMap,

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
