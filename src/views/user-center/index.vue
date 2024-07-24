<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { chagnePassword } from '@/service/api';

const { formRef, validate } = useNaiveForm();
const authStore = useAuthStore();
const { routerPushByKey } = useRouterPush();

interface FormModel {
  account: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  account: '',
  password: '',
  newPassword: '',
  confirmPassword: ''
});

type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;

const rules = computed<RuleRecord>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    account: formRules.userName,
    password: formRules.pwd,
    newPassword: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.newPassword)
  };
});

async function handleSubmit() {
  await validate();
  // request to reset password
  const { error, data } = await chagnePassword(model.account, model.password, model.newPassword);
  console.log(data);
  if (!error) {
    window.$message?.success('修改密码成功，即将跳转重新登录');
    setTimeout(() => {
      authStore.resetStore();
      routerPushByKey('login');
    }, 1000);
  } else {
    window.$message?.error('修改密码失败');
  }
}
</script>

<template>
  <div class="min-h-600px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="个人信息" style="margin-bottom: 16px">
      <NTabs type="line" animated pane-style="width:600px">
        <!-- <NTabPane name="changeInfo" tab="信息修改"></NTabPane> -->
        <NTabPane name="changePwd" tab="密码修改">
          <NFlex justify="center">
            <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
              <NFormItem path="account">
                <NInput v-model:value="model.account" :placeholder="$t('page.login.common.userNamePlaceholder')" />
              </NFormItem>
              <NFormItem path="code">
                <NInput
                  v-model:value="model.password"
                  type="password"
                  show-password-on="click"
                  clearable
                  :placeholder="$t('page.login.common.passwordPlaceholder')"
                />
              </NFormItem>
              <NFormItem path="newPassword">
                <NInput
                  v-model:value="model.newPassword"
                  type="password"
                  show-password-on="click"
                  clearable
                  :placeholder="$t('page.login.common.newPasswordPlaceholder')"
                />
              </NFormItem>
              <NFormItem path="confirmPassword">
                <NInput
                  v-model:value="model.confirmPassword"
                  type="password"
                  show-password-on="click"
                  clearable
                  :placeholder="$t('page.login.common.confirmNewPasswordPlaceholder')"
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
