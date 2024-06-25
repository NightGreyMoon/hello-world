<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NCard, NTabPane, NTabs } from 'naive-ui';
import { getConfirmedStudents, getEnrollmentForStudent } from '@/service/api';
import { useAppStore } from '@/store/modules/app';

const students = ref<Curriculum[]>([]);

const lessons = ref<EnrolledLesson[]>([]);

async function getUserOptions() {
  const { error, data } = await getConfirmedStudents(4);
  console.log(data);
  if (!error) {
    students.value = data;
  }
}

async function handleUpdateValue(value: string) {
  console.log(value);
  const { error, data } = await getEnrollmentForStudent(7);
  console.log(data);
  if (!error) {
    lessons.value = data;
  }
}

onMounted(() => {
  getUserOptions();
});
</script>

<template>
  <NCard header-style="text-align: center" :bordered="false">
    <template #header>在读课程</template>
    <NTabs type="bar" placement="top" animated justify-content="space-evenly" @update:value="handleUpdateValue">
      <NTabPane v-for="student in students" :key="student.id" :name="student.id" :tab="student.name">
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
          <template #footer>出勤：{{ lesson.signInCount }} 缺勤：{{ lesson.notSignInCount }}</template>
        </NCard>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>
.n-card {
  border-color: #edb549;
}
</style>
