<template>
  <form @submit.prevent="submit" :class="$style.form">
    <div :class="$style.headline">Общие данные организации</div>
    <div :class="$style.blocks">
      <div :class="$style.block" v-for="block in blocks" :key="block.key">
        <div :class="$style.title">
          {{block.title}}
        </div>
        <div :class="$style.fields">
          <div :class="[
            $style.field,
            isEditing && ((typeof field.isEditable === 'undefined') || !!field.isEditable) && $style.editingField
          ]" v-for="field in block.fields" :key="field.key">
            <div :class="$style.label">
              {{field.label}}
              <div :class="$style.labelAction" v-if="isEditing && [
                'postal_address_zip_code',
                'physical_address'
              ].includes(field.key) && model[field.key] !== model.legal_address"
                @click="presetAddress(field.key)"
              >Как юр. адрес</div>
            </div>
            <template v-if="isEditing && ((typeof field.isEditable === 'undefined') || !!field.isEditable)">
              <div :class="$style.input">
                <FilterConfig
                  :type="field.type || 'text'"
                  :props="field.props || {placeholder: field.label, delay: 0, error: errorsMap[field.key]}"
                  v-model="model[field.key]"
                />
              </div>
            </template>
            <template v-else>
              <div :class="$style.value">
                {{getDeepField(model, field.key)}}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.actions" v-if="isEditing">
      <Btn state="secondary" label="Отменить" @click="reset" :class="$style.action"/>
      <Btn state="primary" label="Сохранить" type="submit" :class="$style.action"/>
    </div>
  </form>
</template>

<script>
import {computed, getCurrentInstance, inject, ref, watch} from "@vue/composition-api";
import TextInput from "@/new/components/textInput/TextInput";
import FilterConfig from "@/new/components/filter/FilterConfig";
import {getDeepField} from "@/new/utils/object";
import Btn from "@/new/components/btn/Btn";
import {baseURL} from "@/settings/config";
import {useToast} from "@/new/hooks/useToast";
import {useErrors} from "@/new/hooks/useErrors";

export default {
  name: "OrganizationCommonTab",
  components: {Btn, FilterConfig, TextInput},
  setup() {
    const source = inject('data');
    const onSave = inject('onSave');
    const isEditing = inject('isEditing');
    const stopEditing = inject('stopEditing');

    const model = ref({});
    watch(source, (value) => {
      model.value = JSON.parse(JSON.stringify(value))
    }, {
      immediate: true,
      deep: true,
    });

    const reset = async () => {
      await new Promise(requestAnimationFrame);
      stopEditing();
      model.value = JSON.parse(JSON.stringify(source.value));
    }

    const {
      errorsMap,
      setErrors,
      clearErrors,
    } = useErrors();

    const {
      showToast,
    } = useToast();

    const submit = async () => {
      clearErrors();

      const fields = blocks.value.reduce((acc, {fields}) => ([
        ...acc,
        ...fields.map(({key}) => key)
      ]), []);
      const editableFields = fields.filter(field => (
        model.value[field] !== source.value[field]
      ));
      const patchModel = editableFields.reduce((acc, field) => ({
        ...acc,
        [field]: model.value[field]
      }), {});

      try {
        await axios({
          method: 'patch',
          url: `${baseURL}/api/account/company/${model.value.id}/`,
          data: patchModel,
        });

        await showToast({
          message: 'Данные компании сохранены',
          type: 'success',
        })

        stopEditing();

        await onSave();
      } catch (e) {
        setErrors(
          Object.entries(e.response.data).reduce((acc, [key, [message]]) => ([
            ...acc,
            [key, message]
          ]), [])
        )
      }
    }

    const blocks = computed(() => ([
      {
        key: 'name',
        title: 'Название',
        fields: [
          {
            key: 'name_full',
            label: 'Полное наименование',
            isEditable: false
          },
          {
            key: 'name_short',
            label: 'Сокращенное наименование',
            isEditable: false
          },
        ]
      },
      {
        key: 'activity',
        title: 'Деятельность',
        fields: [
          {
            key: 'type',
            label: 'Тип организации',
            isEditable: false
          },
          {
            key: 'okopf',
            label: 'ОКОПФ',
            isEditable: false
          },
          {
            key: 'taxation_system',
            label: 'Система налогообложения',
            type: 'select',
            props: {
              options: [
                {
                  value: 'osn',
                  label: 'Общая система налогооблажения',
                },
                {
                  value: 'usn',
                  label: 'Упрощённая система налогооблажения'
                }
              ]
            }
          },
          {
            key: 'type_peni_calculation',
            label: 'Тип расчета пени',
            type: 'select',
            props: {
              options: [
                {
                  value: 155,
                  label: '155 ЖК РФ',
                },
                {
                  value: 394,
                  label: '394 ГК РФ'
                }
              ]
            }
          },
        ]
      },
      {
        key: 'contacts',
        title: 'Контакты',
        fields: [
          {
            key: 'phone',
            label: 'Телефон',
          },
          {
            key: 'fax',
            label: 'Факс',
          },
          {
            key: 'site',
            label: 'Сайт',
          },
          {
            key: 'email',
            label: 'E-mail приемной'
          },
          {
            key: 'email_buh',
            label: 'E-mail бухгалтерии',
          },
        ]
      },
      {
        key: 'direction',
        title: 'Дирекция',
        fields: [
          {
            key: 'director',
            label: 'Генеральный директор',
            isEditable: false
          },
          {
            // @TODO
            key: 'some_unknown_field',
            label: 'Основание полномочий подписанта',
            isEditable: false
          },
          {
            key: 'representative_power_attorney',
            label: 'Представитель по доверенности',
          },
        ]
      },
      {
        key: 'addresses',
        title: 'Адреса',
        fields: [
          {
            key: 'legal_address',
            label: 'Юридический адрес',
            isEditable: false
          },
          {
            key: 'physical_address',
            label: 'Фактический адрес',
          },
          {
            key: 'postal_address_zip_code',
            label: 'Почтовый индекс',
          },
        ]
      },
      {
        key: 'requisites',
        title: 'Реквизиты',
        fields: [
          {
            key: 'fns_full_info.ЮЛ.ИНН',
            label: 'ИНН',
            isEditable: false
          },
          {
            key: 'kpp',
            label: 'КПП',
            isEditable: false
          },
          {
            key: 'ogrn',
            label: 'ОГРН',
            isEditable: false
          },
          {
            key: 'ras_schet',
            label: 'Расчетный счет',
          },
          {
            key: 'bic',
            label: 'БИК',
          },
          {
            key: 'full_name_bank',
            label: 'Полное наименование банка',
            isEditable: false
          },
          {
            key: 'kor_schet',
            label: 'Корреспондентский счет',
            isEditable: false
          },
        ]
      },
    ]));

    const presetAddress = async key => {
      await new Promise(requestAnimationFrame);
      model.value[key] = model.value.legal_address
    }

    return {
      model,

      blocks,
      getDeepField,

      reset,
      submit,

      errorsMap,

      isEditing,

      presetAddress,
    }
  }
}
</script>

<style lang="scss" module>
@import "./organizationCommonTab";
</style>
