<script setup lang="tsx">
import { NButton, NDatePicker, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { getAllMessage } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord } from '@/constants/business';
import MessageSearch from './modules/message-search.vue';

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
  apiFn: getAllMessage,
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
      key: 'type',
      title: '消息类型',
      align: 'center',
      width: 120
    },
    {
      key: 'purpose',
      title: '消息用途',
      align: 'center',
      width: 120
    },
    {
      key: 'sysCreateTime',
      title: '发送时间',
      width: 100
    },
    {
      key: 'parent.name',
      title: '接收消息用户',
      width: 100
    },
    {
      key: 'curriculumLessonName',
      title: $t('page.curriculum.manage.lessonName'),
      width: 180
    },
    {
      key: 'curriculumClassRoom',
      title: $t('page.curriculum.manage.classRoom'),
      width: 150
    },
    {
      key: 'curriculumDateTimeStamp',
      title: $t('page.curriculum.manage.date'),
      width: 100,
      render: row => {
        if (row.curriculumDateTimeStamp === null) {
          return '';
        }
        const date = new Date(row.curriculumDateTimeStamp);
        return date.toLocaleDateString();
      }
    },
    {
      key: 'curriculumStartTimeStamp',
      title: $t('page.curriculum.manage.startTime'),
      width: 100,
      render: row => {
        if (row.curriculumStartTimeStamp === null) {
          return '';
        }
        const date = new Date(row.curriculumStartTimeStamp);
        return date.toLocaleTimeString();
      }
    },
    {
      key: 'curriculumEndTimeStamp',
      title: $t('page.curriculum.manage.endTime'),
      width: 100,
      render: row => {
        if (row.curriculumEndTimeStamp === null) {
          return '';
        }
        const date = new Date(row.curriculumEndTimeStamp);
        return date.toLocaleTimeString();
      }
    },
    {
      key: 'content',
      title: '消息内容',
      align: 'left',
      minWidth: 120
    },
    {
      key: 'ifSuccess',
      title: '是否成功发送',
      align: 'center',
      width: 80,
      render: row => {
        if (row.ifSuccess === null) {
          return null;
        }
        const isDelete: boolean = row.ifSuccess as boolean;
        const tagMap: any = {
          true: 'success',
          false: 'error'
        };

        const label = isDelete ? '成功' : '失败';
        return <NTag type={tagMap[isDelete]}>{label}</NTag>;
      }
    }
  ]
});

const {
  drawerVisible,
  operateType,
  checkedRowKeys,
  onUpdated
  // closeDrawer
} = useTableOperate(data, getData);

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
    <MessageSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard title="消息日志" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData" />
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
