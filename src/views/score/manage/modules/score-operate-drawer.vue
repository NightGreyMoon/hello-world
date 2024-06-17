<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDatePicker, NSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addScore, getAllLesson, getAllStudent, updateScore } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'ScoreOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Score | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const enableStatus: any = [
  {
    key: 1,
    name: '启用'
  },
  {
    key: 0,
    name: '禁用'
  }
];

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.score.common.add'),
    edit: $t('page.score.common.edit')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Score,
  'studentId' | 'lessonId' | 'dateTimeStamp' | 'point' | 'course' | 'type' | 'remark'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    studentId: null,
    lessonId: null,
    point: null,
    course: null,
    dateTimeStamp: 1546272000000,
    type: null,
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'account' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  gender: defaultRequiredRule,
  userId: defaultRequiredRule
};

/** the enabled student options */
const userOptions = ref<CommonType.Option<string>[]>([]);

async function getUserOptions() {
  const { error, data } = await getAllStudent(); // TODO:改一下单页大小
  console.log(data);
  if (!error) {
    const options = data.records.map(item => ({
      label: item.name,
      value: item.id
    }));

    userOptions.value = [...options];
  }
}

/** the enabled lesson options */
const lessonOptions = ref<CommonType.Option<string>[]>([]);

async function getLessonOptions() {
  const { error, data } = await getAllLesson(); // TODO:改一下单页大小
  console.log(data);
  if (!error) {
    const options = data.records.map(item => ({
      label: `${item.name} - ${item.course}`,
      value: item.id
    }));

    lessonOptions.value = [...options];
  }
}

const typeOptions = ref<CommonType.Option<string>[]>([
  { value: '学校考试成绩', label: '学校考试成绩' },
  { value: '培训班考试成绩', label: '培训班考试成绩' }
]);

const courseOptions = ref<CommonType.Option<string>[]>([
  { value: '物理', label: '物理' },
  { value: '化学', label: '化学' },
  { value: '编程', label: '编程' },
  { value: '书法', label: '书法' },
  { value: '其他', label: '其他' }
]);

function handleUpdateModelWhenEdit() {
  console.log('接收传递过来的参数', props);
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'add') {
    addScore(model).then(res => {
      if (res.data) {
        window.$message?.success('添加成功');
        closeDrawer();
        emit('submitted');
      }
    });
  }
  if (props.operateType === 'edit' && props.rowData) {
    updateScore(model).then(res => {
      // console.log('修改返回的状态', res);
      if (res.data) {
        window.$message?.success($t('common.updateSuccess'));
        closeDrawer();
        emit('submitted');
      }
    });
  }
  // request
  console.log('提交的model', model);
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
    getUserOptions();
    getLessonOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="560">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.enrollment.form.student')" path="studentId">
          <NSelect
            v-model:value="model.studentId"
            :options="userOptions"
            :placeholder="$t('page.enrollment.form.student')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.score.manage.lessonName')" path="lessonId">
          <NSelect
            v-model:value="model.lessonId"
            :options="lessonOptions"
            :placeholder="$t('page.enrollment.form.lesson')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.score.manage.date')" path="dateTimeStamp">
          <NDatePicker v-model:value="model.dateTimeStamp" :placeholder="$t('page.enrollment.form.enrollmentDate')" />
        </NFormItem>
        <NFormItem :label="$t('page.score.manage.point')" path="point">
          <NInput v-model:value="model.point" :placeholder="$t('page.score.form.point')" />
        </NFormItem>
        <NFormItem :label="$t('page.score.manage.course')" path="course">
          <NSelect v-model:value="model.course" :options="courseOptions" :placeholder="$t('page.lesson.form.course')" />
        </NFormItem>
        <NFormItem :label="$t('page.score.manage.type')" path="type">
          <NSelect v-model:value="model.type" :options="typeOptions" :placeholder="$t('page.score.form.type')" />
        </NFormItem>
        <NFormItem :label="$t('page.student.common.remark')" path="remark">
          <NInput v-model:value="model.remark" :placeholder="$t('page.student.form.remark')" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
