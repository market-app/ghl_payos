import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Divider, notification, RowProps, Spin, Table, TableProps, Typography } from 'antd';
import { updateTierIndex } from 'apis/loyalty-engine-portal-web/tiers';
import { componentTag } from 'components/common/componentTag';
import LoadingPage from 'components/common/LoadingPage';
import { TIER_STATUS_TITLE, TIER_TAG_STATUS_COLOR } from 'constants/loyalty-engine-portal-web/tier';
import dayjs from 'dayjs';
import { useGetTiers } from 'hooks/loyalty-engine-portal-web/useTiers';
import { get, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface DataType {
  id: number;
  index: number;
  name: string;
  status: string;
  createdAt: string;
  alias: string;
}
const Row: React.FC<Readonly<RowProps>> = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const TierManagement = () => {
  const router = useRouter();
  const [processingDrag, setProcessingDrag] = useState(false);
  const { data: tiers, loading } = useGetTiers();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  );
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Thứ tự',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Phân hạng',
      dataIndex: 'alias',
      key: 'alias',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => componentTag(TIER_STATUS_TITLE[text], TIER_TAG_STATUS_COLOR[text])(),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: DataType) => (
        <EditOutlined
          onClick={() => {
            const id = get(record, 'id');
            router.push(`${router.pathname}/${id}/edit`);
          }}
        />
      ),
    },
  ];
  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    setProcessingDrag(true);
    if (active.id !== over?.id) {
      try {
        const tier = dataSource.find((item) => item.index === active.id);
        if (isEmpty(tier) || !over?.id) return;
        const newTiers = await updateTierIndex(tier.id, Number(over?.id));
        setDataSource((prev) => {
          const activeIndex = prev.findIndex((i) => i.index === active.id);
          const overIndex = prev.findIndex((i) => i.index === over?.id);
          // thay đổi index của item
          const updatedDataSource = prev.map((item) => {
            if (item.id === tier.id)
              return {
                ...item,
                index: over.id,
              };
            if (item.index === over.id)
              return {
                ...item,
                index: active.id,
              };
            return item;
          });
          return arrayMove(updatedDataSource as DataType[], activeIndex, overIndex);
        });
        notification.success({
          message: 'Thay đổi thứ tự phân hạng thành công',
        });
      } catch (error) {
        notification.error({
          message: `${error}`,
        });
      }
    }
    setProcessingDrag(false);
  };

  useEffect(() => {
    if (isEmpty(tiers)) return;
    setDataSource(tiers);
  }, [tiers]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>Quản lý phân hạng</Typography.Title>
        <Button type='primary' onClick={() => router.push(`${router.pathname}/create`)}>
          <PlusOutlined />
          Tạo phân hạng
        </Button>
      </div>
      <Divider />

      <div>
        <Spin spinning={processingDrag}>
          <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={dataSource.map((i) => i.index)} strategy={verticalListSortingStrategy}>
              <Table<DataType>
                dataSource={dataSource}
                components={{
                  body: { row: Row },
                }}
                rowKey='index'
                columns={columns}
              ></Table>
            </SortableContext>
          </DndContext>
        </Spin>
      </div>
    </>
  );
};
export default TierManagement;
