<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

defineOptions({
  name: 'CurriculumSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.SystemManage.CurriculumSearchParams>('model', { required: true });

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  };
});

const roomOptions = ref<CommonType.Option<string>[]>([
  { value: '1楼教室', label: '1楼教室' },
  { value: '2楼入门教室', label: '2楼入门教室' },
  { value: '2楼里间小教室', label: '2楼里间小教室' },
  { value: '2楼未装修教室', label: '2楼未装修教室' },
  { value: '4楼大教室', label: '4楼大教室' },
  { value: '4楼小教室', label: '4楼小教室' }
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
        <NFormItemGi
          span="24 s:12 m:6"
          :label="$t('page.curriculum.common.lessonName')"
          path="lessonName"
          class="pr-24px"
        >
          <NInput v-model:value="model.lessonName" :placeholder="$t('page.curriculum.form.lessonName')" />
        </NFormItemGi>

        <NFormItemGi
          span="24 s:12 m:6"
          :label="$t('page.curriculum.manage.classRoom')"
          path="classRoom"
          class="pr-24px"
        >
          <NSelect
            v-model:value="model.classRoom"
            :options="roomOptions"
            :placeholder="$t('page.curriculum.form.classRoom')"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi
          span="24 s:12 m:6"
          :label="$t('page.curriculum.common.teacherName')"
          path="teachertName"
          class="pr-24px"
        >
          <NInput v-model:value="model.teacherName" :placeholder="$t('page.curriculum.form.teacherName')" />
        </NFormItemGi>

        <!--
 <NFormItemGi span="24 s:12 m:6" :label="$t('page.curriculum.common.remark')" path="remark" class="pr-24px">
          <NInput v-model:value="model.remark" :placeholder="$t('page.curriculum.form.remark')" />
        </NFormItemGi> 
-->

        <NFormItemGi span="24 s:12 m:6" class="pr-24px">
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
