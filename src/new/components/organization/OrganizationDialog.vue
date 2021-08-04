<template>
  <div :class="$style.dialog">
    <div :class="[
      $style.edit,
      isEditing && $style.active
    ]" @click="toggleEditing">
      <div :class="$style.editLabel" v-if="isEditing">Режим редактирования</div>
      <Icon icon="pencil" :class="$style.editIcon" />
    </div>
    <Icon icon="loader" spin v-if="isLoading" :class="$style.loader"></Icon>
    <div :class="$style.title" v-if="!data">
      Компания
    </div>
    <template v-else>
      <div :class="$style.title">
        {{data.name_full}}
      </div>
      <div :class="$style.tabs">
        <div
          :class="[
            $style.tab,
            activeTab.key === tab.key && $style.activeTab
          ]"
          v-for="tab in tabs"
          :key="tab.key"
          @click="selectTab(tab)"
        >
          <div :class="$style.tabLabel">
            {{tab.label}}
          </div>
          <Icon :icon="tab.icon" :class="$style.tabIcon"/>
        </div>
      </div>
      <div :class="$style.content">
        <component :is="activeTab.component" :company-id="id"/>
      </div>
    </template>
  </div>
</template>

<script>
import {ref, watch, computed, defineComponent, provide, inject} from "@vue/composition-api";
import {baseURL} from "@/settings/config";
import Rating from "@/new/components/rating/Rating";
import Icon from "@/new/components/icon/Icon";
import OrganizationCommonTab from "@/new/components/organization/tabs/common/OrganizationCommonTab";
import OrganizationEmployeesTab from "@/new/components/organization/tabs/employees/OrganizationEmployeesTab";
import OrganizationDocumentsTab from "@/new/components/organization/tabs/documents/OrganizationDocumentsTab";

export default defineComponent({
  name: "OrganizationDialog",
  components: {Icon, Rating},
  props: {
    id: Number,
    isInitialEdit: Boolean,
  },
  setup(props, {emit}) {
    const data = ref();
    const onSave = async () => {
      await fetchData()
    }

    const isEditing = ref(props.isInitialEdit);
    const toggleEditing = async () => {
      await new Promise(requestAnimationFrame)
      isEditing.value = !isEditing.value;
      if(!isEditing.value) {
        data.value = {...data.value}
      }
    }
    const stopEditing = async () => {
      await new Promise(requestAnimationFrame)
      isEditing.value = false;
    }

    provide('data', data);
    provide('isEditing', isEditing);
    provide('stopEditing', stopEditing);
    provide('onSave', onSave);

    const isLoading = ref(false);

    const fetchData = async () => {
      if(isLoading.value) {
        return;
      }
      isLoading.value = true;
      const response = await axios({
        method: 'get',
        url: `${baseURL}/api/account/company/${props.id}/`,
      });
      data.value = response.data;
      isLoading.value = false;
    };

    watch(computed(() => props.id), async () => {
      await new Promise(requestAnimationFrame);
      await fetchData()
    }, {
      immediate: true,
    });

    const tabs = computed(() => ([
      {
        key: 'common',
        label: 'Общая информация',
        icon: 'info',
        component: OrganizationCommonTab,
      },
      {
        key: 'employees',
        label: 'Сотрудники',
        icon: 'users',
        component: OrganizationEmployeesTab,
      },
      {
        key: 'documents',
        label: 'Документы',
        icon: 'documents',
        component: OrganizationDocumentsTab,
      },
    ].filter(Boolean)));

    const activeTab = ref(tabs.value[0]);
    const selectTab = tab => {
      activeTab.value = tab;
    }

    return {

      isLoading,
      data,

      activeTab,
      selectTab,
      tabs,

      isEditing,
      toggleEditing,
      stopEditing,
    }
  }
})
</script>

<style lang="scss" module>
@import "./organizationDialog";
</style>
