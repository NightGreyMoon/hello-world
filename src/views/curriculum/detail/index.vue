<script setup lang="tsx">
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { NEmpty, NRadioGroup, NSpace, NTable, useDialog, useMessage } from 'naive-ui';
import { Dayjs } from 'dayjs';
import { useAppStore } from '@/store/modules/app';
import {
  confirmCurriculum,
  getAttendanceByCurriculum,
  getComment,
  getCurriculumById,
  updateSignInForCurriculum
} from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const appStore = useAppStore();

const attendances = ref<Attendance[]>();
const dateIndex = ref(Dayjs);

const message = useMessage();
const { routerPushByKey } = useRouterPush();
const route = useRoute();

const curriculum = ref<Curriculum>();
const hasConfirmed = ref(true);

const isLoading = ref(true);

const showModal: boolean = ref(false);

const attendanceId = ref(0);
const attendanceComment = ref('');

async function updateSignIn(value: string) {
  const id = value.split('-')[0];
  attendances.value.forEach((attendance, index) => {
    if (attendance.id === Number(id)) {
      attendance.hasSigned = !attendance.hasSigned;
    }
  });
  const { error, data } = await updateSignInForCurriculum(Number(id));
  if (!error) {
    const hasSigned = data;
    if (hasSigned) {
      message.warning('签到成功');
    } else {
      message.warning('取消签到成功');
    }
  }
}

async function getData() {
  isLoading.value = true;
  const curriculumId: number = route.query.id;
  try {
    const { error, data } = await getCurriculumById(curriculumId);
    if (!error) {
      curriculum.value = data;
      hasConfirmed.value = data.hasConfirmed;
    }
  } catch (error) {
    console.error('Error fetching Curriculum:', error);
  }

  try {
    const { error, data } = await getAttendanceByCurriculum(curriculumId);
    if (!error) {
      attendances.value = data;
    }
  } catch (error) {
    console.error('Error fetching Attendance List:', error);
  }

  isLoading.value = false;
}

async function openModal(id: number) {
  const { error, data } = await getComment(id);
  if (!error) {
    attendanceComment.value = data;
    showModal.value = true;
  }
}

function cancelCurriculum() {
  const curriculumId: number = route.query.id;
  // confirmCurriculum(curriculumId);
  // getData();
  message.success('已成功取消');
}

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard>
      <template #header>排课信息</template>
      <NSkeleton v-if="isLoading" text :repeat="2" />
      <template v-else>
        <NGrid x-gap="12" :cols="2">
          <NGi>课程名称： {{ curriculum.lessonName }}</NGi>
          <NGi>授课老师： {{ curriculum.teacherName }}</NGi>
          <NGi>
            授课日期：
            <NTime :time="curriculum.dateTimeStamp" format="yyyy.MM.dd" />
            {{ curriculum?.weekday }}
          </NGi>
          <NGi>
            授课时间：
            <NTime :time="curriculum.startTimeStamp" format="HH:mm" />
            -
            <NTime :time="curriculum.endTimeStamp" format="HH:mm" />
          </NGi>
          <NGi>授课教室： {{ curriculum.classRoom }}</NGi>
          <NGi>
            授课状态：
            <NTag v-if="hasConfirmed">已上课</NTag>
            <NTag v-else>待上课</NTag>
          </NGi>
        </NGrid>
      </template>
    </NCard>
    <NCard
      title="学生上课记录"
      :segmented="{
        content: true
      }"
    >
      <NSkeleton v-if="isLoading" text :repeat="4" />
      <NSpace v-else vertical>
        <NTable v-if="attendances?.length > 0" striped>
          <thead>
            <tr>
              <th>学生姓名</th>
              <th>签到状态</th>
              <th>评语</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attendance in attendances" :key="attendance.id">
              <td>{{ attendance.studentName }}</td>
              <td>
                <template v-if="attendance.isCancelled">
                  <icon-ic-round-remove-circle-outline class="text-icon" />
                  请假
                </template>
                <template v-else-if="attendance.hasSigned">
                  <icon-ic-round-check-circle-outline class="text-icon" />
                  出勤
                </template>
                <template v-else>
                  <icon-ic-round-not-interested class="text-icon" />
                  缺勤
                </template>
              </td>
              <td>
                <NButton v-if="attendance.comment !== null" quaternary @click="openModal(attendance.id)">
                  <template #icon>
                    <icon-ic-outline-sticky-note-2 class="text-icon" />
                  </template>
                </NButton>
              </td>
            </tr>
          </tbody>
        </NTable>
        <NEmpty v-else size="large" description="暂无学生上课记录"></NEmpty>
      </NSpace>
      <template v-if="!hasConfirmed" #action>
        <NFlex justify="end">
          <NPopconfirm @positive-click="cancelCurriculum">
            <template #trigger><NButton type="primary">取消排课并通知家长</NButton></template>
            确认要取消该排课并发消息通知到所有学生家长吗？该操作无法回滚
          </NPopconfirm>
        </NFlex>
      </template>
    </NCard>

    <NModal v-model:show="showModal" preset="dialog" title="教师评语" size="huge" :bordered="false" close-on-esc>
      <NInput
        v-model:value="attendanceComment"
        readonly="true"
        type="textarea"
        maxlength="100"
        :autosize="{
          minRows: 3,
          maxRows: 7
        }"
      />
    </NModal>
  </div>
</template>

<style scoped>
.n-table th {
  font-weight: bold;
}
</style>
