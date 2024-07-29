<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NAvatar, NButton, NCard, NEllipsis, NFlex, NListItem, NTabPane, NTabs, useMessage } from 'naive-ui';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';
import { getConfirmedStudents } from '@/service/api';

const { routerPushByKey } = useRouterPush();
const authStore = useAuthStore();

const students = ref<Student[]>([]);
const student = ref<Student>();

const message = useMessage();

const studectIndex = ref<0>;

async function getStudents() {
  const { error, data } = await getConfirmedStudents();
  console.log(data);
  if (!error) {
    students.value = data;
  }
}

function handleTabChanged(value: string) {
  console.log(value);
  const newRoute = `/#/parent/${value}`;
  console.log(newRoute);
  routerPushByKey(`parent_${value}`);
  // window.location = newRoute;
}

function goConfirmStudents() {
  routerPushByKey('parent_confirm-student');
  // window.location = '#/parent/confirm-student';
}

function goChangePwd() {
  // routerPushByKey('user-center');
  message.info('该功能即将上线，敬请期待');
}

function goLessons() {
  routerPushByKey('parent_lesson');
}

function changeStudent(currentIndex: number) {
  console.log(`changed to studect ${currentIndex}`);
  studectIndex.value = currentIndex;
  console.log(students.value[studectIndex.value].name);
}

onMounted(() => {
  console.log('parent_me visited');
  getStudents();
});
</script>

<template>
  <div>
    <NCard header-style="text-align: center" :bordered="false">
      <!-- 家长信息 -->
      <template #header>我的比弗利</template>
      <div style="margin: 10px 30px">
        <NFlex align="center">
          <NAvatar round :size="48" src="/src/assets/imgs/soybean.jpg"></NAvatar>
          <NEllipsis style="max-width: 240px">{{ authStore.userInfo.userName }}</NEllipsis>
        </NFlex>
      </div>
      <!-- 学生卡片 -->
      <NCard v-if="students.length == 0" size="small" content-style="text-align:center;">
        还没有关联的学生，去找到您的孩子并关联吧
        <br />
        <br />
        <NButton @click="goConfirmStudents()">点击这里去关联</NButton>
      </NCard>
      <NCard v-else-if="students.length == 1" size="small">
        <strong>{{ students[0].name }}</strong>
        <br />
        就读学校：{{ students[0].school }}
        <br />
        就读年级：{{ students[0].grade }}
      </NCard>
      <NCarousel
        v-else
        show-arrow
        effect="card"
        prev-slide-style="transform: translateX(-195px) translateZ(-150px);"
        next-slide-style="transform: translateX(-115px) translateZ(-150px);"
        style="height: 150px"
        :show-dots="false"
        :on-update:current-index="changeStudent"
      >
        <NCarouselItem v-for="student in students" :key="students.id" :style="{ width: '92%' }">
          <NCard size="small">
            <strong>{{ student.name }}</strong>
            <br />
            就读学校：{{ student.school }}
            <br />
            就读年级：{{ student.grade }}
          </NCard>
        </NCarouselItem>
      </NCarousel>

      <div style="margin: 10px 2px">
        <!--
 <NButton type="primary" block>
        <template #icon>
          <SvgIcon icon="mdi-plus-thick" />
        </template>
        课程报名
      </NButton> 
-->
      </div>

      <!-- 菜单项 -->
      <NList bordered>
        <NListItem>
          <NButton text block @click="goConfirmStudents">
            <template #icon>
              <SvgIcon icon="mdi-account-plus-outline" />
            </template>
            关联学生
          </NButton>
          <template #suffix>></template>
        </NListItem>
        <NListItem>
          <template #suffix>></template>
          <NButton text block @click="goLessons">
            <template #icon>
              <SvgIcon icon="mdi-book-edit-outline" />
            </template>
            在读课程
          </NButton>
        </NListItem>
        <NListItem>
          <template #suffix>></template>
          <NButton text block @click="goChangePwd()">
            <template #icon>
              <SvgIcon icon="mdi-script-text-outline" />
            </template>
            成绩管理
          </NButton>
        </NListItem>
        <NListItem>
          <template #suffix>></template>
          <NButton text block @click="goChangePwd()">
            <template #icon>
              <SvgIcon icon="mdi-key-chain-variant" />
            </template>
            修改密码
          </NButton>
        </NListItem>
      </NList>
    </NCard>
    <!-- 底部Tab栏 -->
    <NTabs
      default-value="me"
      size="small"
      class="fixedElement"
      justify-content="space-evenly"
      placement="bottom"
      @update:value="handleTabChanged"
    >
      <!--
 <NTab name="home" tab="首页">
      <template #default>
        <div class="tab-title">
          <SvgIcon icon="mdi-home-outline" class="text-30px" />
          首页
        </div>
      </template>
    </NTab> 
-->
      <NTab name="calendar" tab="课程">
        <template #default>
          <div class="tab-title">
            <SvgIcon icon="mdi-book-education-outline" class="text-30px" />
            课程
          </div>
        </template>
      </NTab>
      <NTab name="me" tab="我的">
        <div class="tab-title">
          <SvgIcon icon="mdi-account-outline" class="text-30px" />
          我的
        </div>
      </NTab>
    </NTabs>
  </div>
</template>

<style scoped>
.n-card {
  border-color: #edb549;
  margin-top: 20px;
  height: 120px;
}

.fixedElement {
  background-color: #ffffff1b;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

.tab-title {
  font-size: 10px !important;
  text-align: center;
}

.n-button--block {
  justify-content: start;
}

.n-list-item {
  padding-left: 30px !important;
}
</style>
