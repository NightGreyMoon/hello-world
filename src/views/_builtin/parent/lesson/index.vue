<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NCard, NTabPane, NTabs } from 'naive-ui';
import { useRouterPush } from '@/hooks/common/router';
import { getConfirmedStudents, getEnrollmentForStudent } from '@/service/api';
import { useAppStore } from '@/store/modules/app';

const { routerPushByKey } = useRouterPush();
const students = ref<Student[]>([]);

const lessons = ref<EnrolledLesson[]>([]);

async function getStudents() {
  const { error, data } = await getConfirmedStudents(4);
  console.log(data);
  if (!error) {
    students.value = data;
    const selectedStudentId = students.value[0].id;
    getLessons(selectedStudentId);
  }
}

async function getLessons(studentId: number) {
  const { error, data } = await getEnrollmentForStudent(studentId);
  console.log(data);
  if (!error) {
    lessons.value = data;
  }
}

async function handleUpdateValue(value: string) {
  console.log(value);
  getLessons(7);
}

function handleTabChanged(value: string) {
  console.log(value);
  routerPushByKey(`parent_${value}`);
}

onMounted(() => {
  getStudents();
});
</script>

<template>
  <div>
    <NCard header-style="text-align: center" :bordered="false" class="marginContent">
      <template #header>在读课程</template>
      <NTabs
        type="bar"
        placement="top"
        animated
        justify-content="space-evenly"
        :default-value="0"
        @update:value="handleUpdateValue"
      >
        <NTabPane v-for="(student, index) in students" :key="student.id" :name="index" :tab="student.name">
          <NCard
            v-for="lesson in lessons"
            :key="lesson.id"
            :segmented="{
              content: true,
              footer: 'soft'
            }"
          >
            <template #header>{{ lesson.lessonName }}</template>
            <template #default>
              报名日期：
              <NTime :time="lesson.enrollmentTimeStamp" format="yyyy-MM-dd"></NTime>
              <br />
              缴费日期：
              <NTime :time="lesson.paymentTimeStamp" format="yyyy-MM-dd"></NTime>
              <br />
              缴费金额：{{ lesson.amount }}
            </template>
            <template #footer>
              出勤：{{ lesson.signInCount }} 缺勤：{{ lesson.notSignInCount }} | 待上课：{{ lesson.toAttendCount }}
            </template>
          </NCard>
        </NTabPane>
      </NTabs>
    </NCard>
    <!-- 底部Tab栏 -->
    <NTabs
      default-value="lesson"
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
.n-card {
  border-color: #edb549;
  margin-top: 10px;
}

.fixedElement {
  background-color: #ececec;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

.marginContent {
  padding-bottom: 70px;
}
</style>
