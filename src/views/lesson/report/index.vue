<script setup lang="tsx">
import { useRoute } from 'vue-router';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { exportForLesson, getLesson, reportForLesson } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';

const appStore = useAppStore();
const route = useRoute();
const isLoading = ref(true);

type Model = Pick<Api.SystemManage.AttendanceSearchParams, 'lessonId' | 'lessonName' | 'lessonCourse'>;

const model: Model = createDefaultModel();

function createDefaultModel(): Model {
  return {
    lessonId: route.query.id,
    lessonName: null,
    lessonCourse: null
  };
}

async function getLessonById() {
  const lessonId: number = route.query.id;
  const { error, data } = await getLesson(lessonId);
  if (!error) {
    model.lessonName = data.name;
    isLoading.value = false;
  } else {
    message.error('取消失败');
  }
}

function exportReport() {
  const lessonId: number = route.query.id;
  const baseURL = import.meta.env.VITE_SERVICE_BASE_URL;
  const downloadUrl = `${baseURL}/Attendance/ExportForLesson?lessonId=${lessonId}`;
  window.open(downloadUrl);
}

const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: reportForLesson,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    lessonId: model.lessonId,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    status: null
  },
  columns: () => [
    // {
    //   type: 'selection',
    //   align: 'center',
    //   width: 48
    // },
    // {
    //   key: 'id',
    //   title: $t('common.index'),
    //   width: 64,
    //   align: 'center'
    // },
    {
      key: 'studentName',
      title: '学生',
      align: 'center'
    },
    {
      key: 'curriculumClassRoom',
      title: '授课教室',
      align: 'center'
    },
    {
      key: 'date',
      title: $t('page.curriculum.manage.date'),
      // width: 100,
      render: row => {
        if (row.curriculumDateTimeStamp === null) {
          return '';
        }
        const date = dayjs(row.curriculumDateTimeStamp);
        return date.format('YYYY-MM-DD');
      }
    },
    // {
    //   key: 'startTime',
    //   title: $t('page.curriculum.manage.startTime'),
    //   // width: 100,
    //   render: row => {
    //     if (row.curriculumStartTimeStamp === null) {
    //       return '';
    //     }
    //     const date = dayjs(row.curriculumStartTimeStamp);
    //     return date.format('HH:mm');
    //   }
    // },
    {
      key: 'curriculumTeacherName',
      title: '授课老师',
      align: 'center'
    },
    {
      key: 'status',
      title: '是否出勤',
      align: 'center'
    }
    // {
    //   key: 'curriculumDate',
    //   title: $t('page.curriculum.manage.date'),
    //   // width: 100,
    //   render: row => {
    //     if (row.curriculumDate === null) {
    //       return '';
    //     }
    //     const date = dayjs(row.dateTimeStamp);
    //     return date.format('YYYY-MM-DD');
    //   }
    // },
    // {
    //   key: 'operate',
    //   title: $t('common.operate'),
    //   align: 'center',
    //   width: 130,
    //   render: row => {
    //     const isDelete: boolean = row.sysIsDelete as boolean;

    //     if (isDelete) {
    //       return (
    //         <div class="flex-center justify-end gap-8px">
    //           <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
    //             {$t('common.edit')}
    //           </NButton>
    //           <NButton type="success" ghost size="small" onClick={() => enable(row.id)}>
    //             开课
    //           </NButton>
    //         </div>
    //       );
    //     }
    //     return (
    //       <div class="flex-center justify-end gap-8px">
    //         <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
    //           {$t('common.edit')}
    //         </NButton>
    //         <NButton type="error" ghost size="small" onClick={() => disable(row.id)}>
    //           停课
    //         </NButton>
    //       </div>
    //     );
    //   }
    // }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);

onMounted(async () => {
  getLessonById();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      v-if="!isLoading"
      :title="model.lessonName"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <NButton @click="exportReport">导出</NButton>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
