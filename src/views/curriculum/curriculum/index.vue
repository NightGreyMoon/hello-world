<script setup lang="tsx">
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { NEmpty, NRadioGroup, NSpace, NTable, useDialog, useMessage } from 'naive-ui';
import { Dayjs } from 'dayjs';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAppStore } from '@/store/modules/app';
import {
  confirmCurriculum,
  getAttendanceByCurriculum,
  getComment,
  getCurriculumById,
  setComment,
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
const canBeConfirmed = ref(false);

const isLoading = ref(true);

const showModal: boolean = ref(false);

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
type RuleKey = Extract<keyof Model, 'account' | 'status'>;
const rules: Record<RuleKey, App.Global.FormRule> = {
  comment: defaultRequiredRule
};

type Model = Pick<Api.SystemManage.Attendance, 'id' | 'studentId' | 'curriculumId' | 'comment'>;
const model: Model = reactive(createDefaultModel());
function createDefaultModel(): Model {
  return {
    id: 0,
    studentId: 0,
    curriculumId: 0,
    comment: null
  };
}

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

function closeModal() {
  attendanceComment.value = '';
  showModal.value = false;
}

async function getData() {
  isLoading.value = true;
  const curriculumId: number = route.query.id;
  try {
    const { error, data } = await getCurriculumById(curriculumId);
    if (!error) {
      curriculum.value = data;
      canBeConfirmed.value = data.canBeConfirmed;
      isLoading.value = false;
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
}

async function openModal(id: number) {
  const { error, data } = await getComment(id);
  if (!error) {
    model.id = id;
    model.comment = data;
    showModal.value = true;
  }
}

async function submitComment() {
  await validate();
  const body = { comment: model.comment };
  setComment(model.id, body);
  isLoading.value = true;
  getData();
  closeModal();
}

function confirmStatus() {
  const curriculumId: number = route.query.id;
  confirmCurriculum(curriculumId);
  getData();
}

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard>
      <template #header>
        <NSkeleton v-if="isLoading" text width="60%" />
        <template v-else>
          {{ curriculum.lessonName }}
        </template>
      </template>
      <NSkeleton v-if="isLoading" text :repeat="2" />
      <template v-else>
        <NTime :time="curriculum.startTimeStamp" format="HH:mm" />
        ~
        <NTime :time="curriculum.endTimeStamp" format="HH:mm" />
        <NDivider vertical />
        {{ curriculum.classRoom }}
        <NDivider vertical />
        {{ curriculum.teacherName }}
      </template>
      <template #header-extra>
        <NTag>{{ curriculum?.status }}</NTag>
      </template>
    </NCard>
    <!--
 <NList v-if="attendances?.length > 0" hoverable>
      <NListItem v-for="attendance in attendances" :key="attendance.id">
        <NThing :title="attendance.studentName" content-style="margin-top: 10px;">
          <NTag :bordered="false" checkable>已签到： {{ attendance.hasSigned }}</NTag>
        </NThing>
      </NListItem>
    </NList> 
-->
    <NCard
      title="学生列表"
      :segmented="{
        content: true
      }"
    >
      <NSpace vertical>
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
                <NTag v-if="attendance.isCancelled">已请假</NTag>
                <NSwitch
                  v-else
                  :value="`${attendance.id}-${attendance.hasSigned}`"
                  :checked-value="`${attendance.id}-true`"
                  :unchecked-value="`${attendance.id}-false`"
                  @update:value="updateSignIn"
                >
                  <template #checked>已签到</template>
                  <template #unchecked>未签到</template>
                </NSwitch>
              </td>
              <td>
                <NButton
                  v-if="attendance.comment === null"
                  tertiary
                  circle
                  type="primary"
                  @click="openModal(attendance.id)"
                >
                  <template #icon>
                    <icon-ic-round-edit class="text-icon" />
                  </template>
                </NButton>
                <NButton v-else tertiary circle type="primary" @click="openModal(attendance.id)">
                  <template #icon>
                    <icon-ic-round-remove-red-eye class="text-icon" />
                  </template>
                </NButton>
              </td>
            </tr>
          </tbody>
        </NTable>
        <NEmpty v-else size="large" description="暂无学生上课记录"></NEmpty>
      </NSpace>
      <template v-if="canBeConfirmed" #action>
        <NButton type="primary" block @click="confirmStatus">确认已上课</NButton>
      </template>
    </NCard>

    <NForm ref="formRef" :model="model" :rules="rules">
      <NModal v-model:show="showModal" class="custom-card" preset="card" title="提交评语" size="huge" :bordered="false">
        <NFormItem path="comment">
          <NInput
            v-model:value="model.comment"
            type="textarea"
            maxlength="100"
            show-count
            placeholder="输入你对该学生这节课的评价"
          />
        </NFormItem>
        <template #footer>
          <NSpace justify="end">
            <NButton @click="closeModal()">取消</NButton>
            <NButton @click="submitComment()">提交</NButton>
          </NSpace>
        </template>
      </NModal>
    </NForm>
  </div>
</template>

<style scoped></style>
