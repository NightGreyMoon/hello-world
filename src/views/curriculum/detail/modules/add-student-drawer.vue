<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addAttendance, getEnrolledStudents } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'AddStudentDrawer'
});

interface Props {
  curriculumId?: number | null;
  lessonId?: number | null;
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

type Model = {
  studentId?: number | null;
  curriculumId?: number | null;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    studentId: null
  };
}

type RuleKey = Extract<keyof Model, 'account'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  studentId: defaultRequiredRule
};

/** the enabled student options */
const userOptions = ref<CommonType.Option<string>[]>([]);

async function getUserOptions() {
  console.log('接收传递过来的参数', props);
  const { error, data } = await getEnrolledStudents(props.lessonId);
  console.log(data);
  if (!error) {
    const options = data.map(item => ({
      label: item.studentName,
      value: item.studentId
    }));

    userOptions.value = [...options];
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  model.curriculumId = props.curriculumId;
  addAttendance(model).then(res => {
    if (res.data) {
      window.$message?.success('添加成功');
      closeDrawer();
      emit('submitted');
    }
  });
}

watch(visible, () => {
  if (visible.value) {
    restoreValidation();
    getUserOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" title="增加学生到当前排课" display-directive="show" :width="640">
    <NDrawerContent title="增加学生到当前排课" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="选择学生" path="studentId">
          <NSelect v-model:value="model.studentId" :options="userOptions" filterable placeholder="可以输入关键字过滤" />
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
