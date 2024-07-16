<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDatePicker, NSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addStudent, getParentList, updateStudent } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'StudentOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Student | null;
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
    add: $t('page.student.addStudent'),
    edit: $t('page.student.editStudent')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Student,
  'name' | 'gender' | 'grade' | 'school' | 'birthTimeStamp' | 'userId' | 'remark'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    gender: null,
    grade: null,
    school: '',
    birthTimeStamp: null,
    userId: null,
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'account' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  gender: defaultRequiredRule,
  school: defaultRequiredRule,
  grade: defaultRequiredRule,
  userId: defaultRequiredRule
};

/** the enabled role options */
const userOptions = ref<CommonType.Option<string>[]>([]);

const gradeOptions = ref<CommonType.Option<string>[]>([
  { value: '三年级', label: '三年级' },
  { value: '四年级', label: '四年级' },
  { value: '五年级', label: '五年级' },
  { value: '六年级', label: '六年级' },
  { value: '初一', label: '初一' },
  { value: '初二', label: '初二' },
  { value: '初三', label: '初三' },
  { value: '高一', label: '高一' },
  { value: '高二', label: '高二' },
  { value: '高三', label: '高三' }
]);

const genderOptions = ref<CommonType.Option<string>[]>([
  { value: '男生', label: '男生' },
  { value: '女生', label: '女生' }
]);

async function getUserOptions() {
  const { error, data } = await getParentList();
  console.log(data);
  if (!error) {
    const options = data.records.map(item => ({
      label: item.name,
      value: item.id
    }));

    userOptions.value = [...options];
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
    addStudent(model).then(res => {
      if (res.data) {
        window.$message?.success('添加成功');
        closeDrawer();
        emit('submitted');
      }
    });
  }
  if (props.operateType === 'edit' && props.rowData) {
    updateStudent(model).then(res => {
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
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="640">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.student.common.name')" path="name">
          <NInput v-model:value="model.name" :placeholder="$t('page.student.form.name')" />
        </NFormItem>
        <NFormItem :label="$t('page.student.common.gender')" path="gender">
          <NSelect
            v-model:value="model.gender"
            :options="genderOptions"
            :placeholder="$t('page.student.form.gender')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.student.common.birthDate')" path="birthDate">
          <NDatePicker v-model:value="model.birthTimeStamp" :placeholder="$t('page.student.form.birthDate')" />
        </NFormItem>
        <NFormItem :label="$t('page.student.common.school')" path="school">
          <NInput v-model:value="model.school" :placeholder="$t('page.student.form.school')" />
        </NFormItem>
        <NFormItem :label="$t('page.student.common.grade')" path="grade">
          <NSelect v-model:value="model.grade" :placeholder="$t('page.student.form.grade')" :options="gradeOptions" />
        </NFormItem>
        <NFormItem :label="$t('page.student.common.userId')" path="userId">
          <NSelect v-model:value="model.userId" :options="userOptions" :placeholder="$t('page.student.form.userId')" />
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
