<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NCard, NCheckbox, NCheckboxGroup, useDialog, useMessage } from 'naive-ui';
import { useRouterPush } from '@/hooks/common/router';
import { confirmStudent, getUnConfirmedStudents } from '@/service/api';

const dialog = useDialog();
const students = ref<Student[]>([]);
const message = useMessage();
const { routerBack } = useRouterPush();
const studentIds = ref<(string | number)[] | null>(null);

async function getUserOptions() {
  const { error, data } = await getUnConfirmedStudents();
  console.log(data);
  if (!error) {
    students.value = data;
  }
}

function handleClick() {
  routerBack();
}

function confirmBind() {
  // message.info(JSON.stringify(studentIds.value));
  if (studentIds.value !== null && studentIds.value.length > 0) {
    for (let index = 0; index < studentIds.value.length; index += 1) {
      const element = studentIds.value[index];
      confirmStudent(element);
    }

    dialog.success({
      title: '绑定成功',
      content: `已绑定，点击右上角返回`,
      positiveText: 'OK',
      onPositiveClick: () => {
        getUserOptions();
      }
    });
  } else {
    message.info('请先选中要绑定的学生');
  }
}

onMounted(() => {
  getUserOptions();
});
</script>

<template>
  <div>
    <NFloatButton :top="0" :left="0" shape="square" @click="handleClick"><</NFloatButton>
    <NCard header-style="text-align: center" :bordered="false" style="margin-top: 50px">
      <template #header>关联学生</template>
      <NCheckboxGroup v-model:value="studentIds">
        <NCard
          v-for="student in students"
          :key="student.id"
          content-style="font-weight:bold; padding:20px 25px 5px 25px;"
        >
          <template #default>
            {{ student.name }} 同学
            <NCheckbox :value="student.id"></NCheckbox>
          </template>
          <template #footer>
            就读学校：{{ student.school }}
            <br />
            就读年纪：{{ student.grade }}
          </template>
        </NCard>
      </NCheckboxGroup>
      <template #footer><NButton type="primary" block @click="confirmBind">确认绑定</NButton></template>
    </NCard>
  </div>
</template>

<style scoped>
.n-card {
  border-color: #edb549;
  margin-top: 10px;
}
</style>
