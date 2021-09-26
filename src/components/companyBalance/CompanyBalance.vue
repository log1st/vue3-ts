<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <div :class="$style.title">
        {{ t('title') }}
      </div>
      <div :class="$style.date">
        {{ t('date', {
          date: formatDate(new Date(), $i18n.locale)
        }) }}
      </div>
    </div>
    <div :class="$style.chart">
      <svg
        :class="$style.chartSource"
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_di)">
          <circle
            cx="130"
            cy="115"
            r="108"
            stroke="url(#paint0_linear)"
            stroke-width="14"
          />
        </g>
        <defs>
          <filter
            id="filter0_di"
            x="0"
            y="0"
            width="260"
            height="260"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood
              flood-opacity="0"
              result="BackgroundImageFix"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="15" />
            <feGaussianBlur stdDeviation="7.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset
              dx="5"
              dy="8"
            />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect2_innerShadow"
            />
          </filter>
          <linearGradient
            id="paint0_linear"
            x1="130"
            y1="0"
            x2="130"
            y2="230"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#07D6C1" />
            <stop
              offset="0.270833"
              stop-color="#25B2D4"
            />
            <stop
              offset="0.703125"
              stop-color="#5080CD"
            />
            <stop
              offset="1"
              stop-color="#6169BF"
            />
          </linearGradient>
        </defs>
      </svg>
      <div :class="$style.chartValue">
        {{ formatMoney(companyBalance?.balance, 'RUB', $i18n.locale) }}
      </div>
    </div>
    <div :class="$style.footer">
      <div :class="$style.balance">
        <div :class="$style.value">
          {{ formatMoney(companyBalance?.outcome, 'RUB', $i18n.locale) }}
        </div>
        <div :class="$style.hint">
          {{ t('hint') }}
        </div>
      </div>
      <Btn
        :to="{name: 'panel-finances'}"
        :class="$style.action"
      >
        {{ t('paidUp') }}
      </Btn>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, watch,
} from 'vue';
import { Company } from '@/hooks/useCompanies';
import { formatMoney } from '@/utils/string';
import { formatDate } from '@/utils/date';
import { useLocalI18n } from '@/hooks/useLocalI18n';
import Btn from '@/components/btn/Btn.vue';
import { CompanyBalance, useFinance } from '@/hooks/useFinance';
import { getAwaitFrame } from '@/utils/window';

export default defineComponent({
  name: 'CompanyBalance',
  components: { Btn },
  props: {
    company: Object as PropType<Company>,
  },
  setup(props) {
    const { t } = useLocalI18n('panel.index.balance');

    const {
      fetchCompanyBalance,
    } = useFinance();

    const id = computed(() => (
      props.company?.id
    ));

    const companyBalance = ref<CompanyBalance>();

    const fetchBalance = async () => {
      if (!id.value) {
        return;
      }
      const { status, response } = await fetchCompanyBalance({
        id: id.value,
      });

      if (status) {
        companyBalance.value = response;
      }
    };

    watch(id, getAwaitFrame(fetchBalance), {
      immediate: true,
    });

    return {
      t,
      formatDate,
      formatMoney,
      companyBalance,
    };
  },
});
</script>

<style lang="scss" module>
@import "./companyBalance";
</style>
