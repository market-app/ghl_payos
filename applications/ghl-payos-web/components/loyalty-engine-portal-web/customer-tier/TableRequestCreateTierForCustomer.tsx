import { InfoCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FilterValue } from 'antd/es/table/interface';
import { componentTag } from 'components/common/componentTag';
import { FilteredTable } from 'components/common/FilteredTable';
import { ENUM_LOYALTY_TIER_NAME } from 'constants/loyalty-engine-portal-web';
import { TIER_ALIAS_COLOR } from 'constants/loyalty-engine-portal-web/tier';
import dayjs from 'dayjs';
import { useRequestCreateTier } from 'hooks/loyalty-engine-portal-web/useRequestCreateTiers';
import { castArray, get, isNil } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { FilteredColumnsType } from 'types/loyalty-engine-portal-web/filter-table';

const TableRequestCreateTierForCustomer = () => {
  const router = useRouter();
  const query = router.query;
  const { data, loading } = useRequestCreateTier(query);
  const columns: FilteredColumnsType[] = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      defaultFilteredValue: (!isNil(query?.phone) && query?.phone?.length
        ? castArray(query.phone)
        : null) as FilterValue,
      filter: {
        type: 'input',
        label: 'phone',
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Hạng được nâng',
      dataIndex: 'tier',
      render: (text: any) => {
        const alias = get(text, 'alias', ENUM_LOYALTY_TIER_NAME.SILVER) as string;
        return componentTag(alias.toUpperCase(), TIER_ALIAS_COLOR[alias])();
      },
    },
    {
      title: 'Ngày được duyệt nâng hạng',
      dataIndex: 'createdAt',
      render: (text: any) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      render: (text: any) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      render: (text: any) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <Button
          type='default'
          icon={<InfoCircleOutlined />}
          onClick={() => {
            const customerId = get(record, 'customerId');
            router.push(`${router.pathname}/${customerId}`);
          }}
        />
      ),
    },
  ];
  const handleTableChange = (pagination: any, filters: any) => {
    let query = {
      skip: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      phone: filters.phone,
    };
    onUpdateRouter(query);
  };
  const onUpdateRouter = useCallback(
    (query: any) => {
      router.push({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  return (
    <>
      <FilteredTable
        columns={columns}
        dataSource={data}
        rowKey='id'
        loading={loading}
        tableHandleChange={handleTableChange}
      />
    </>
  );
};
export default TableRequestCreateTierForCustomer;
