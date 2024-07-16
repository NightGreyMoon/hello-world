<script setup lang="tsx">
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { NEmpty, NRadioGroup, NSpace, NTable, useDialog, useMessage } from 'naive-ui';
import { Dayjs } from 'dayjs';
import { useAppStore } from '@/store/modules/app';
import {
  cancelCurriculum,
  confirmCurriculumAndNotify,
  deleteAttendance,
  getAttendanceByCurriculum,
  getComment,
  getCurriculumById,
  updateSignInForCurriculum
} from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import AddStudentDrawer from './modules/add-student-drawer.vue';

const appStore = useAppStore();

const attendances = ref<Attendance[]>();
const dateIndex = ref(Dayjs);

const message = useMessage();
const { routerPushByKey } = useRouterPush();
const route = useRoute();

const curriculumId = ref(0);
const curriculum = ref<Curriculum>();
const hasConfirmed = ref(true);
const lessonId = ref(0);

const isLoading = ref(true);

const showModal = ref(false);

const drawerVisible = ref(false);

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
  curriculumId.value = route.query.id;
  try {
    const { error, data } = await getCurriculumById(curriculumId.value);
    if (!error) {
      curriculum.value = data;
      hasConfirmed.value = data.hasConfirmed;
      lessonId.value = data.lessonId;
    }
  } catch (error) {
    console.error('Error fetching Curriculum:', error);
  }

  try {
    const { error, data } = await getAttendanceByCurriculum(curriculumId.value);
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

function showDrawer() {
  drawerVisible.value = true;
}

async function cancel() {
  const curriculumId: number = route.query.id;
  const { error, data } = await cancelCurriculum(curriculumId);
  if (!error) {
    getData();
    message.success('已成功取消');
  } else {
    message.error('取消失败');
  }
}

async function removeAttendance(id: number) {
  const { error, data } = await deleteAttendance(id);
  if (!error) {
    getData();
    message.success('已成功移除');
  } else {
    message.error('移除失败');
  }
}

async function confirmCurriculum() {
  const curriculumId: number = route.query.id;
  const { error, data } = await confirmCurriculumAndNotify(curriculumId);
  if (!error) {
    getData();
    message.success('已成功排课');
  } else {
    message.error('排课失败');
  }
}

onMounted(async () => {
  getData();
});
</script>

<template>
  <div>
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
            <NTag v-if="curriculum.status === '已取消'" type="error">{{ curriculum.status }}</NTag>
            <NTag v-else-if="curriculum.status === '已确认'" type="primary">{{ curriculum.status }}</NTag>
            <NTag v-else>{{ curriculum.status }}</NTag>
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
              <th>操作</th>
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
              <td style="width: 50px">
                <NPopconfirm @positive-click="removeAttendance(attendance.id)">
                  <template #trigger>
                    <NButton type="error" ghost>
                      <icon-ic-round-delete class="text-icon" />
                      移除
                    </NButton>
                  </template>
                  要移除该学生吗？
                </NPopconfirm>
              </td>
            </tr>
          </tbody>
        </NTable>
        <NEmpty v-else size="large" description="暂无学生上课记录"></NEmpty>
      </NSpace>
      <template #action>
        <NSkeleton v-if="isLoading" text :repeat="1" />
        <NFlex v-else justify="end">
          <NPopconfirm v-if="curriculum.status === '排期中'" @positive-click="confirmCurriculum">
            <template #trigger><NButton type="primary">确认排课并通知家长</NButton></template>
            要确认该排课并发消息通知到所有学生家长吗？
          </NPopconfirm>
          <NPopconfirm v-if="curriculum.status === '待开课'" @positive-click="cancel">
            <template #trigger><NButton type="error">取消排课并通知家长</NButton></template>
            要取消该排课并发消息通知到所有学生家长吗？
          </NPopconfirm>
        </NFlex>
      </template>
      <template #header-extra>
        <NButton @click="showDrawer">
          增加学生到当前排课
          <template #icon>
            <icon-ic-round-search class="text-icon" />
          </template>
        </NButton>
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

    <AddStudentDrawer
      v-model:visible="drawerVisible"
      :curriculum-id="curriculumId"
      :lesson-id="lessonId"
      @submitted="getData"
    />
  </div>
</template>

<style scoped>
.n-table th {
  font-weight: bold;
}
</style>
