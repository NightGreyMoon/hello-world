<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';

const { formRef, validate } = useNaiveForm();

interface FormModel {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;

const rules = computed<RuleRecord>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    phone: formRules.phone,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

async function handleSubmit() {
  await validate();
  // request to reset password
  window.$message?.success($t('page.login.common.validateSuccess'));
}
</script>

<template>
  <div class="min-h-600px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="个人信息" style="margin-bottom: 16px">
      <NTabs type="line" animated pane-style="width:600px">
        <NTabPane name="changeInfo" tab="信息修改"></NTabPane>
        <NTabPane name="changePwd" tab="密码修改">
          <NFlex justify="center">
            <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
              <NFormItem path="phone">
                <NInput v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" />
              </NFormItem>
              <NFormItem path="code">
                <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
              </NFormItem>
              <NFormItem path="password">
                <NInput
                  v-model:value="model.password"
                  type="password"
                  show-password-on="click"
                  clearable
                  :placeholder="$t('page.login.common.passwordPlaceholder')"
                />
              </NFormItem>
              <NFormItem path="confirmPassword">
                <NInput
                  v-model:value="model.confirmPassword"
                  type="password"
                  show-password-on="click"
                  clearable
                  :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
                />
              </NFormItem>
              <NSpace vertical :size="18" class="w-full">
                <NButton type="primary" size="large" round block @click="handleSubmit">
                  {{ $t('common.confirm') }}
                </NButton>
              </NSpace>
            </NForm>
          </NFlex>
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
