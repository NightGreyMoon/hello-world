<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NAvatar, NButton, NCard, NEllipsis, NFlex, NListItem, NSpace, NTabPane, NTabs } from 'naive-ui';
import { useRouterPush } from '@/hooks/common/router';
import { getUnConfirmedStudents } from '@/service/api';

const { routerPushByKey } = useRouterPush();

function handleTabChanged(value: string) {
  console.log(value);
  const newRoute = `/parent/${value}`;
  console.log(newRoute);
  // routerPushByKey(newRoute);
  window.location = newRoute;
}

onMounted(() => {
  console.log('parent_home visited');
});
</script>

<template>
  <NFlex justify="space-between" vertical>
    <div>
      <NCarousel>
        <img class="carousel-img" src="../../../../assets/imgs/home1.jpeg" />
        <img class="carousel-img" src="../../../../assets/imgs/home2.jpeg" />
      </NCarousel>
      <NSpace justify="space-around" size="large">
        <NTabs type="bar" placement="top">
          <NTabPane name="home" tab="学校介绍"></NTabPane>
          <NTabPane name="course" tab="课程介绍"></NTabPane>
        </NTabs>
      </NSpace>
    </div>
    <div>
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容 填充内容
      <br />
      填充内容 填充内容
      <br />
      填充内容 填充内容
      <br />
      填充内容 填充内容
      <br />
      填充内容 填充内容
      <br />
      填充内容 填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
      填充内容
      <br />
    </div>
  </NFlex>
  <NTabs
    default-value="home"
    size="large"
    class="fixedElement"
    justify-content="space-evenly"
    placement="bottom"
    @update:value="handleTabChanged"
  >
    <NTab name="home" tab="首页">
      <template #default>
        <div class="tab-title">
          <SvgIcon icon="mdi-home-outline" class="text-30px" />
          首页
        </div>
      </template>
    </NTab>
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
</template>

<style scoped>
.carousel-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.tab-title {
  text-align: center;
}

.fixedElement {
  background-color: #ececec;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}
</style>
