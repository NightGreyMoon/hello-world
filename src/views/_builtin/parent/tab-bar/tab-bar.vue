<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'TabBar' });

const router = new useRouter();

// function onClick(routerName) {
//   router.push({ name: routerName });
// }

const arrTab = reactive([
  { tabName: 'home', tabClass: 'tab-bar-item', tabText: '首页', tabIcon: '/src/components/tab-bar/icon/home1.png' },
  { tabName: 'course', tabClass: 'tab-bar-item', tabText: '课程', tabIcon: '/src/components/tab-bar/icon/course1.png' },
  { tabName: 'mine', tabClass: 'tab-bar-item', tabText: '我的', tabIcon: '/src/components/tab-bar/icon/user1.png' }
]);

const props = defineProps(['name']);
onMounted(() => {
  console.log(props.name);
  arrTab.forEach((item, index) => {
    if (item.tabName === props.name) {
      item.tabClass = 'tab-bar-item1';
      item.tabIcon = item.tabIcon.replace('1.png', '2.png');
    }
  });
});
</script>

<template>
  <div class="tab-bar">
    <template v-for="item in arrTab">
      <!--
 <div :class="item.tabClass" @click="onClick(item.tabName)">
        <img class="tab-bar-item-img" :src="item.tabIcon" />
        <span>{{ item.tabText }}</span>
      </div> 
-->
    </template>
  </div>
</template>

<style>
.tab-bar {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 2px 0;
  border-top: solid 1px #c0c0c0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.tab-bar-item {
  display: flex;
  flex-direction: column;
}
.tab-bar-item1 {
  display: flex;
  flex-direction: column;
  color: #0ab2ac;
}
.tab-bar-item-img {
  width: 28px;
  height: 28px;
}
</style>
