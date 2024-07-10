<script setup lang="tsx">
import { NButton, NDatePicker, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { disableStudent, enableStudent, getAllEnrollment } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord } from '@/constants/business';
import EnrollmentSearch from './modules/enrollment-search.vue';
import EnrollmentOperateDrawer from './modules/enrollment-operate-drawer.vue';

const appStore = useAppStore();

type Model = Pick<Api.SystemManage.EnrollmentSearchParams, 'studentName' | 'lessonName' | 'remark'>;

const model: Model = createDefaultModel();

function createDefaultModel(): Model {
  return {
    studentName: '',
    lessonName: '',
    remark: ''
  };
}

const { columns, columnChecks, data, loading, getData, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: getAllEnrollment,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    studentName: model.studentName,
    lessonName: model.lessonName,
    remark: model.remark,
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
      title: $t('page.enrollment.manage.studentName'),
      align: 'center',
      width: 120
    },
    {
      key: 'lessonName',
      title: $t('page.enrollment.manage.lessonName'),
      width: 180
    },
    {
      key: 'lessonCourse',
      title: $t('page.enrollment.manage.lessonCourse'),
      width: 100
    },
    {
      key: 'enrollmentDate',
      title: $t('page.enrollment.manage.enrollmentDate'),
      width: 100,
      render: row => {
        if (row.enrollmentDate === null) {
          return '';
        }
        const date = new Date(row.enrollmentDate);
        return date.toLocaleDateString();
      }
    },
    {
      key: 'paymentDate',
      title: $t('page.enrollment.manage.paymentDate'),
      width: 100,
      render: row => {
        if (row.paymentDate === null) {
          return '';
        }
        const date = new Date(row.paymentDate);
        return date.toLocaleDateString();
      }
    },
    {
      key: 'amount',
      title: $t('page.enrollment.manage.amount'),
      align: 'center',
      width: 100
    },
    {
      key: 'referee',
      title: $t('page.enrollment.manage.referee'),
      align: 'center',
      width: 100
    },
    {
      key: 'packageCount',
      title: '购买课次',
      align: 'center',
      width: 100
    },
    {
      key: 'remainingCount',
      title: '剩余课次',
      align: 'center',
      width: 100
    },
    {
      key: 'sysIsDelete',
      title: $t('page.enrollment.manage.status'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.status === null) {
          return null;
        }
        const isDelete: boolean = row.sysIsDelete as boolean;
        const tagMap: any = {
          false: 'success',
          true: 'warning'
        };

        const label = isDelete ? '已禁用' : '已启用';
        return <NTag type={tagMap[isDelete]}>{label}</NTag>;
      }
    },
    {
      key: 'remark',
      title: $t('page.enrollment.manage.remark'),
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
                {$t('common.enable')}
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
              {$t('common.disable')}
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
  disableStudent(id);
  onUpdated();
}
function enable(id: number) {
  enableStudent(id);
  onUpdated();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <EnrollmentSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard
      :title="$t('page.enrollment.common.title')"
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
      <EnrollmentOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
