<template>
  <div class="d-data__content">
    <div class="d-data__content-table history">
      <table>
        <tbody>
        <tr>
          <th style="text-align: left">№</th>
          <th style="text-align: left">Назание</th>
          <th>Дата и время</th>
          <th style="text-align: left">Статус</th>
        </tr>
        <tr v-for="(item, i) in historyComputed" :key="i + 'sjdf22'" class="">
          <td style="text-align: left">{{ i + 1 }}</td>
          <td style="text-align: left">
            <template v-if="item.title === 'Печать заявления'">
              Печать <a href="javascript:void(0)" @click.stop="redirectToDocument(item)">заявления</a>
            </template>
            <template v-else-if="item.title === 'Печать бланка ПД-4сб'">
              Печать <a href="javascript:void(0)" @click.stop="redirectToDocument(item)">бланка ПД-4сб</a>
            </template>
            <span v-else >{{ item.title }}</span> 
          </td>
          <td>{{ item.datetime | formatDate }}</td>
          <td class="status" style="text-align: left">{{ item.status }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style>
  .d-data__content-table.history th, .d-data__content-table.history td {
    text-align: start;
  }
</style>
<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  export default {
    props: {
      params: {
        type: Object
      }
    },
    methods: {
      updateHistoryTable() {
        const debtor = this.debtorsCourtProceedings.find(d => d.RashSchet == this.params.RashSchet);
        this.history = debtor.FullHistoryActions;
      },
      redirectToDocument (item) {
        this.$emit('changeTab', { index: 1,  payload: item });
      }
    },
    data() {
      return {
        history: []
      }
    },
    filters: {
      formatDate: function (value) {
        if(value instanceof Date) {
          return moment(value).format('DD.MM.YYYY HH:mm');
        }
        if (!value) return '' // value = "14.07.2020 21:53" или "2020-06-05 T17:10:43.104Z"
        // дальше будет костыль - спасибо унификации бэкенда
        if(value.includes('-')) {
          return moment(value).format('DD.MM.YYYY HH:mm');
        }
        return moment(value * 1000).format('DD.MM.YYYY HH:mm');
      }
    },
    computed: {
      ...mapGetters(['debtorsCourtProceedings']),
      historyComputed () {
        return Object.values(this.history).map(h => {
          return {
            title: h.Names,
            datetime: h.DataTime,
            status: h.Status
          }
        }).reverse();
      }
    },
    watch: {
      debtorsCourtProceedings: {
        deep: true,
        handler() {
          this.updateHistoryTable();
        }
      }
    },
    created() {
      this.updateHistoryTable();
    }
  }
</script>
