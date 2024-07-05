<script setup lang="tsx">
import { NButton, NDatePicker, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
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
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'teacherName',
      title: $t('page.curriculum.manage.teacherName'),
      align: 'center',
      width: 120
    },
    {
      key: 'lessonName',
      title: $t('page.curriculum.manage.lessonName'),
      width: 180
    },
    {
      key: 'lessonCourse',
      title: $t('page.curriculum.manage.lessonCourse'),
      width: 100
    },
    {
      key: 'classRoom',
      title: $t('page.curriculum.manage.classRoom'),
      width: 150
    },
    {
      key: 'date',
      title: $t('page.curriculum.manage.date'),
      width: 100,
      render: row => {
        if (row.date === null) {
          return '';
        }
        const date = new Date(row.date);
        return date.toLocaleDateString();
      }
    },
    {
      key: 'dayOfWeek',
      title: $t('page.curriculum.manage.dayOfWeek'),
      width: 60
    },
    {
      key: 'startTime',
      title: $t('page.curriculum.manage.startTime'),
      width: 100,
      render: row => {
        if (row.startTime === null) {
          return '';
        }
        const date = new Date(row.startTime);
        return date.toLocaleTimeString();
      }
    },
    {
      key: 'endTime',
      title: $t('page.curriculum.manage.endTime'),
      width: 100,
      render: row => {
        if (row.endTime === null) {
          return '';
        }
        const date = new Date(row.endTime);
        return date.toLocaleTimeString();
      }
    },
    {
      key: 'sysIsDelete',
      title: $t('page.student.manage.status'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.status === null) {
          return null;
        }
        const isDelete: boolean = row.sysIsDelete as boolean;
        const tagMap: any = {
          false: 'success',
          true: 'error'
        };

        const label = isDelete ? '作废' : '有效';
        return <NTag type={tagMap[isDelete]}>{label}</NTag>;
      }
    },
    {
      key: 'remark',
      title: $t('page.student.manage.remark'),
      align: 'left',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        const isDelete: boolean = row.sysIsDelete as boolean;

        if (isDelete) {
          return (
            <div class="flex-center justify-end gap-8px">
              <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NButton type="success" ghost size="small" onClick={() => enable(row.id)}>
                启用
              </NButton>
            </div>
          );
        }
        return (
          <div class="flex-center justify-end gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              {$t('common.edit')}
            </NButton>
            <NButton type="info" ghost size="small" onClick={() => view(row.id)}>
              查看详情
            </NButton>
            <NButton type="error" ghost size="small" onClick={() => disable(row.id)}>
              作废
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
