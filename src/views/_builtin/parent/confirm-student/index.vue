<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NCard, NTabPane, NTabs } from 'naive-ui';
import { getUnConfirmedStudents } from '@/service/api';

const students = ref<Student[]>([]);

async function getUserOptions() {
  const { error, data } = await getUnConfirmedStudents(4);
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
  <NCard header-style="text-align: center" :bordered="false">
    <template #header>关联学生</template>
    <NCard v-for="student in students" :key="student.id" content-style="font-weight:bold; padding:20px 25px 5px 25px;">
      <template #default>{{ student.name }} 同学</template>
      <template #footer>
        就读学校：{{ student.school }}
        <br />
        就读年纪：{{ student.grade }}
      </template>
    </NCard>
  </NCard>
</template>

<style scoped>
.n-card {
  border-color: #edb549;
  margin-top: 20px;
}
</style>
