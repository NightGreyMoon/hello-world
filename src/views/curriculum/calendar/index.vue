<script setup lang="tsx">
import { count } from 'node:console';
import { NButton, NCalendar, NDatePicker, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { isBefore, subDays } from 'date-fns/esm';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { getClassRoomOptions, getCurriculumByClassRoom } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import ClassroomScheduleDrawer from './modules/classroom-schedule-drawer.vue';

const appStore = useAppStore();
const { formRef, validate, restoreValidation } = useNaiveForm();

const lessonOptions = ref<CommonType.Option<string>[]>([]);

async function getRoomOptions(search: string) {
  const { error, data } = await getClassRoomOptions(search); // TODO:改一下单页大小
  console.log(data);
  if (!error) {
    const options = data.map(item => ({
      label: `${item}`,
      value: `${item}`
    }));

    lessonOptions.value = [...options];
  }
}

onMounted(async () => {
  try {
    getRoomOptions('');
    handleUpdateValue();
  } catch (error) {
    console.error('Error fetching options:', error);
  }
});

type Model = Pick<
  Api.SystemManage.CurriculumSearchByClassRoomParams,
  'classRoom' | 'year' | 'month' | 'day' | 'drawerVisible'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    classRoom: '',
    drawerVisible: false
  };
}

function handleSearch(query: string) {
  if (!query.length) {
    getRoomOptions(query);
  }
}

const records = ref<Curriculum[]>([]);

// 选中教室后显示该教室课程日历
async function handleUpdateValue() {
  const today = dayjs();
  const { error, data } = await getCurriculumByClassRoom(model.classRoom, today.year(), today.month() + 1);
  console.log(data);
  records.value = data;
}

async function handelMonthChange(info: any) {
  const { error, data } = await getCurriculumByClassRoom(model.classRoom, info.year, info.month);
  console.log(data);
  records.value = data;
}

// 选中日期后显示该日期课程
function dateChanged(_: number, { year, month, date }: { year: number; month: number; date: number }) {
  model.year = year;
  model.month = month;
  model.day = date;
  model.drawerVisible = true;
}
</script>

<template>
  <div class="min-h-600px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.curriculum.common.title')" :bordered="false" size="small" class="card-wrapped">
      <template #header-extra>
        <NSelect
          v-model:value="model.classRoom"
          :options="lessonOptions"
          :placeholder="$t('page.curriculum.form.classRoom')"
          filterable
          clearable
          @search="handleSearch"
          @update:value="handleUpdateValue"
        />
      </template>
      <NScrollbar style="max-height: 900px">
        <NCalendar
          v-model:value="value"
          #="{ year, month, date }"
          :on-panel-change="handelMonthChange"
          @update:value="dateChanged"
        >
          <ul v-if="records.length > 0">
            <template v-for="(item, index) in records" :key="index">
              <li v-if="item.day === date && item.month === month">
                <NTag :bordered="false" type="warning" style="margin-top: 5px">
                  <NTime :time="item.startTimeStamp" format="HH:mm"></NTime>
                  -
                  <NEllipsis style="max-width: 140px">{{ item.lessonName }}</NEllipsis>
                </NTag>
              </li>
            </template>
          </ul>
        </NCalendar>
      </NScrollbar>
      <ClassroomScheduleDrawer
        v-model:visible="model.drawerVisible"
        v-model:classroom="model.classRoom"
        v-model:month="model.month"
        v-model:day="model.day"
        v-model:year="model.year"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
