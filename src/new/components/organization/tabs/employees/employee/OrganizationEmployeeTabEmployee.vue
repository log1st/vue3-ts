<template>
  <tr>
    <td>
      <template v-if="isEditing">
        <div :class="$style.fields">
          <TextInput
            :class="$style.field"
            :state="['primary', 'dark', 'appended']"
            v-model="model.first_name"
            placeholder="Имя"
            :error="errorsMap.first_name"
          />
          <TextInput
            :class="$style.field"
            :state="['primary', 'dark', 'prepended']"
            v-model="model.last_name"
            placeholder="Фамилия"
            :error="errorsMap.last_name"
          />
        </div>
      </template>
      <template v-else>
        {{model.first_name}} {{model.last_name}}
      </template>
    </td>
    <td>
      <template v-if="isEditing">
        <SelectInput
          :state="['primary', 'dark']"
          v-model="model.position"
          :options="employeePositions"
          placeholder="Должность"
          :error="errorsMap.position"
        />
      </template>
      <template v-else>
        {{employeePositionsMap[model.position]}}
      </template>
    </td>
    <td>
      {{model.user_phone}}
    </td>
    <td>
      {{model.email}}
    </td>
    <td>
      <div :class="$style.actions" v-if="isGlobalEditing">
        <Icon icon="pencil" :class="[$style.action, $style.edit]" @click="toggleEditing" v-if="!isEditing"/>
        <Icon icon="check" :class="[$style.action, $style.submit]" v-if="isEditing" @click="submit"/>
        <Icon icon="close" :class="$style.action" v-if="isEditing" @click="stopEditing"/>
        <Icon icon="close" :class="[$style.action, $style.remove]" v-if="!isEditing" @click="remove"/>
      </div>
    </td>
  </tr>
</template>

<script>
import TextInput from "@/new/components/textInput/TextInput";
import Icon from "@/new/components/icon/Icon";
import {ref, watch, computed, inject} from "@vue/composition-api";
import SelectInput from "@/new/components/selectInput/SelectInput";
import {useDicts} from "@/new/hooks/useDicts";
import {useDialog} from "@/new/hooks/useDialog";
import {useErrors} from "@/new/hooks/useErrors";
import {baseURL} from "@/settings/config";
export default {
  name: "OrganizationEmployeeTabEmployee",
  components: {SelectInput, Icon, TextInput},
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    modelValue: Object,
  },
  setup(props) {
    const isGlobalEditing = inject('isEditing')
    const onSave = inject('onSave')
    const model = ref(JSON.parse(JSON.stringify(props.modelValue)));

    const isEditing = ref(false);
    const toggleEditing = () => {
      isEditing.value = true;
    };
    const stopEditing = () => {
      isEditing.value = false;
      model.value = JSON.parse(JSON.stringify(props.modelValue));
    }
    watch(isGlobalEditing, value => {
      if(!value) {
        stopEditing();
      }
    })

    watch(computed(() => props.modelValue), value => {
      model.value = JSON.parse(JSON.stringify(value))
    }, {
      deep: true,
      immediate: true
    });

    const {
      employeePositionsMap,
      employeePositions,
    } = useDicts();

    const {
      confirmDialog,
    } = useDialog();

    const remove = async () => {
      if(
        !(await confirmDialog({
          title: 'Удаление сотрудника',
          message: `Вы действительно хотите удалить сотрудника ${props.modelValue.first_name} ${props.modelValue.last_name}?`,
        })).result
      ) {
        return;
      }

      await axios({
        method: 'delete',
        url: `${baseURL}/api/account/employee/${props.modelValue.id}/`,
      });

      await onSave();
      isEditing.value = false;
    }

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors();

    const submit = async () => {
      clearErrors();

      try {
        await axios({
          method: 'patch',
          url: `${baseURL}/api/account/employee/${props.modelValue.id}/`,
          data: model.value,
        });

        await onSave();
        isEditing.value = false;
      } catch (e) {
        setErrors(
          Object.entries(e.response.data).reduce((acc, [key, [message]]) => ([
            ...acc,
            [key, message]
          ]), [])
        )
      }
    }

    return {
      model,

      employeePositions,
      employeePositionsMap,

      isGlobalEditing,
      isEditing,
      toggleEditing,
      stopEditing,

      errorsMap,

      remove,
      submit,
    }
  }
}
</script>

<style lang="scss" module>
@import "../organizationEmployeesTab";
</style>
