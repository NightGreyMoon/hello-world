<script setup lang="tsx">
import { ref } from 'vue';
import type { DataTableInst } from 'naive-ui';
import { NButton, NDatePicker, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { disableScore, enableScore, getAllScore } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord } from '@/constants/business';
import ScoreSearch from './modules/score-search.vue';
import ScoreOperateDrawer from './modules/score-operate-drawer.vue';

const appStore = useAppStore();

type Model = Pick<Api.SystemManage.ScoreSearchParams, 'studentName' | 'course' | 'lessonName' | 'type'>;

const model: Model = createDefaultModel();

function createDefaultModel(): Model {
  return {
    studentName: '',
    lessonName: '',
    course: '',
    type: ''
  };
}

const tableRef = ref<DataTableInst>();

const { columns, columnChecks, data, loading, getData, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: getAllScore,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    studentName: model.studentName,
    course: model.course,
    lessonName: model.lessonName,
    type: model.type,
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
      key: 'studentName',
      title: $t('page.score.manage.studentName'),
      align: 'center',
      width: 120
    },
    {
      key: 'type',
      title: $t('page.score.manage.type'),
      align: 'center',
      width: 120
    },
    {
      key: 'course',
      title: $t('page.score.manage.course'),
      align: 'center',
      width: 100
    },
    {
      key: 'lessonName',
      title: $t('page.score.manage.lessonName'),
      width: 180
    },
    {
      key: 'date',
      title: $t('page.score.manage.date'),
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
      key: 'point',
      title: $t('page.score.manage.point'),
      align: 'center',
      width: 100
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
  disableScore(id);
  onUpdated();
}
function enable(id: number) {
  enableScore(id);
  onUpdated();
}

function exportCSV() {
  console.log('Export clicked');
  tableRef.value?.downloadCsv({
    fileName: '学生成绩信息'
    // keepOriginalData: false
  });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ScoreSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard :title="$t('page.score.common.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
          @export-c-s-v="exportCSV"
        />
      </template>
      <NDataTable
        ref="tableRef"
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
      <ScoreOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
