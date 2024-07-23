<script setup lang="tsx">
import { NButton, NDatePicker, NIcon, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import dayjs from 'dayjs';
import { disableCurriculum, enableCurriculum, getAllCurriculum } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord } from '@/constants/business';
import CurriculumSearch from './modules/curriculum-search.vue';
import CurriculumOperateDrawer from './modules/curriculum-operate-drawer.vue';

const appStore = useAppStore();
const { routerPushByKey } = useRouterPush();

type Model = Pick<Api.SystemManage.CurriculumSearchParams, 'teacherName' | 'remark' | 'lessonName' | 'classRoom'>;

const model: Model = createDefaultModel();

function createDefaultModel(): Model {
  return {
    teacherName: '',
    lessonName: '',
    classRoom: '',
    remark: ''
  };
}

const { columns, columnChecks, data, loading, getData, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: getAllCurriculum,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    teacherName: model.teacherName,
    remark: model.remark,
    lessonName: model.lessonName,
    classRoom: model.classRoom,
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
    {
      key: 'id',
      title: $t('common.index'),
      // width: 64,
      align: 'center'
    },
    {
      key: 'lessonName',
      title: $t('page.curriculum.manage.lessonName')
      // width: 180
    },
    {
      key: 'lessonCourse',
      title: $t('page.curriculum.manage.lessonCourse')
      // width: 100
    },
    {
      key: 'teacherName',
      title: $t('page.curriculum.manage.teacherName'),
      align: 'center'
      // width: 120
    },
    {
      key: 'classRoom',
      title: $t('page.curriculum.manage.classRoom')
      // width: 150
    },
    {
      key: 'date',
      title: $t('page.curriculum.manage.date'),
      // width: 100,
      render: row => {
        if (row.date === null) {
          return '';
        }
        const date = dayjs(row.dateTimeStamp);
        return date.format('YYYY-MM-DD');
      }
    },
    {
      key: 'dayOfWeek',
      title: $t('page.curriculum.manage.dayOfWeek'),
      // width: 60
      render: row => {
        if (row.dayOfWeek === null) {
          return '';
        }
        const weekdayMap: any = {
          0: '周日',
          1: '周一',
          2: '周二',
          3: '周三',
          4: '周四',
          5: '周五',
          6: '周六'
        };
        return weekdayMap[row.dayOfWeek];
      }
    },
    {
      key: 'startTime',
      title: $t('page.curriculum.manage.startTime'),
      // width: 100,
      render: row => {
        if (row.startTime === null) {
          return '';
        }
        const date = dayjs(row.startTimeStamp);
        return date.format('HH:mm');
      }
    },
    {
      key: 'endTime',
      title: $t('page.curriculum.manage.endTime'),
      // width: 100,
      render: row => {
        if (row.endTime === null) {
          return '';
        }
        const date = dayjs(row.endTimeStamp);
        return date.format('HH:mm');
      }
    },
    {
      key: 'status',
      title: '状态',
      align: 'center'
      // width: 80
    },
    {
      key: 'remark',
      title: $t('page.student.manage.remark'),
      align: 'left'
      // minWidth: 140
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 140,
      render: row => {
        const isDelete: boolean = row.sysIsDelete as boolean;

        if (row.status === '已取消' || row.status === '已确认') {
          return (
            <div class="flex-center justify-end gap-8px">
              <NButton type="info" quaternary size="small" onClick={() => view(row.id)}>
                <icon-ic-round-remove-red-eye class="text-icon" />
              </NButton>
            </div>
          );
        }
        return (
          <div class="flex-center justify-end gap-8px">
            <NButton type="info" quaternary size="small" onClick={() => view(row.id)}>
              <icon-ic-round-remove-red-eye class="text-icon" />
            </NButton>
            <NButton type="primary" quaternary size="small" onClick={() => edit(row.id)}>
              <icon-ic-outline-edit class="text-icon" />
            </NButton>
            <NButton type="error" quaternary size="small" onClick={() => disable(row.id)}>
              <icon-ic-outline-delete-forever class="text-icon" />
            </NButton>
          </div>
        );
      }
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  // onBatchDeleted
  onUpdated
  // closeDrawer
} = useTableOperate(data, getData);

function edit(id: number) {
  handleEdit(id);
}
function disable(id: number) {
  disableCurriculum(id);
  onUpdated();
}
function enable(id: number) {
  enableCurriculum(id);
  onUpdated();
}

function view(id: number) {
  routerPushByKey('curriculum_detail', { query: { id: `${id}` } });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <CurriculumSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard
      :title="$t('page.curriculum.common.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @add="handleAdd" @refresh="getData" />
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
        striped
      />
      <CurriculumOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
