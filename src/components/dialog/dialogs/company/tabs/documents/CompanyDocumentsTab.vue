<template>
  <form
    :class="$style.tab"
    @submit.prevent="submit"
  >
    <CompanyDocumentsSigner
      v-model="signer"
      :class="$style.signer"
      :is-editing="localIsEditing"
      @remove="resetSigner"
    />
    <div :class="$style.documents">
      <FileField
        v-for="(document, index) in documents"
        :key="document.id || `new-${index}`"
        v-model:file="document.file"
        v-model:name="document.name"
        with-name
        :is-editing="localIsEditing"
        drop-zone
        :class="$style.document"
        :accept="['application/pdf']"
        @remove="documents.splice(index, 1)"
      />
      <FileField
        v-if="isEditing"
        :key="'creator'"
        is-creator
        drop-zone
        is-multiple
        is-editing
        :accept="['application/pdf']"
        :class="$style.document"
        @create="createDocuments"
      />
    </div>
    <div
      v-if="isEditing"
      :class="$style.actions"
    >
      <Btn
        state="tertiary"
        :label="t('company.documents.reset')"
        :class="$style.action"
        @click="reset"
      />
      <Btn
        state="primary"
        :label="t('company.documents.submit')"
        type="submit"
        :class="$style.action"
      />
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed, defineComponent, onUnmounted, PropType, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import CompanyDocumentsSigner
  from '@/components/dialog/dialogs/company/tabs/documents/signer/CompanyDocumentsSigner.vue';
import { Company } from '@/hooks/useCompanies';
import { useActiveTable } from '@/hooks/useActiveTable';
import {
  AccountDocument,
  AccountDocumentClass,
  getEmptyAccountDocument,
  useAccountDocuments,
} from '@/hooks/useAccountDocuments';
import { ActiveFormField, ActiveFormFieldType } from '@/hooks/useActiveForm';
import { SignalType, useSignal } from '@/hooks/useSignal';
import FileField from '@/components/documentField/DocumentField.vue';
import { awaitFrame, getAwaitFrame } from '@/utils/window';
import { useLocalValue } from '@/hooks/useLocalValue';
import Btn from '@/components/btn/Btn.vue';
import { IToastLevel, useToast } from '@/hooks/useToast';

export default defineComponent({
  name: 'CompanyDocumentsTab',
  components: { Btn, FileField, CompanyDocumentsSigner },
  props: {
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
    isEditing: Boolean as PropType<boolean>,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const localIsEditing = useLocalValue(props, 'isEditing', emit);

    const reset = async () => {
      await awaitFrame();
      localIsEditing.value = false;
    };

    const {
      fetchAccountDocuments,
      removeAccountDocument,
      updateAccountDocument,
      createAccountDocument,
    } = useAccountDocuments();

    const {
      records: documents,
      fetchData,
    } = useActiveTable<AccountDocument, AccountDocument, 'id'>({
      keyField: 'id',
      fetch: async ({ params, signal }) => {
        const { response } = await fetchAccountDocuments({ ...params, signal });

        return response;
      },
      // @TODO Удалить после апдейта бэка
      defaultLimit: ref(10000),
      filters: computed<Array<ActiveFormField<AccountDocument>>>(() => ([
        {
          key: 'company_id',
          field: 'company_id',
          type: ActiveFormFieldType.input,
          defaultValue: props.company.id,
        },
        {
          key: 'klass_not',
          field: 'klass_not',
          type: ActiveFormFieldType.input,
          defaultValue: AccountDocumentClass.attorney,
        },
      ])),
    });

    const existingSignerId = ref<AccountDocument['id']>();
    const signer = ref<AccountDocument>(
      getEmptyAccountDocument(props.company.id, AccountDocumentClass.attorney),
    );
    watch(computed(() => [props.company.id, localIsEditing.value]), async ([companyId]) => {
      existingSignerId.value = null;
      getEmptyAccountDocument(companyId as number, AccountDocumentClass.attorney);
      const { status, response } = await fetchAccountDocuments({
        limit: 1,
        page: 1,
        filters: {
          klass: AccountDocumentClass.attorney,
        },
      });
      if (status) {
        if (response.results.length) {
          const newSigner = response.results[0];
          signer.value = newSigner;
          existingSignerId.value = newSigner.id;
        }
      }
    }, {
      deep: true,
      immediate: true,
    });

    const existingDocumentsIds = ref<Array<AccountDocument['id']>>([]);
    watch(documents, (newDocuments) => {
      existingDocumentsIds.value = newDocuments.map(({ id }) => id);
    }, {
      immediate: true,
    });

    const {
      subscribeToSignal,
    } = useSignal();

    onUnmounted(
      subscribeToSignal([
        SignalType.accountDocumentCreated,
        SignalType.accountDocumentUpdated,
        SignalType.accountDocumentDeleted,
      ], async ({ companyId }: {companyId: Company['id']}) => {
        if (companyId === props.company.id) {
          await fetchData();
        }
      }),
    );

    const resetSigner = () => {
      signer.value = getEmptyAccountDocument(props.company.id, AccountDocumentClass.attorney);
    };

    const createDocuments = (files: Array<{ file: string; name: string }>) => {
      documents.value.push(
        ...files.map((file) => ({
          ...getEmptyAccountDocument(props.company.id),
          file: file.file,
          name: file.name,
        })),
      );
    };

    watch(computed(() => localIsEditing.value), getAwaitFrame(fetchData));

    const {
      showToast,
    } = useToast();

    const submit = async () => {
      if ((signer.value.signer || signer.value.signer_name) && !signer.value.file) {
        await showToast({
          message: 'company.documents.noSignerFile',
          level: IToastLevel.warning,
        });
        return;
      }
      const toDelete = existingDocumentsIds.value.filter((id) => (
        documents.value.findIndex((document) => document.id === id) === -1
      ));

      const toUpdate = documents.value.filter(({ id }) => !!id);
      const toCreate = documents.value.filter(({ id }) => !id);

      // @TODO отловить ошибки валидации
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responses = await Promise.all<any>([
        ...toDelete.map(async (id) => (
          removeAccountDocument({ id })
        )),
        ...toUpdate.map(async (document) => (
          updateAccountDocument({
            id: document.id,
            payload: document,
          })
        )),
        ...toCreate.map(async (document) => (
          createAccountDocument(document)
        )),
        ...(existingSignerId.value && !signer.value.id ? [
          removeAccountDocument({
            id: existingSignerId.value!,
          }),
        ] : []),
        ...(!existingSignerId.value && signer.value.file ? [
          createAccountDocument(signer.value),
        ] : []),
        ...(existingSignerId.value && signer.value.file ? [
          updateAccountDocument({
            id: existingSignerId.value!,
            payload: signer.value!,
          }),
        ] : []),
      ]);
      localIsEditing.value = false;
    };

    return {
      signer,
      documents,
      resetSigner,
      createDocuments,
      localIsEditing,
      reset,
      submit,
      t,
      existingSignerId,
      existingDocumentsIds,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyDocumentsTab";
</style>
