<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { disableLesson, enableLesson, getAllLesson } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import LessonOperateDrawer from './modules/lesson-operate-drawer.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: getAllLesson,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
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
      width: 64,
      align: 'center'
    },
    {
      key: 'name',
      title: $t('page.lesson.manage.name'),
      align: 'center',
      width: 120
    },
    {
      key: 'course',
      title: $t('page.lesson.manage.course'),
      align: 'center',
      width: 100
    },
    {
      key: 'sysIsDelete',
      title: $t('page.lesson.manage.status'),
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

        const label = isDelete ? '停课' : '开课';
        return <NTag type={tagMap[isDelete]}>{label}</NTag>;
      }
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
                开课
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
              停课
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
  disableLesson(id);
  onUpdated();
}
function enable(id: number) {
  enableLesson(id);
  onUpdated();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.lesson.common.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
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
      <LessonOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
