<script setup lang="tsx">
import { NButton, NDatePicker, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { disableStudent, enableStudent, getAllStudent } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord } from '@/constants/business';
import StudentOperateDrawer from './modules/student-operate-drawer.vue';
import StudentSearch from './modules/student-search.vue';

const appStore = useAppStore();

type Model = Pick<Api.SystemManage.StudentSearchParams, 'name' | 'grade' | 'school' | 'remark'>;

const model: Model = createDefaultModel();

function createDefaultModel(): Model {
  return {
    name: '',
    grade: null,
    school: '',
    remark: ''
  };
}

const { columns, columnChecks, data, loading, getData, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: getAllStudent,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    name: model.name,
    grade: model.grade,
    school: model.school,
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
      key: 'name',
      title: $t('page.student.manage.name'),
      align: 'center',
      width: 120
    },
    {
      key: 'gender',
      title: $t('page.student.manage.gender'),
      width: 70
    },
    {
      key: 'birthDate',
      title: $t('page.student.manage.birthDate'),
      width: 100,
      render: row => {
        if (row.birthDate === null) {
          return '';
        }
        const date = new Date(row.birthDate);
        return date.toLocaleDateString();
      }
    },
    {
      key: 'parentName',
      title: $t('page.student.manage.parentName'),
      align: 'center',
      width: 120
    },
    {
      key: 'grade',
      title: $t('page.student.manage.grade'),
      align: 'center',
      width: 100
    },
    {
      key: 'school',
      title: $t('page.student.manage.school'),
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
          true: 'warning'
        };

        const label = isDelete ? '已禁用' : '已启用';
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
    <StudentSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard
      :title="$t('page.student.common.title')"
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
      <StudentOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
