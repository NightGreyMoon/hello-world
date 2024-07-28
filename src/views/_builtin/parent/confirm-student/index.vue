<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NCard, NCheckbox, NCheckboxGroup, useDialog, useMessage } from 'naive-ui';
import { useRouterPush } from '@/hooks/common/router';
import { confirmStudent, getUnConfirmedStudents, studentsToConfirm } from '@/service/api';

const dialog = useDialog();
const students = ref<Student[]>([]);
const message = useMessage();
const { routerBack } = useRouterPush();
const { routerPushByKey } = useRouterPush();

const studentIds = ref<(string | number)[] | null>(null);
const hasRelatedStudent = ref(false);

async function getUserOptions() {
  const { error, data } = await getUnConfirmedStudents();
  console.log(data);
  if (!error) {
    if (data.length > 0) {
      students.value = data;
      hasRelatedStudent.value = true;
    } else {
      console.info('No related students found, start search all...');
    }
  }
}

function handleClick() {
  routerBack();
}

/** the unconfirmed student options */
const isLoadingStudent = ref(false);
const studentOptions = ref<CommonType.Option<string>[]>([]);
const studentId = ref(null);

async function getStudentsbyKeyword(query: string) {
  if (!query.length) {
    studentOptions.value = [];
    return;
  }
  isLoadingStudent.value = true;
  const { error, data } = await studentsToConfirm(query);
  if (!error) {
    const options = data.map(item => ({
      label: `${item.name} - ${item.school} - ${item.grade}`,
      value: item.id
    }));

    studentOptions.value = [...options];
    isLoadingStudent.value = false;
  }
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

function bindStudent() {
  if (studentId.value !== null && studentId.value > 0) {
    confirmStudent(studentId.value);

    dialog.success({
      title: '绑定成功',
      content: `已绑定，即将跳转`,
      positiveText: 'OK',
      onPositiveClick: () => {
        routerPushByKey(`parent_me`);
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
    <div v-if="hasRelatedStudent">
      <NFloatButton :top="0" :left="0" shape="square" @click="handleClick"></NFloatButton>
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
        <template #footer>
          <NButton type="primary" block @click="confirmBind">确认绑定</NButton>
        </template>
      </NCard>
    </div>
    <div v-else>
      <NSpace vertical style="height: 400px; padding: 50px">
        请输入学生姓名以搜索，选中学生后点按钮
        <NSelect
          v-model:value="studentId"
          :options="studentOptions"
          placeholder="请输入学生姓名以搜索"
          filterable
          clearable
          remote
          :loading="isLoadingStudent"
          :clear-filter-after-select="false"
          @search="getStudentsbyKeyword"
        />
        <NSpace justify="end">
          <NButton @click="bindStudent()">确认关联</NButton>
        </NSpace>
      </NSpace>
    </div>
  </div>
</template>

<style scoped>
.n-card {
  border-color: #edb549;
  margin-top: 10px;
}
</style>
