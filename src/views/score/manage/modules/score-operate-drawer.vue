<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDatePicker, NSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addScore, searchLesson, searchStudent, updateScore } from '@/service/api';
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
  'studentId' | 'lessonId' | 'dateTimeStamp' | 'point' | 'course' | 'type' | 'remark' | 'studentName'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    studentId: null,
    studentName: null,
    lessonId: null,
    point: null,
    course: null,
    dateTimeStamp: 1720800000000,
    type: null,
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'account' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  studentId: defaultRequiredRule,
  course: defaultRequiredRule,
  point: defaultRequiredRule,
  type: defaultRequiredRule,
  dateTimeStamp: defaultRequiredRule
};

const isLoadingStudent = ref(false);
const studentOptions = ref<CommonType.Option<string>[]>([]);

async function getStudentOptions(query: string) {
  if (!query.length) {
    studentOptions.value = [];
    return;
  }
  isLoadingStudent.value = true;
  const { error, data } = await searchStudent(query);
  if (!error) {
    const options = data.map(item => ({
      label: item.name,
      value: item.id
    }));
    studentOptions.value = [...options];
    isLoadingStudent.value = false;
  }
}

/** the enabled lesson options */
const isLoadingLesson = ref(false);
const lessonOptions = ref<CommonType.Option<string>[]>([]);

async function getLessonOptions(query: string) {
  if (!query.length) {
    lessonOptions.value = [];
    return;
  }
  isLoadingLesson.value = true;
  const { error, data } = await searchLesson(query);
  if (!error) {
    const options = data.map(item => ({
      label: item.name,
      value: item.id
    }));

    lessonOptions.value = [...options];
    isLoadingLesson.value = false;
  }
}

function parse(input: string) {
  const nums = input.replace(/,/g, '').trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
  return nums === '' ? null : Number.NaN;
}

function format(value: number | null) {
  if (value === null) return '';
  return value.toLocaleString('en-US');
}

const typeOptions = ref<CommonType.Option<string>[]>([
  { value: '在校成绩', label: '在校成绩' },
  { value: '比弗利', label: '比弗利' }
]);

const courseOptions = ref<CommonType.Option<string>[]>([
  { value: '语文', label: '语文' },
  { value: '数学', label: '数学' },
  { value: '英语', label: '英语' },
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
    searchStudent(model.studentId);
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
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="640">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.enrollment.form.student')" path="studentId">
          <NSelect
            v-model:value="model.studentId"
            :options="studentOptions"
            :placeholder="$t('page.enrollment.form.student')"
            filterable
            clearable
            remote
            :default-value="model.studentName"
            :loading="isLoadingStudent"
            :clear-filter-after-select="false"
            @search="getStudentOptions"
          />
        </NFormItem>

        <NFormItem :label="$t('page.score.manage.type')" path="type">
          <NSelect v-model:value="model.type" :options="typeOptions" :placeholder="$t('page.score.form.type')" />
        </NFormItem>

        <NFormItem :label="$t('page.score.manage.course')" path="course">
          <NSelect v-model:value="model.course" :options="courseOptions" :placeholder="$t('page.lesson.form.course')" />
        </NFormItem>

        <NFormItem :label="$t('page.score.manage.lessonName')" path="lessonId">
          <NSelect
            v-model:value="model.lessonId"
            :options="lessonOptions"
            :placeholder="$t('page.enrollment.form.lesson')"
            filterable
            clearable
            remote
            :loading="isLoadingLesson"
            :clear-filter-after-select="false"
            @search="getLessonOptions"
          />
        </NFormItem>
        <NFormItem :label="$t('page.score.manage.date')" path="dateTimeStamp">
          <NDatePicker v-model:value="model.dateTimeStamp" :placeholder="$t('page.enrollment.form.enrollmentDate')" />
        </NFormItem>

        <NFormItem :label="$t('page.score.manage.point')" path="point">
          <NInputNumber
            v-model:value="model.point"
            :parse="parse"
            :format="format"
            clearable
            :precision="1"
            :placeholder="$t('page.score.form.point')"
          />
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
