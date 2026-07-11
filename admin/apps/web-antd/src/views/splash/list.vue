<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { Button, Table, Modal, Form, Input, Select, InputNumber, DatePicker, message, Popconfirm } from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';
import { $t } from '#/locales';

import {
  getSplashListApi,
  createSplashApi,
  updateSplashApi,
  deleteSplashApi,
  SplashType,
  SplashStatus,
  SplashTheme,
  type ISplashConfig,
  type ICreateSplashConfigDto,
  type IUpdateSplashConfigDto,
} from '#/api/core/splash';

const loading = ref(false);
const visible = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);

const searchForm = reactive({
  type: '',
  status: '',
  theme: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

const tableData = ref<ISplashConfig[]>([]);

const form = reactive({
  type: SplashType.SPLASH,
  title: '',
  content: '',
  imageUrl: '',
  linkUrl: '',
  duration: 3,
  sortOrder: 0,
  status: SplashStatus.ACTIVE,
  theme: SplashTheme.ALL,
  startTime: null as Date | null,
  endTime: null as Date | null,
});

const typeOptions = [
  { value: SplashType.SPLASH, label: $t('page.splash.splash') },
  { value: SplashType.AD, label: $t('page.splash.ad') },
];

const statusOptions = [
  { value: SplashStatus.ACTIVE, label: $t('page.splash.active') },
  { value: SplashStatus.INACTIVE, label: $t('page.splash.inactive') },
];

const themeOptions = [
  { value: SplashTheme.ALL, label: '全部主题' },
  { value: SplashTheme.LIGHT, label: '浅色主题' },
  { value: SplashTheme.DARK, label: '深色主题' },
];

const columns = computed(() => [
  {
    title: $t('page.splash.type'),
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: $t('page.splash.titleField'),
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: '适用主题',
    dataIndex: 'theme',
    key: 'theme',
    width: 120,
  },
  {
    title: $t('page.splash.duration'),
    dataIndex: 'duration',
    key: 'duration',
    width: 120,
  },
  {
    title: $t('page.splash.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: $t('page.splash.startTime'),
    dataIndex: 'startTime',
    key: 'startTime',
    width: 180,
  },
  {
    title: $t('page.splash.endTime'),
    dataIndex: 'endTime',
    key: 'endTime',
    width: 180,
  },
  {
    title: $t('page.splash.sortOrder'),
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
]);

function getTypeLabel(value: string): string {
  const option = typeOptions.find((item) => item.value === value);
  return option?.label || value;
}

function getStatusLabel(value: string): string {
  const option = statusOptions.find((item) => item.value === value);
  return option?.label || value;
}

function getThemeLabel(value: string): string {
  const option = themeOptions.find((item) => item.value === value);
  return option?.label || value;
}

function getStatusColor(value: string): string {
  return value === SplashStatus.ACTIVE ? '#52c41a' : '#ff4d4f';
}

async function fetchList() {
  loading.value = true;
  try {
    const result = await getSplashListApi({
      type: searchForm.type as SplashType,
      status: searchForm.status as SplashStatus,
      theme: searchForm.theme as SplashTheme,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    tableData.value = result.items;
    pagination.total = result.total;
  } catch (error) {
    console.error('fetch splash list error:', error);
  } finally {
    loading.value = false;
  }
}

function handleAdd() {
  isEdit.value = false;
  editId.value = null;
  form.type = SplashType.SPLASH;
  form.title = '';
  form.content = '';
  form.imageUrl = '';
  form.linkUrl = '';
  form.duration = 3;
  form.sortOrder = 0;
  form.status = SplashStatus.ACTIVE;
  form.theme = SplashTheme.ALL;
  form.startTime = null;
  form.endTime = null;
  visible.value = true;
}

function handleEdit(record: ISplashConfig) {
  isEdit.value = true;
  editId.value = record.id;
  form.type = record.type;
  form.title = record.title;
  form.content = record.content;
  form.imageUrl = record.imageUrl;
  form.linkUrl = record.linkUrl;
  form.duration = record.duration;
  form.sortOrder = record.sortOrder;
  form.status = record.status;
  form.theme = record.theme;
  form.startTime = record.startTime ? new Date(record.startTime) : null;
  form.endTime = record.endTime ? new Date(record.endTime) : null;
  visible.value = true;
}

async function handleSubmit() {
  if (!form.title.trim()) {
    message.warning('请输入标题');
    return;
  }

  loading.value = true;
  try {
    if (isEdit.value && editId.value) {
      const updateData: IUpdateSplashConfigDto = {
        type: form.type,
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl,
        duration: form.duration,
        sortOrder: form.sortOrder,
        status: form.status,
        theme: form.theme,
        startTime: form.startTime,
        endTime: form.endTime,
      };
      await updateSplashApi(editId.value, updateData);
    } else {
      const createData: ICreateSplashConfigDto = {
        type: form.type,
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl,
        duration: form.duration,
        sortOrder: form.sortOrder,
        status: form.status,
        theme: form.theme,
        startTime: form.startTime,
        endTime: form.endTime,
      };
      await createSplashApi(createData);
    }
    message.success($t('page.splash.saveSuccess'));
    visible.value = false;
    await fetchList();
  } catch (error) {
    console.error('save splash error:', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id: number) {
  loading.value = true;
  try {
    await deleteSplashApi(id);
    message.success($t('page.splash.deleteSuccess'));
    await fetchList();
  } catch (error) {
    console.error('delete splash error:', error);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.current = 1;
  fetchList();
}

function handleReset() {
  searchForm.type = '';
  searchForm.status = '';
  searchForm.theme = '';
  pagination.current = 1;
  fetchList();
}

fetchList();
</script>

<template>
  <div class="p-5">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">{{ $t('page.splash.list') }}</h2>
      <Button type="primary" @click="handleAdd">
        <IconifyIcon icon="ant-design:plus-outlined" />
        {{ $t('page.splash.create') }}
      </Button>
    </div>

    <div class="bg-card p-4 rounded-lg shadow-sm mb-4">
      <Form layout="inline" class="flex flex-wrap gap-4">
        <Form.Item :label="$t('page.splash.type')">
          <Select
            v-model:value="searchForm.type"
            placeholder="请选择类型"
            :style="{ width: '150px' }"
          >
            <Select.Option :value="''">全部</Select.Option>
            <Select.Option
              v-for="option in typeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item :label="$t('page.splash.status')">
          <Select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            :style="{ width: '150px' }"
          >
            <Select.Option :value="''">全部</Select.Option>
            <Select.Option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item :label="'适用主题'">
          <Select
            v-model:value="searchForm.theme"
            placeholder="请选择主题"
            :style="{ width: '150px' }"
          >
            <Select.Option :value="''">全部</Select.Option>
            <Select.Option
              v-for="option in themeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" @click="handleSearch">
            查询
          </Button>
          <Button @click="handleReset" class="ml-2">
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>

    <Table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      bordered
      @change="(p) => { pagination.current = p.current; pagination.pageSize = p.pageSize; fetchList(); }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          {{ getTypeLabel(record.type) }}
        </template>
        <template v-else-if="column.key === 'theme'">
          {{ getThemeLabel(record.theme) }}
        </template>
        <template v-else-if="column.key === 'duration'">
          {{ record.duration }}s
        </template>
        <template v-else-if="column.key === 'status'">
          <span :style="{ color: getStatusColor(record.status) }">
            {{ getStatusLabel(record.status) }}
          </span>
        </template>
        <template v-else-if="column.key === 'startTime'">
          {{ record.startTime || '-' }}
        </template>
        <template v-else-if="column.key === 'endTime'">
          {{ record.endTime || '-' }}
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="flex gap-2">
            <Button type="link" size="small" @click="handleEdit(record)">
              <IconifyIcon icon="ant-design:edit-outlined" />
              {{ $t('page.splash.edit') }}
            </Button>
            <Popconfirm
              :title="$t('page.splash.confirmDelete')"
              @confirm="handleDelete(record.id)"
            >
              <Button type="link" danger size="small">
                <IconifyIcon icon="ant-design:delete-outlined" />
                {{ $t('page.splash.delete') }}
              </Button>
            </Popconfirm>
          </div>
        </template>
      </template>
    </Table>

    <Modal
      v-model:open="visible"
      :title="isEdit ? $t('page.splash.edit') : $t('page.splash.create')"
      :confirm-loading="loading"
      @ok="handleSubmit"
    >
      <Form layout="vertical" class="space-y-4">
        <Form.Item :label="$t('page.splash.type')">
          <Select v-model:value="form.type">
            <Select.Option
              v-for="option in typeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item :label="$t('page.splash.titleField')">
          <Input v-model:value="form.title" placeholder="请输入标题" />
        </Form.Item>
        <Form.Item :label="$t('page.splash.content')">
          <Input.TextArea
            v-model:value="form.content"
            placeholder="请输入内容描述"
            :rows="3"
          />
        </Form.Item>
        <Form.Item :label="$t('page.splash.imageUrl')">
          <Input v-model:value="form.imageUrl" placeholder="请输入图片URL" />
        </Form.Item>
        <Form.Item :label="$t('page.splash.linkUrl')">
          <Input v-model:value="form.linkUrl" placeholder="请输入跳转链接" />
        </Form.Item>
        <Form.Item :label="$t('page.splash.duration')">
          <InputNumber
            v-model:value="form.duration"
            :min="1"
            :max="60"
            :style="{ width: '150px' }"
            placeholder="显示时长"
          />
          <span class="ml-2">秒</span>
        </Form.Item>
        <Form.Item :label="$t('page.splash.sortOrder')">
          <InputNumber
            v-model:value="form.sortOrder"
            :min="0"
            :style="{ width: '150px' }"
            placeholder="排序"
          />
          <span class="ml-2">数字越小越靠前</span>
        </Form.Item>
        <Form.Item :label="$t('page.splash.status')">
          <Select v-model:value="form.status">
            <Select.Option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item :label="'适用主题'">
          <Select v-model:value="form.theme">
            <Select.Option
              v-for="option in themeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item :label="$t('page.splash.startTime')">
          <DatePicker
            v-model:value="form.startTime"
            showTime
            placeholder="开始时间"
            :style="{ width: '100%' }"
          />
        </Form.Item>
        <Form.Item :label="$t('page.splash.endTime')">
          <DatePicker
            v-model:value="form.endTime"
            showTime
            placeholder="结束时间"
            :style="{ width: '100%' }"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
