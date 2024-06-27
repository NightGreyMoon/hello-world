<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NAvatar, NButton, NCard, NEllipsis, NFlex, NListItem, NSpace, NTabPane, NTabs } from 'naive-ui';
import { getUnConfirmedStudents } from '@/service/api';

const students = ref<Student[]>([]);

async function getUserOptions() {
  const { error, data } = await getUnConfirmedStudents(4);
  console.log(data);
  if (!error) {
    students.value = data;
  }
}

onMounted(() => {
  getUserOptions();
});
</script>

<template>
  <NCard header-style="text-align: center" :bordered="false">
    <template #header>我的比弗利</template>
    <div style="margin: 10px 2px">
      <NFlex align="center">
        <NAvatar round :size="48" src="/src/assets/imgs/soybean.jpg"></NAvatar>
        <NEllipsis style="max-width: 240px">林多多家长</NEllipsis>
      </NFlex>
    </div>

    <NCarousel
      effect="card"
      prev-slide-style="transform: translateX(-195px) translateZ(-150px);"
      next-slide-style="transform: translateX(-115px) translateZ(-150px);"
      style="height: 200px"
      :show-dots="false"
    >
      <NCarouselItem :style="{ width: '90%' }">
        <NCard size="huge">
          林多多
          <br />
          就读学校：汕头市第一中学
          <br />
          就读年级：初三
        </NCard>
      </NCarouselItem>
      <NCarouselItem :style="{ width: '90%' }">
        <NCard size="huge">
          林多多
          <br />
          就读学校：汕头市第一中学
          <br />
          就读年级：初三
        </NCard>
      </NCarouselItem>
      <NCarouselItem :style="{ width: '90%' }">
        <NCard size="huge">
          林少少
          <br />
          就读学校：汕头市第一中学
          <br />
          就读年级：初一
        </NCard>
      </NCarouselItem>
    </NCarousel>
    <div style="margin: 10px 2px">
      <NButton type="primary" block>
        <template #icon>
          <SvgIcon icon="mdi-plus-thick" />
        </template>
        课程报名
      </NButton>
    </div>
    <NList bordered>
      <NListItem>
        <template #suffix>></template>
        <NButton text>
          <template #icon>
            <SvgIcon icon="mdi-account-plus-outline" />
          </template>
          关联学生
        </NButton>
      </NListItem>
      <NListItem>
        <template #suffix>></template>
        <NButton text>
          <template #icon>
            <SvgIcon icon="mdi-book-edit-outline" />
          </template>
          在读课程
        </NButton>
      </NListItem>
      <NListItem>
        <template #suffix>></template>
        <NButton text>
          <template #icon>
            <SvgIcon icon="mdi-script-text-outline" />
          </template>
          成绩管理
        </NButton>
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped>
.n-card {
  border-color: #edb549;
  margin-top: 20px;
}
</style>
