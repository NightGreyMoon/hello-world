<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addLesson, updateLesson } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'LessonOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Lesson | null;
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
    add: $t('page.lesson.addLesson'),
    edit: $t('page.lesson.editLesson')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Lesson, 'name' | 'course'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    course: null
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'course'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  course: defaultRequiredRule
};

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
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'add') {
    addLesson(model).then(res => {
      if (res.data) {
        window.$message?.success('添加成功');
        closeDrawer();
        emit('submitted');
      }
    });
  }
  if (props.operateType === 'edit' && props.rowData) {
    updateLesson(model).then(res => {
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
        <NFormItem :label="$t('page.lesson.common.name')" path="name">
          <NInput
            v-model:value="model.name"
            :placeholder="$t('page.lesson.form.course')"
            maxlength="50"
            show-count
            clearable
          />
        </NFormItem>
        <NFormItem :label="$t('page.lesson.common.course')" path="course">
          <NSelect v-model:value="model.course" :options="courseOptions" :placeholder="$t('page.lesson.form.course')" />
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
