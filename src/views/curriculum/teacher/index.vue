<script setup lang="tsx">
import { computed, onMounted, ref, watch } from 'vue';
import { NEmpty, useDialog, useMessage } from 'naive-ui';
import dayjs, { Dayjs } from 'dayjs';
import { useAppStore } from '@/store/modules/app';
import { getCurriculumByTeacherAndDate, getRecenDates } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const appStore = useAppStore();

const dateOptions = ref<DateOptions[]>();
const weekdays = ref<string[]>([]);
const curriculums = ref<Curriculum[]>();
const isLoading = ref(true);
const defaultTimeStamp = ref(0);

const dateIndex = ref(Dayjs);

const message = useMessage();
const dialog = useDialog();
const { routerPushByKey } = useRouterPush();

async function getDateOptions(year: number, month: number, day: number) {
  const { error, data } = await getRecenDates(30, year, month + 1, day);
  if (!error) {
    dateOptions.value = data;
    defaultTimeStamp.value = data[0].timeStamp;
  } else {
    console.error(error);
  }
}

// 跳转去排课详情页面
function checkCurriculum(id: number) {
  routerPushByKey('curriculum_curriculum', { query: { id: `${id}` } });
}

// 页面加载或日期切换时获取当前日期的课表
async function loadToday() {
  isLoading.value = true;
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
  isLoading.value = false;
}

watch(defaultTimeStamp, () => {
  if (defaultTimeStamp.value > 0) {
    loadToday();
  }
});

onMounted(async () => {
  try {
    weekdays.value = ['日', '一', '二', '三', '四', '五', '六'];
    dateIndex.value = dayjs();
    getDateOptions(dateIndex.value.year(), dateIndex.value.month(), dateIndex.value.date());
  } catch (error) {
    console.error('Error fetching options:', error);
  }
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NTabs v-model:value="defaultTimeStamp" type="card" tab-style="text-align:center;" size="small">
      <NTabPane
        v-for="dateOption in dateOptions"
        :key="dateOption.timeStamp"
        :tab="dateOption.timeStamp"
        :name="dateOption.timeStamp"
      >
        <template #tab>
          {{ dateOption.dayOfWeek }}
          <br />
          {{ dateOption.month }}-{{ dateOption.day }}
        </template>
      </NTabPane>
    </NTabs>
    <!--
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
        </NRadioButton>
      </NRadioGroup>
      <NButton circle @click="forward">
        <template #icon>
          <icon-ic-round-arrow-forward />
        </template>
      </NButton>
    </NSpace> 
-->

    <NSkeleton v-if="isLoading" height="50px" :sharp="false" :repeat="6" />
    <template v-else>
      <NList v-if="curriculums?.length > 0" hoverable clickable>
        <NListItem v-for="curriculum in curriculums" :key="curriculum.id" @click="checkCurriculum(curriculum.id)">
          <template #prefix>
            <NButton type="primary" ghost style="height: 70px">
              {{ dayjs(curriculum.startTimeStamp).format('HH:mm') }}
              <br />
              {{ dayjs(curriculum.endTimeStamp).format('HH:mm') }}
            </NButton>
          </template>
          <NThing>
            <template #header>
              {{ curriculum.lessonName }}
            </template>
            <template #header-extra>
              <NTag :bordered="false" type="info" size="small">{{ curriculum.status }}</NTag>
            </template>
            <NTag :bordered="false" checkable>学科： {{ curriculum.lessonCourse }}</NTag>
            <br />
            <NTag :bordered="false" checkable>教室： {{ curriculum.classRoom }}</NTag>
          </NThing>
        </NListItem>
      </NList>
      <NEmpty v-else size="large" description="该日期暂无排课"></NEmpty>
    </template>
  </div>
</template>

<style scoped></style>
