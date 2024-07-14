<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { NAlert, NList, NTime } from 'naive-ui';
import { getAllLesson, getCurriculumByClassRoomAndDate } from '@/service/api';
import { $t } from '@/locales';
defineOptions({
  name: 'ClassroomScheduleDrawer'
});

interface Props {
  classroom: string;
  year: number;
  month: number;
  day: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

type Model = Api.SystemManage.Curriculum[];

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return null;
}

const curriculums = ref<Curriculum[]>([]);

/** the enabled lesson options */
const lessonOptions = ref<CommonType.Option<string>[]>([]);

async function getLessonOptions() {
  const { error, data } = await getAllLesson(); // TODO:改一下单页大小
  console.log(data);
  if (!error) {
    const options = data.records.map(item => ({
      label: `${item.name} - ${item.course}`,
      value: item.id
    }));

    lessonOptions.value = [...options];
  }
}

async function handleUpdateModelWhenEdit() {
  const { error, data } = await getCurriculumByClassRoomAndDate(props.classroom, props.year, props.month, props.day);
  if (!error) {
    curriculums.value = data;
  }
}

function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    // getLessonOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="props.classroom" display-directive="show" :width="640">
    <NDrawerContent :title="props.classroom" :native-scrollbar="false" closable>
      <NAlert type="default">{{ props.year }}-{{ props.month }}-{{ props.day }}</NAlert>
      <NList v-if="curriculums !== null" hoverable>
        <template v-for="(item, index) in curriculums" :key="index">
          <NListItem>
            <NTag :bordered="false" type="info" size="small">
              <NTime :time="item.startTimeStamp" format="HH:mm" />
              ~
              <NTime :time="item.endTimeStamp" format="HH:mm" />
            </NTag>
            {{ item.lessonCourse }}-{{ item.lessonName }}
            <NTag>{{ item.status }}</NTag>
          </NListItem>
        </template>
      </NList>
      <template #footer>
        <NSpace :size="16">
          <NButton type="primary" @click="closeDrawer">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
