<template>
  <div class="cart__table">
    <div class="cart__table-head">
      <div class="cart__table-row">
        <div class="cart__table-col"><span>ФИО</span></div>
        <div class="cart__table-col"><span>Должность</span></div>
        <div class="cart__table-col"><span>Моб телефон</span></div>
        <div class="cart__table-col"><span>Email</span></div>
      </div>
    </div>
    <div class="cart__table-body">
      <div v-for="(worker, i) in workers"
        class="cart__table-row"
        @mouseover="currentRowHovered = i"
        @mouseleave="currentRowHovered = null"
        :key="'wrkrw' + i"
      >
        <div v-for="el in ['fullName', 'position', 'phone', 'email']" class="cart__table-col" :key="el"><span v-html="worker[el]"></span></div>
        <transition name="fade">
          <rowHoverActions v-if="currentRowHovered == i" :icons="actionsIcons" :elClass="i % 2 == 1 ? 'is-dark' : null" @setRowHoverAction="runActions($event)" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import rowHoverActions from '@/components/elements/RowHoverActions'
export default {
  components: { rowHoverActions },
  data () {
    return {
      currentRowHovered: null,
      actionsIcons: ['edit', 'close'],
      workers: [
        {
          fullName: 'Дорофеев Дмитрий Александрович',
          position: 'Зав. складом',
          phone: '+7 (968) 987-11-12',
          email: 'dummy@dummy.com'
        },
        {
          fullName: 'Дорофеев Дмитрий Александрович',
          position: 'Зав. складом',
          phone: '+7 (968) 987-11-12',
          email: 'dummy@dummy.com'
        }
      ]
    }
  },
  methods: {
    runActions (j) {
      // console.log(this.actionsIcons[j].name)
    }
  }
}
</script>
