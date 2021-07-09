<template>
    <div :class="$style.page">
      <div :class="$style.title">
        {{title}}
      </div>
      <div :class="$style.body">
        <div :class="$style.content">
          <div :class="$style.header">
            <SelectInput state="year" v-model="model.year" placeholder="Год" :options="years" :class="$style.year"/>
            <div :class="[$style.tab, $style.active]">Загрузить файлы</div>
            <div :class="[$style.tab, $style.disabled]">Интеграция по API</div>
          </div>
          <div :class="$style.main">
            <div :class="$style.modes">
              <div
                v-for="mode in modes"
                :key="mode.key"
                @click="selectMode(mode.key)"
                :class="[
                  $style.mode,
                  model.mode === mode.key && $style.active,
                ]"
              >
                {{mode.label}}
              </div>
            </div>
            <div :class="$style.periods">
              <div
                :class="[
                  $style.period,
                  model.period === period.key && $style.active,
                ]"
                v-for="period in periods"
                :key="period.key"
                @click="selectPeriod(period.key)"
              >
                {{period.label}}
              </div>
            </div>
            <div :class="$style.months" v-if="model.period === 'perMonth'">
              <DocumentField
                v-for="(month, index) in model.months"
                :key="month.month"
                :file.sync="model.months[index].file"
                :class="$style.month"
                :label="month.label"
                is-editable
                drop-zone
              />
            </div>
            <div :class="$style.files" v-if="model.period === 'all'" @drop.prevent="dropFiles" @dragover.prevent="showDropZone" @dragleave.prevent="hideDropZone">
              <div :class="$style.dropZone" v-if="isDropZoneVisible">
                <Icon icon="files" :class="$style.dropZoneIcon"/>
                <div :class="$style.dropZoneLabel">
                  Просто перетащите файлы
                </div>
              </div>
              <DocumentField
                v-for="(file, index) in model.files"
                :key="file.id"
                :file.sync="model.files[index].file"
                :class="$style.file"
                is-editable
                @remove="removeFile(index)"
              />
              <DocumentField
                @create="addFile"
                is-creator
                is-editable
                is-multiple
                :class="$style.file"
                v-if="!isDropZoneVisible"
              />
              <div :class="$style.removeWrapper">
                <div :class="$style.remove" v-if="model.files.length" @click="resetFiles">
                  <div :class="$style.removeLabel">Удалить всё</div>
                  <Icon icon="trash" :class="$style.removeIcon"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="$style.side">
          <div :class="$style.examples">
            <div :class="$style.examplesLabel">
              Скачайте на компьютер файл шаблона, сгенерированного программой Excel. Заполните его значениями
            </div>
            <div :class="$style.examplesType">
              <div :class="$style.examplesCaption">Каскадные шаблоны</div>
              <div :class="$style.examplesList">
                <ExchangeExamples :examples="cascadeExamples"/>
              </div>
            </div>
            <div :class="$style.examplesType">
              <div :class="$style.examplesCaption">Линейные шаблоны</div>
              <div :class="$style.examplesList">
                <ExchangeExamples :examples="linearExamples"/>
              </div>
            </div>
          </div>
          <Btn :is-disabled="isUploading" @click.prevent="submit" state="primary" :class="$style.action">
            <template v-if="isUploading">
              {{uploaded}} / {{total}} ({{Math.ceil(uploaded/total * 100)}}%)
            </template>
            <template v-else>
              Загрузить
            </template>
          </Btn>
        </div>
      </div>
    </div>
</template>

<script>
import {computed, inject, ref} from '@vue/composition-api';
import SelectInput from "@/new/components/selectInput/SelectInput";
import ExchangeExamples from "@/new/components/exchangeExamples/ExchangeExamples";
import DocumentField from "@/new/components/documentField/DocumentField";
import {formatMonth} from "@/new/utils/date";
import {setMonth} from "@/new/utils/dateFns";
import {getRandomString, ucFirst} from "@/new/utils/string";
import {convertFileToBase64} from "@/new/hooks/useFileManager";
import Icon from "@/new/components/icon/Icon";
import Btn from "@/new/components/btn/Btn";
import {baseURL} from "@/settings/config";

export default {
  name: "index",
  components: {Btn, Icon, DocumentField, ExchangeExamples, SelectInput},
  props: {
    type: String,
  },
  setup(props) {
    const params = computed(() => ({
      'payment-order': {
        title: 'Загрузить платёжные поручения',
        examples: {
          linear: [
            {
              type: 'csv',
              file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_CSV_5000.csv',
            },
            {
              type: 'xls',
              file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_10.xls',
            },
            {
              type: 'xlsx',
              file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLSX_10.xlsx',
            },
          ],
          cascade: [
            {
              type: 'csv',
              file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_CSV_5000.csv',
            },
            {
              type: 'xls',
              file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLS_10.xls',
            },
            {
              type: 'xlsx',
              file: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLSX_10.xlsx',
            },
          ],
        }
      }
    }[props.type]));

    const title = computed(() => params.value?.title);
    const linearExamples = computed(() => params.value?.examples?.linear || []);
    const cascadeExamples = computed(() => params.value?.examples?.cascade || []);

    const years = computed(() => (
      Array(100).fill(null).map((i, index) => (
        (new Date().getFullYear()) - index
      )).map((value) => ({
        value,
        label: value,
      }))
    ));

    const modes = computed(() => ([
      {
        key: 'table',
        label: 'Каскадный',
      },
      {
        key: 'linear',
        label: 'Линейный',
      },
    ]));

    const periods = computed(() => ([
      {
        key: 'perMonth',
        label: 'Загрузить по месяцам',
      },
      {
        key: 'all',
        label: 'Загрузить все',
      },
    ]));

    const model = ref({
      year: new Date().getFullYear(),
      mode: 'table',
      period: 'perMonth',
      months: [],
      files: [],
    });

    const selectMode = mode => {
      model.value.mode = mode;
    }

    const resetFiles = () => {
      model.value.months = Array(12).fill(null).map((i, index) => ({
        month: index + 1,
        file: null,
        label: ucFirst(formatMonth(setMonth(new Date, index)))
      }));
      model.value.files = [];
    }

    const selectPeriod = period => {
      model.value.period = period;
      resetFiles()
    }

    resetFiles();

    const addFile = async (file) => {
      model.value.files.push(
        ...(Array.isArray(file) ? file : [file]).map(f => ({
          id: getRandomString(),
          file: f,
        }))
      )
    }

    const removeFile = async (index) => {
      model.value.files.splice(index, 1)
    }

    const isDropZoneVisible = ref(false);
    const showDropZone = () => {
      isDropZoneVisible.value = true;
    }
    const hideDropZone = () => {
      isDropZoneVisible.value = false;
    }

    const dropFiles = async (e) => {
      hideDropZone();
      model.value.files.push(
        ...(await Promise.all(
          Array.from(e.dataTransfer.files).map(async file => ({
            id: getRandomString(),
            file: await convertFileToBase64(file),
          }))
        ))
      )
    }

    const globalModel = inject('globalModel');

    const isUploading = ref(false);
    const uploaded = ref(0);
    const total = ref(0);
    const submit = async () => {
      if(isUploading.value) {
        return;
      }
      isUploading.value = true;
      const toUpload = model.value.period === 'perMonth'
        ? model.value.months.filter(({file}) => ({
          file,
        })).map(({file, month}) => ({
          file,
          month,
        }))
        : model.value.files.map(({file}) => ({
          file,
        }))
      total.value = toUpload.length;

      await Promise.all(toUpload.map(async (file, index) => {
        try {
          await axios({
            method: 'post',
            url: `${baseURL}/api/datafile/upload/`,
            data: {
              ...file,
              company: globalModel.value.company,
              name: `file ${new Date().toLocaleString()} #${index}`,
              year: model.value.year,
              region: globalModel.value.region,
              module: {
                pretrial: 1,
                judicial: 2,
                executive: 3,
              }[props.type],
              mode: model.value.mode,
            },
          })
        } catch (e) {

        }
      }));
      isUploading.value = false;
    }

    return {
      isUploading,
      submit,
      uploaded,
      total,

      isDropZoneVisible,
      showDropZone,
      hideDropZone,

      removeFile,

      resetFiles,

      title,
      linearExamples,
      cascadeExamples,
      modes,
      selectMode,
      periods,
      selectPeriod,

      addFile,
      dropFiles,

      years,

      model,
    }
  }
}
</script>

<style lang="scss" module>
@import "./index";
</style>
