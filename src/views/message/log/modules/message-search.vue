<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

defineOptions({
  name: 'MessageSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.SystemManage.MessageLogSearchParams>('model', { required: true });

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  };
});

const purposeOptions = ref<CommonType.Option<string>[]>([
  { value: '排课取消通知', label: '排课取消通知' },
  { value: '排课签到成功', label: '排课签到成功' },
  { value: '排课时间确定', label: '排课时间确定' }
]);

const ifSuccessOptions = ref<CommonType.Option<string>[]>([
  { value: 'true', label: '成功' },
  { value: 'false', label: '失败' }
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
        <NFormItemGi span="24 s:8 m:4" label="消息用途" path="purpose" class="pr-24px">
          <NSelect v-model:value="model.purpose" :options="purposeOptions" placeholder="留空即表示全部" clearable />
        </NFormItemGi>

        <NFormItemGi span="24 s:8 m:4" label="是否成功" path="ifSuccess" class="pr-24px">
          <NSelect v-model:value="model.ifSuccess" :options="ifSuccessOptions" placeholder="留空即表示全部" clearable />
        </NFormItemGi>

        <NFormItemGi span="24 s:8 m:4" label="接收用户" path="userName" class="pr-24px">
          <NInput v-model:value="model.userName" placeholder="输入家长用户名" clearable />
        </NFormItemGi>

        <NFormItemGi
          span="24 s:8 m:4"
          :label="$t('page.curriculum.common.lessonName')"
          path="curriculumLessonName"
          class="pr-24px"
        >
          <NInput
            v-model:value="model.curriculumLessonName"
            :placeholder="$t('page.curriculum.form.lessonName')"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi
          span="24 s:8 m:4"
          :label="$t('page.curriculum.manage.classRoom')"
          path="curriculumClassRoom"
          class="pr-24px"
        >
          <NInput
            v-model:value="model.curriculumClassRoom"
            :placeholder="$t('page.curriculum.form.classRoom')"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="24 s:8 m:4" class="pr-24px">
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
