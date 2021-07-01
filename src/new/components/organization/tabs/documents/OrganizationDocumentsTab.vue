<template>
  <div :class="$style.tab">
    <OrganizationDocumentsTabSigner v-model="signer" :class="$style.signer"/>
  </div>
</template>

<script>
import {computed, inject, ref, watch} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import TextInput from "@/new/components/textInput/TextInput";
import OrganizationDocumentsTabSigner
  from "@/new/components/organization/tabs/documents/signer/OrganizationDocumentsTabSigner";

export default {
  name: "OrganizationDocumentsTab",
  components: {OrganizationDocumentsTabSigner, TextInput},
  setup() {
    const data = inject('data');
    const isEditing = inject('isEditing');
    const onSave = inject('onSave');

    const documents = ref([]);
    const signer = ref(
      {
        "file": null,
        "signer": "",
        "signer_name": ""
      }
    );

    const fetchData = async () => {
      const {data: foundDocuments} = await axios({
        method: 'get',
        url: `${baseURL}/api/account/company/${data.value.id}/documents/`
      });
      documents.value = foundDocuments.filter(({signer}) => !signer)
      signer.value = foundDocuments.find(({signer}) => !!signer)
    }

    watch(computed(() => data.value.id), fetchData, {
      immediate: true
    });

    return {
      documents,
      signer,
      isEditing,
    }
  }
}
</script>

<style lang="scss" module>
@import "./organizationDocumentsTab";
</style>
