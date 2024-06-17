<script setup lang="tsx">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { NEmpty, NRadioGroup, useDialog, useMessage } from 'naive-ui';
import dayjs, { Dayjs } from 'dayjs';
import { useAppStore } from '@/store/modules/app';
import { getCurriculumByTeacherAndDate, getRecenDates } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const appStore = useAppStore();

const dateOptions = ref<DateOptions[]>();

const curriculums = ref<Curriculum[]>();

const defaultTimeStamp = ref(0);

const dateIndex = ref(Dayjs);

const message = useMessage();
const dialog = useDialog();
const { routerPushByKey } = useRouterPush();

async function getDateOptions(year: number, month: number, day: number) {
  const { error, data } = await getRecenDates(5, year, month + 1, day);
  if (!error) {
    dateOptions.value = data;
    defaultTimeStamp.value = data[0].timeStamp;
  } else {
    console.error(error);
  }
}

function checkCurriculum(id: number) {
  dialog.success({
    title: '跳转确认',
    content: `即将跳转去新页面查看上课记录`,
    positiveText: 'OK',
    onPositiveClick: () => {
      routerPushByKey('curriculum_curriculum', { query: { id: `${id}` } });
    }
  });
}

async function back() {
  dateIndex.value = dateIndex.value.subtract(1, 'day');
  getDateOptions(dateIndex.value.year(), dateIndex.value.month(), dateIndex.value.date());
}

async function forward() {
  dateIndex.value = dateIndex.value.add(1, 'day');
  getDateOptions(dateIndex.value.year(), dateIndex.value.month(), dateIndex.value.date());
}

// 切换日期后获取指定日期的课表
async function dateChanged(date: number) {
  defaultTimeStamp.value = date;
  const dateSelected = dayjs(date);
  const { error, data } = await getCurriculumByTeacherAndDate(
    3, // TODO: 后面要换成当前登录老师账号
    dateSelected.year(),
    dateSelected.month() + 1,
    dateSelected.date()
  );
  if (!error) {
    curriculums.value = data;
  }
}

// 页面加载时获取当前日期的课表
async function loadToday() {
  const dateSelected = dayjs(defaultTimeStamp.value);
  const { error, data } = await getCurriculumByTeacherAndDate(
    3, // TODO: 后面要换成当前登录老师账号
    dateSelected.year(),
    dateSelected.month() + 1,
    dateSelected.date()
  );
  if (!error) {
    curriculums.value = data;
  }
}

watch(defaultTimeStamp, () => {
  if (defaultTimeStamp.value > 0) {
    loadToday();
  }
});

onMounted(async () => {
  try {
    dateIndex.value = dayjs();
    getDateOptions(dateIndex.value.year(), dateIndex.value.month(), dateIndex.value.date());
  } catch (error) {
    console.error('Error fetching options:', error);
  }
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NSpace justify="center">
      <NButton circle @click="back">
        <template #icon>
          <icon-ic-round-arrow-back class="text-icon" />
        </template>
      </NButton>
      <NRadioGroup v-model:value="defaultTimeStamp" name="dateRadio" :on-update-value="dateChanged">
        <NRadioButton
          v-for="(dateOption, index) in dateOptions"
          :key="dateOption.timeStamp"
          :value="dateOption.timeStamp"
        >
          {{ dateOption.month }}-{{ dateOption.day }}
          <!--
 <br />
          {{ dateOption.dayOfWeek }} 
-->
        </NRadioButton>
      </NRadioGroup>
      <NButton circle @click="forward">
        <template #icon>
          <icon-ic-round-arrow-forward />
        </template>
      </NButton>
    </NSpace>
    <NList v-if="curriculums?.length > 0" hoverable clickable>
      <NListItem v-for="curriculum in curriculums" :key="curriculum.id" @click="checkCurriculum(curriculum.id)">
        <template #prefix>
          <NButton type="primary" ghost style="height: 70px">
            {{ dayjs(curriculum.startTimeStamp).format('HH:mm') }}
            <br />
            {{ dayjs(curriculum.endTimeStamp).format('HH:mm') }}
          </NButton>
        </template>
        <NThing :title="curriculum.lessonName" content-style="margin-top: 10px;">
          <NSpace justify="space-between">
            <NTag :bordered="false" checkable>学科： {{ curriculum.lessonCourse }}</NTag>
            <NTag :bordered="false" type="info" size="small">排课状态</NTag>
          </NSpace>
          <NTag :bordered="false" checkable>教室： {{ curriculum.classRoom }}</NTag>
        </NThing>
      </NListItem>
    </NList>
    <NEmpty v-else size="large" description="该日期暂无排课"></NEmpty>
  </div>
</template>

<style scoped></style>
