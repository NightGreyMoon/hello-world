<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDatePicker, NSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addEnrollment, getAllLesson, getAllStudent, updateEnrollment } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'EnrollmentOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Enrollment | null;
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
    add: $t('page.enrollment.add'),
    edit: $t('page.enrollment.edit')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Enrollment,
  'studentId' | 'lessonId' | 'enrollmentTimeStamp' | 'paymentTimeStamp' | 'amount' | 'referee' | 'remark'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    studentId: null,
    lessonId: null,
    amount: null,
    referee: '',
    enrollmentTimeStamp: 1546272000000,
    paymentTimeStamp: 1546272000000,
    packageCount: 18,
    remainingCount: 18,
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
    addEnrollment(model).then(res => {
      if (res.data) {
        window.$message?.success('添加成功');
        closeDrawer();
        emit('submitted');
      }
    });
  }
  if (props.operateType === 'edit' && props.rowData) {
    updateEnrollment(model).then(res => {
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
        <NFormItem :label="$t('page.enrollment.form.lesson')" path="lessonId">
          <NSelect
            v-model:value="model.lessonId"
            :options="lessonOptions"
            :placeholder="$t('page.enrollment.form.lesson')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.enrollment.form.enrollmentDate')" path="enrollmentTimeStamp">
          <NDatePicker
            v-model:value="model.enrollmentTimeStamp"
            :placeholder="$t('page.enrollment.form.enrollmentDate')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.enrollment.form.paymentDate')" path="paymentTimeStamp">
          <NDatePicker v-model:value="model.paymentTimeStamp" :placeholder="$t('page.enrollment.form.paymentDate')" />
        </NFormItem>
        <NFormItem :label="$t('page.enrollment.form.amount')" path="amount">
          <NInput v-model:value="model.amount" :placeholder="$t('page.enrollment.form.amount')" />
        </NFormItem>
        <NFormItem label="购买课次" path="packageCount">
          <NInput v-model:value="model.packageCount" />
        </NFormItem>
        <NFormItem label="剩余课次" path="remainingCount">
          <NInput v-model:value="model.remainingCount" />
        </NFormItem>
        <NFormItem :label="$t('page.enrollment.form.referee')" path="referee">
          <NInput v-model:value="model.referee" :placeholder="$t('page.enrollment.form.referee')" />
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
