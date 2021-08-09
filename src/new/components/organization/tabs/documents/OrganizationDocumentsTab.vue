<template>
  <div :class="$style.tab">
    <OrganizationDocumentsTabSigner v-model="signer" :class="$style.signer" :errors="pickErrors('signer')" :is-editable="isEditing"/>
    <div :class="$style.documents">
      <DocumentField
        :class="$style.document"
        v-for="(document, index) in documents"
        :key="document.id"
        :file.sync="documents[index].file"
        :name.sync="documents[index].name"
        @remove="removeDocument(index)"
        with-name
        :errors="pickErrors(index)"
        :is-editable="isEditing"
      />
      <DocumentField
        is-editable
        is-creator
        @create="addDocument"
        :class="$style.document"
        v-if="isEditing"
      />
    </div>
    <Pagination :total="total" :limit.sync="limit" :page.sync="page" :class="$style.pagination"/>
    <div :class="$style.actions" v-if="isEdited">
      <Btn :class="$style.action" state="secondary" label="Отмена" @click="reset"/>
      <Btn :class="$style.action" state="primary" label="Сохранить" @click="submit"/>
    </div>
  </div>
</template>

<script>
import {computed, inject, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import TextInput from "@/new/components/textInput/TextInput";
import OrganizationDocumentsTabSigner
  from "@/new/components/organization/tabs/documents/signer/OrganizationDocumentsTabSigner";
import DocumentField from "@/new/components/documentField/DocumentField";
import {useStore} from "@/new/hooks/useStore";
import Btn from "@/new/components/btn/Btn";
import {useErrors} from "@/new/hooks/useErrors";
import {useToast} from "@/new/hooks/useToast";
import Pagination from "@/new/components/pagination/Pagination";

export default {
  name: "OrganizationDocumentsTab",
  components: {Btn, DocumentField, OrganizationDocumentsTabSigner, TextInput, Pagination},
  props: {
    companyId: Number
  },
  setup(props) {
    const data = inject('data');
    const isEditing = ref(true);
    const onSave = inject('onSave');

    const getDefaultSigner = () => ({
      "file": null,
      "signer": "",
      "signer_name": "",
      "klass": "attorney",
      "name": "",
      "company": props.companyId
    })

    const originalDocuments = ref({});
    const documents = ref([]);
    const signer = ref(getDefaultSigner());

    const isEdited = ref(false);
    watch(documents, () => {
      isEdited.value = true;
    }, {
      deep: true,
    });
    watch(signer, () => {
      isEdited.value = true;
    }, {
      deep: true,
    });

    const toRemove = ref([]);

    const total = ref(0);
    const limit = ref(1);
    const page = ref(1);

    const fetchData = async () => {
      documents.value = [];
      signer.value = null;

      const {data: {results: f}} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/document/`,
        params: {
          company_id: data.value.id,
          limit: 1,
          klass: 'attorney'
        }
      });
      signer.value = f[0] || null;

      let {data: {count, results: foundDocuments}} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/document/`,
        params: {
          company_id: data.value.id,
          limit: limit.value,
          offset: (page.value - 1) * limit.value,
          klass_not: 'attorney'
        }
      });
      total.value = count;
      foundDocuments = foundDocuments.map(document => ({
        ...document,
      }))
      originalDocuments.value = JSON.parse(JSON.stringify(foundDocuments)).reduce((acc, cur) => ({
        ...acc,
        [cur.id]: cur
      }), {});
      documents.value = foundDocuments.filter(({signer}) => !signer);
      await new Promise(requestAnimationFrame)
      isEdited.value = false;
    }

    const reset = async () => {
      toRemove.value = [];
      originalDocuments.value = {};
      await fetchData()
    }

    watch(isEditing, (value) => {
      if(!value) {
        reset();
      }
    })

    const { errorsMap, addErrors, clearErrors, pickErrors } = useErrors();
    const {showToast} = useToast();

    const submit = async () => {
      await new Promise(requestAnimationFrame);
      clearErrors();

      await Promise.all(([
        ...toRemove.value,
        ...(!signer.value.file && signer.value.id ? [
          signer.value.id
        ] : []),
      ]).filter(Boolean).map(id => new Promise(resolve => {
        try {
          axios({
            url: `${baseURL}/api/account/document/${id}/`,
            method: 'delete',
          }).then(resolve)
        } catch (e) {
          showToast({
            message: `Не удалось удалить #${id}`,
            type: 'error',
          });
        }
      })));

      const res = await Promise.all([
        ...documents.value,
        ...(signer.value.file ? [
          signer.value
        ] : [])
      ].map((data, index) => {
        return new Promise(async resolve => {
          const newPayload = data.id ? (
            Object.keys(data).filter(key => data[key] !== originalDocuments.value[data.id][key]).reduce((acc, cur) => ({
              ...acc,
              [cur]: data[cur]
            }), {})
          ) : data;

          if(!Object.keys(newPayload).length) {
            resolve()
            return;
          }

          try {
            await axios({
              url: `${baseURL}/api/account/document/${data.id ? `${data.id}/` : ''}`,
              method: data.id ? 'patch' : 'post',
              data: newPayload,
            });
            resolve(true);
          } catch (e) {
            if(e?.response?.data) {
              addErrors(Object.entries(e?.response?.data).reduce((acc, [field, errors]) => ([
                ...acc,
                ...errors.map(error => [`${data.signer ? 'signer' : index}-${field}`, error])
              ]), []))
            } else {
              showToast({
                message: `Не удалось сохранить файл ${data.signer || data.name || `#${index + 1}`}`,
                type: 'error',
              });
            }
            resolve(false);
          }
        })
      }));

      if(res.includes(false)) {
        return;
      }

      isEdited.value = false;
      await fetchData()

      await onSave();
    }

    watch(computed(() => data.value.id), fetchData, {
      immediate: true
    });

    const store = useStore();

    const addDocument = (file) => {
      documents.value.push({
        name: "",
        file,
        description: "",
        klass: "default",
        company: props.companyId,
        signer: null,
        signer_name: null
      })
    }

    const removeDocument = (index) => {
      toRemove.value.push(documents.value[index].id)
      documents.value.splice(index, 1)
    }

    watch(limit, fetchData);
    watch(page, fetchData);

    return {
      documents,
      signer,
      isEditing,

      addDocument,
      removeDocument,

      isEdited,
      reset,
      submit,

      errorsMap,
      pickErrors,

      total,
      limit,
      page,
    }
  }
}
</script>

<style lang="scss" module>
@import "./organizationDocumentsTab";
</style>
