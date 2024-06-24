<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NCard, NTabPane, NTabs } from 'naive-ui';
import { getConfirmedStudents } from '@/service/api';
import { useAppStore } from '@/store/modules/app';

const students = ref<Curriculum[]>([]);

async function getUserOptions() {
  const { error, data } = await getConfirmedStudents(4);
  console.log(data);
  if (!error) {
    students.value = data;
  }
}

onMounted(() => {
  getUserOptions();
});
</script>

<template>
  <NCard title="在读课程">
    <NTabs type="bar" placement="top" animated justify-content="space-evenly">
      <NTabPane v-for="student in students" :key="student.id" :name="student.id" :tab="student.name">
        {{ student.name }}
      </NTabPane>
    </NTabs>
  </NCard>
</template>
