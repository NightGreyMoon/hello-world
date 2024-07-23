<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NDatePicker, NSelect, NTimePicker } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { addCurriculum, getTeacherList, searchLesson, updateCurriculum } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'CurriculumOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Curriculum | null;
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
    add: $t('page.curriculum.common.add'),
    edit: $t('page.curriculum.common.edit')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Curriculum,
  'teacherId' | 'lessonId' | 'dateTimeStamp' | 'classRoom' | 'startTimeStamp' | 'endTimeStamp' | 'remark'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    teacherId: null,
    lessonId: null,
    classRoom: null,
    dateTimeStamp: null,
    startTimeStamp: null,
    endTimeStamp: null,
    remark: ''
  };
}

type RuleKey = Extract<keyof Model, 'account'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  teacherId: defaultRequiredRule,
  lessonId: defaultRequiredRule,
  classRoom: defaultRequiredRule,
  dateTimeStamp: defaultRequiredRule,
  startTimeStamp: defaultRequiredRule,
  endTimeStamp: defaultRequiredRule
};

const roomOptions = ref<CommonType.Option<string>[]>([
  { value: '1楼教室', label: '1楼教室' },
  { value: '2楼入门教室', label: '2楼入门教室' },
  { value: '2楼里间小教室', label: '2楼里间小教室' },
  { value: '2楼未装修教室', label: '2楼未装修教室' },
  { value: '4楼大教室', label: '4楼大教室' },
  { value: '4楼小教室', label: '4楼小教室' }
]);

/** the enabled student options */
const userOptions = ref<CommonType.Option<string>[]>([]);

async function getUserOptions() {
  const { error, data } = await getTeacherList(); // TODO:改一下单页大小
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
    addCurriculum(model).then(res => {
      if (res.data) {
        window.$message?.success('添加成功');
        closeDrawer();
        emit('submitted');
      }
    });
  }
  if (props.operateType === 'edit' && props.rowData) {
    updateCurriculum(model).then(res => {
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
        <NFormItem :label="$t('page.curriculum.manage.lessonName')" path="lessonId">
          <NSelect
            v-model:value="model.lessonId"
            :options="lessonOptions"
            :placeholder="$t('page.curriculum.form.lessonName')"
            filterable
            clearable
            remote
            :loading="isLoadingLesson"
            :clear-filter-after-select="false"
            @search="getLessonOptions"
          />
        </NFormItem>
        <NFormItem :label="$t('page.curriculum.manage.teacherName')" path="teacherId">
          <NSelect
            v-model:value="model.teacherId"
            :options="userOptions"
            :placeholder="$t('page.curriculum.form.teacherName')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.curriculum.manage.classRoom')" path="classRoom">
          <NSelect
            v-model:value="model.classRoom"
            :options="roomOptions"
            :placeholder="$t('page.curriculum.form.classRoom')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.curriculum.manage.date')" path="dateTimeStamp">
          <NDatePicker v-model:value="model.dateTimeStamp" :placeholder="$t('page.curriculum.form.date')" />
        </NFormItem>
        <NFormItem :label="$t('page.curriculum.manage.startTime')" path="startTimeStamp">
          <NTimePicker
            v-model:value="model.startTimeStamp"
            format="HH:mm"
            :minutes="[0, 10, 20, 30, 40, 50]"
            :placeholder="$t('page.curriculum.form.startTime')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.curriculum.manage.endTime')" path="endTimeStamp">
          <NTimePicker
            v-model:value="model.endTimeStamp"
            format="HH:mm"
            :minutes="[0, 10, 20, 30, 40, 50]"
            :placeholder="$t('page.curriculum.form.endTime')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.curriculum.common.remark')" path="remark">
          <NInput v-model:value="model.remark" :placeholder="$t('page.curriculum.form.remark')" />
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
