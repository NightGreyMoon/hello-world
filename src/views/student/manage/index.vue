<script setup lang="tsx">
import { ref } from 'vue';
import type { DataTableInst } from 'naive-ui';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { disableStudent, getAllStudent, inStudyStudent, unStudyStudent } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
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

const tableRef = ref<DataTableInst>();

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
      key: 'name',
      title: $t('page.student.manage.name'),
      align: 'center'
      // width: 120
    },
    {
      key: 'gender',
      title: $t('page.student.manage.gender')
      // width: 70
    },
    {
      key: 'birthDate',
      title: $t('page.student.manage.birthDate'),
      // width: 100,
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
      align: 'center'
      // width: 120
    },
    {
      key: 'grade',
      title: $t('page.student.manage.grade'),
      align: 'center'
      // width: 100
    },
    {
      key: 'school',
      title: $t('page.student.manage.school'),
      align: 'center'
      // width: 100
    },
    {
      key: 'inStudy',
      title: $t('page.student.manage.status'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.inStudy === null) {
          return null;
        }
        const ifInStudy: boolean = row.inStudy as boolean;
        const tagMap: any = {
          false: 'info',
          true: 'success'
        };

        const label = ifInStudy ? '在读' : '结业';
        return <NTag type={tagMap[ifInStudy]}>{label}</NTag>;
      }
    },
    {
      key: 'remark',
      title: $t('page.student.manage.remark'),
      align: 'left',
      width: 80,
      ellipsis: { tooltip: true }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 170,
      render: row => {
        const ifInStudy: boolean = row.inStudy as boolean;

        if (ifInStudy) {
          return (
            <div class="flex-center justify-end gap-8px">
              <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
                {$t('common.edit')}
              </NButton>
              <NButton type="success" ghost size="small" onClick={() => unStudy(row.id)}>
                结业
              </NButton>
              <NPopconfirm onPositiveClick={() => disable(row.id)}>
                {{
                  default: () => $t('common.confirmDelete'),
                  trigger: () => (
                    <NButton type="error" ghost size="small">
                      {$t('common.delete')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            </div>
          );
        }
        return (
          <div class="flex-center justify-end gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              {$t('common.edit')}
            </NButton>
            <NButton type="info" ghost size="small" onClick={() => inStudy(row.id)}>
              在读
            </NButton>
            <NPopconfirm onPositiveClick={() => disable(row.id)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    {$t('common.delete')}
                  </NButton>
                )
              }}
            </NPopconfirm>
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

function inStudy(id: number) {
  inStudyStudent(id);
  onUpdated();
}

function unStudy(id: number) {
  unStudyStudent(id);
  onUpdated();
}

function exportCSV() {
  console.log('Export clicked');
  tableRef.value?.downloadCsv({
    fileName: '学生信息'
    // keepOriginalData: false
  });
}
</script>

<template>
  <div class="flex-col-stretch gap-6px">
    <StudentSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard
      :title="$t('page.student.common.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
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
        :scroll-x="800"
        min-height="460"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
        striped
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
