<template>
  <div :class="$style.owners">
    <table :class="$style.table">
      <tbody>
      <template  v-for="(account, index) in accounts">
        <tr :key="`${account.id}-header`" v-if="index === 0">
          <td :colspan="columns.length">
            <div :class="$style.fields">
              <div :class="$style.field">
                <div :class="$style.fieldLabel">Название банка</div>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="index === 0">
          <th v-for="column in columns" :key="column.key">
            {{column.label}}
          </th>
        </tr>
        <tr :key="`${account.id}-data`">
          <td v-for="column in columns" :key="column.key">
            <template v-if="column.key === '__actions'">
              <div :class="$style.actions">
                <Btn :class="$style.action" prepend-icon="eye" state="quinary" :url="document.file" target="_blank"/>
                <Btn :class="$style.action" prepend-icon="download" state="quinary" @click="downloadAccount(account)"/>
              </div>
            </template>
            <template v-else-if="getDeepField(account, column.key)">
              <template v-if="column.key.includes('date') && getDeepField(account, column.key)">
                {{formatDate(getDeepField(account, column.key))}}
              </template>
              <template v-else>
                {{getDeepField(account, column.key)}}
              </template>
            </template>
            <span v-else :class="$style.na">
              Н/Д
            </span>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import {defineComponent, ref, watch, computed} from "@vue/composition-api";
import {getDeepField} from "@/new/utils/object";
import Btn from "@/new/components/btn/Btn";
import {downloadFile} from "@/new/hooks/useFileManager";

export default defineComponent({
  name: "FsspBankAccountsDialog",
  components: {Btn},
  props: {
    id: [Number, String],
  },
  setup(props) {
    const columns = [
      {key: 'name', label: `Название кредитной
организации`},
      {key: 'address', label: 'Адрес'},
      {key: 'inn', label: 'ИНН'},
      {key: 'bik', label: 'БИК'},
      {key: 'kor_schet', label: 'Корреспондентский счет'},
      {key: 'number', label: '№ счета должника'},
      {key: 'taken', label: 'Взыскано'},
      {key: '__actions', label: ''},
    ];

    const accounts = ref([]);

    const fetchData = async () => {
      accounts.value = [{}]
    }

    watch(computed(() => props.id), fetchData, {
      immediate: true,
    })

    const downloadAccount = async (file) => {
      await downloadFile(file)
    }

    return {
      columns,
      accounts,
      getDeepField,
      downloadAccount,
    }
  }
})
</script>

<style lang="scss" module>
@import "./fsspBankAccountsDialog";
</style>
