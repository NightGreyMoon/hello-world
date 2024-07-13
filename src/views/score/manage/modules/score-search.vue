<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

defineOptions({
  name: 'ScoreSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.ScoreSearchParams>('model', { required: true });

// const typeOptions = ref<CommonType.Option<string>[]>([
//   { value: '学校考试成绩', label: '学校考试成绩' },
//   { value: '培训班考试成绩', label: '培训班考试成绩' }
// ]);

const courseOptions = ref<CommonType.Option<string>[]>([
  { value: '物理', label: '物理' },
  { value: '化学', label: '化学' },
  { value: '编程', label: '编程' },
  { value: '书法', label: '书法' },
  { value: '其他', label: '其他' }
]);

async function reset() {
  emit('reset');
}

async function search() {
  emit('search');
}
</script>

<template>
  <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24 s:12 m:6" :label="$t('page.score.common.studentName')" path="studentName" class="pr-24px">
          <NInput v-model:value="model.studentName" :placeholder="$t('page.score.form.studentName')" clearable />
        </NFormItemGi>

        <NFormItemGi span="24 s:12 m:6" :label="$t('page.score.common.lessonCourse')" path="course" class="pr-24px">
          <NSelect
            v-model:value="model.course"
            :options="translateOptions(courseOptions)"
            :placeholder="$t('page.score.form.lessonCourse')"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="24 s:12 m:6" :label="$t('page.score.common.lessonName')" path="lessonName" class="pr-24px">
          <NInput v-model:value="model.lessonName" :placeholder="$t('page.score.form.lessonName')" clearable />
        </NFormItemGi>

        <!--
 <NFormItemGi span="24 s:12 m:6" :label="$t('page.score.common.type')" path="type" class="pr-24px">
          <NSelect v-model:value="model.type" :options="typeOptions" :placeholder="$t('page.score.form.type')" />
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
