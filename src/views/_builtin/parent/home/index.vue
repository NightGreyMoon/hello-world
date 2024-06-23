<script setup></script>

<template>
  <div>
    <NCarousel>
      <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg" />
      <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg" />
      <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg" />
      <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg" />
    </NCarousel>
    <NSpace justify="space-around" size="large">
      <NTabs type="bar" placement="top">
        <NTabPane name="home" tab="学校介绍"></NTabPane>
        <NTabPane name="course" tab="课程介绍"></NTabPane>
      </NTabs>
    </NSpace>
  </div>
</template>
