<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

defineOptions({
  name: 'StudentSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.SystemManage.StudentSearchParams>('model', { required: true });

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  };
});

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

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24 s:12 m:6" :label="$t('page.student.manage.name')" path="name" class="pr-24px">
          <NInput v-model:value="model.name" :placeholder="$t('page.student.form.name')" />
        </NFormItemGi>

        <NFormItemGi span="24 s:12 m:6" :label="$t('page.student.manage.school')" path="school" class="pr-24px">
          <NInput v-model:value="model.school" :placeholder="$t('page.student.form.school')" />
        </NFormItemGi>

        <NFormItemGi span="24 s:12 m:6" :label="$t('page.student.common.grade')" path="grade" class="pr-24px">
          <NSelect
            v-model:value="model.grade"
            :placeholder="$t('page.student.form.grade')"
            :options="translateOptions(gradeOptions)"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="24 s:12 m:6" :label="$t('page.student.common.remark')" path="remark" class="pr-24px">
          <NInput v-model:value="model.remark" :placeholder="$t('page.student.form.remark')" />
        </NFormItemGi>

        <NFormItemGi span="24" class="pr-24px">
          <NSpace class="w-full" justify="end">
            <NButton @click="reset">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ $t('common.reset') }}
            </NButton>
            <NButton type="primary" ghost @click="search">
              <template #icon>
                <icon-ic-round-search class="text-icon" />
              </template>
              {{ $t('common.search') }}
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
