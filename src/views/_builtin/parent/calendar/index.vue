<script setup lang="tsx">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { NTabPane, NTabs, useDialog, useMessage } from 'naive-ui';
import dayjs, { Dayjs } from 'dayjs';
import { useAppStore } from '@/store/modules/app';
import { getAttendanceByStudent, getBetweenDates, getComment, getConfirmedStudents, udpateCancel } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const appStore = useAppStore();

const isLoading = ref<true>;

const dateOptions = ref<DateOptions[]>();
const curriculums = ref<Curriculum[]>();

const weekdays = ref<string[]>([]);
const students = ref<Student[]>([]);
const selectedStudentId = ref(0);

const attendanceComment = ref('');
const showModal: boolean = ref(false);

const attendanceId = ref(0);
const cancelReason = ref('');
const showReasonModal: boolean = ref(false);

async function getStudents() {
  const { error, data } = await getConfirmedStudents(4);
  console.log(data);
  if (!error) {
    students.value = data;
    selectedStudentId.value = students.value[0].id;
  }
}

const defaultTimeStamp = ref(0);

const dateIndex = ref(Dayjs);

const message = useMessage();
const dialog = useDialog();
const { routerPushByKey } = useRouterPush();

async function getDateOptions(year: number, month: number, day: number) {
  const { error, data } = await getBetweenDates(7, year, month + 1, day);
  if (!error) {
    dateOptions.value = data;
    defaultTimeStamp.value = data[7].timeStamp;
  } else {
    console.error(error);
  }
}

// 切换日期后获取指定日期的课表
async function dateChanged(date: number) {
  defaultTimeStamp.value = date;
  const dateSelected = dayjs(date);
  const { error, data } = await getAttendanceByStudent(
    6, // TODO: 后面要换成当前登录老师账号
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
  const { error, data } = await getAttendanceByStudent(
    6, // TODO: 后面要换成当前登录老师账号
    dateSelected.year(),
    dateSelected.month() + 1,
    dateSelected.date()
  );
  if (!error) {
    curriculums.value = data;
  }
}

async function handleUpdateValue(value: string) {
  console.log(value);
}

function handleTabChanged(value: string) {
  console.log(value);
  const newRoute = `/#/parent/${value}`;
  console.log(newRoute);
  routerPushByKey(`parent_${value}`);
  // window.location = newRoute;
}

async function updateIsCancelled(id: number) {
  if (id > 0) {
    attendanceId.value = id;
  }

  const { error, data } = await udpateCancel(attendanceId.value, cancelReason.value);
  if (!error) {
    const isCancelled: boolean = data;
    if (isCancelled) {
      message.info('请假成功');
    } else {
      message.info('取消请假成功');
    }
    loadToday();
    closeCancelModal();
  }
}

async function openModal(id: number) {
  const { error, data } = await getComment(id);
  if (!error) {
    attendanceComment.value = data;
    showModal.value = true;
  }
}

async function openCancelModal(id: number) {
  cancelReason.value = '';
  attendanceId.value = id;
  showReasonModal.value = true;
}

function closeCancelModal() {
  attendanceId.value = 0;
  cancelReason.value = '';
  showReasonModal.value = false;
}

function goConfirmStudents() {
  routerPushByKey('parent_confirm-student');
  // window.location = '#/parent/confirm-student';
}

watch(defaultTimeStamp, () => {
  if (defaultTimeStamp.value > 0) {
    loadToday();
  }
});

onMounted(async () => {
  try {
    weekdays.value = ['日', '一', '二', '三', '四', '五', '六'];
    getStudents();
    dateIndex.value = dayjs();
    getDateOptions(dateIndex.value.year(), dateIndex.value.month(), dateIndex.value.date());
  } catch (error) {
    console.error('Error fetching options:', error);
  }
});
</script>

<template>
  <div>
    <div v-if="students.length > 0">
      <!-- 学生Tabs -->
      <NTabs type="bar" placement="top" animated justify-content="space-evenly" :default-value="0" size="large">
        <NTab
          v-for="(student, index) in students"
          :key="student.id"
          :name="index"
          :tab="student.name"
          @update:value="handleUpdateValue"
        ></NTab>
      </NTabs>
      <!-- 日期Tabs -->
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
      <NList v-if="curriculums?.length > 0" hoverable style="padding-bottom: 50px">
        <NListItem v-for="curriculum in curriculums" :key="curriculum.id">
          <template #prefix>
            <NButton type="primary" ghost style="height: 70px">
              {{ dayjs(curriculum.curriculumStartTimeStamp).format('HH:mm') }}
              <br />
              {{ dayjs(curriculum.curriculumEndTimeStamp).format('HH:mm') }}
            </NButton>
          </template>
          <NThing content-style="margin-top: 10px;">
            <template #header>
              {{ curriculum.curriculumLessonName }}
            </template>
            <template #header-extra>
              <NTag v-if="curriculum.curriculumStatus == '已取消'" :bordered="false" type="info" size="small">
                已取消
              </NTag>
              <NTag v-else-if="curriculum.curriculumStatus == '已上课'" :bordered="false" type="success" size="small">
                已上课
              </NTag>
              <NTag v-else-if="curriculum.curriculumStatus == '待开课'" :bordered="false" type="warning" size="small">
                待开课
              </NTag>
            </template>
            <NTag :bordered="false" checkable>授课教室： {{ curriculum.curriculumClassRoom }}</NTag>
            <br />
            <NTag :bordered="false" checkable>授课教师： {{ curriculum.curriculumTeacherName }}</NTag>
            <br />
            <template v-if="curriculum.curriculumStatus == '已上课'">
              <NButton v-if="curriculum.hasSigned" quaternary type="success">已签到</NButton>
              <NButton v-else quaternary type="error">缺勤</NButton>
            </template>
            <NTag v-if="curriculum.isCancelled" :bordered="false" checkable>已请假</NTag>
            <NButton
              v-if="
                curriculum.curriculumStatus !== '已取消' &&
                curriculum.curriculumStatus !== '已上课' &&
                !curriculum.isCancelled
              "
              size="tiny"
              tertiary
              type="primary"
              @click="openCancelModal(curriculum.id)"
            >
              请假
            </NButton>
            <NButton
              v-if="
                curriculum.curriculumStatus !== '已取消' &&
                curriculum.curriculumStatus !== '已上课' &&
                curriculum.isCancelled
              "
              size="tiny"
              tertiary
              type="primary"
              @click="updateIsCancelled(curriculum.id)"
            >
              取消请假
            </NButton>
            <NDivider v-if="curriculum.comment" vertical />
            <NButton v-if="curriculum.comment" size="tiny" type="primary" @click="openModal(curriculum.id)">
              查看评价
            </NButton>
          </NThing>
        </NListItem>
      </NList>
      <NEmpty v-else size="large" description="该日期暂无排课"></NEmpty>

      <NModal v-model:show="showModal" class="custom-card" preset="card" title="教师评语" size="huge" :bordered="false">
        <NInput
          v-model:value="attendanceComment"
          type="textarea"
          maxlength="100"
          :autosize="{
            minRows: 3,
            maxRows: 7
          }"
        />
      </NModal>

      <NModal
        v-model:show="showReasonModal"
        class="custom-card"
        preset="card"
        title="请假"
        size="huge"
        :bordered="false"
      >
        <NFormItem path="cancelReason">
          <NInput
            v-model:value="cancelReason"
            placeholder="请输入请假原因"
            type="textarea"
            maxlength="100"
            :autosize="{
              minRows: 3,
              maxRows: 7
            }"
          />
        </NFormItem>
        <template #footer>
          <NSpace justify="end">
            <NButton @click="closeCancelModal()">取消</NButton>
            <NButton @click="updateIsCancelled()">提交</NButton>
          </NSpace>
        </template>
      </NModal>
    </div>
    <NSpace v-else vertical align="center" style="height: 400px">
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <NCard size="small" content-style="text-align:center;">
        还没有关联的学生，去找到您的孩子并关联吧
        <br />
        <br />
        <NButton @click="goConfirmStudents()">点击这里去关联</NButton>
      </NCard>
    </NSpace>
    <!-- 底部Tab栏 -->
    <NTabs
      default-value="calendar"
      size="small"
      class="fixedElement"
      justify-content="space-evenly"
      placement="bottom"
      @update:value="handleTabChanged"
    >
      <!--
 <NTab name="home" tab="首页">
        <template #default>
          <div class="tab-title">
            <SvgIcon icon="mdi-home-outline" class="text-30px" />
            首页
          </div>
        </template>
      </NTab> 
-->
      <NTab name="calendar" tab="课程">
        <template #default>
          <div class="tab-title">
            <SvgIcon icon="mdi-book-education-outline" class="text-30px" />
            课程
          </div>
        </template>
      </NTab>
      <NTab name="me" tab="我的">
        <div class="tab-title">
          <SvgIcon icon="mdi-account-outline" class="text-30px" />
          我的
        </div>
      </NTab>
    </NTabs>
  </div>
</template>

<style scoped>
.fixedElement {
  background-color: #ffffff1b;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

.n-thing-header__title {
  margin-left: 8px !important;
}
</style>
