import { componentTag } from 'components/common/componentTag';
import dayjs from 'dayjs';
import { useCustomerTier } from 'hooks/loyalty-engine-portal-web/useCustomerTiers';
import { castArray, get, isNil } from 'lodash';
import { useRouter } from 'next/router';
import { FilteredColumnsType } from 'types/loyalty-engine-portal-web/filter-table';
import { InfoCircleOutlined } from '@ant-design/icons';
import { FilteredTable } from 'components/common/FilteredTable';
import { useCallback } from 'react';
import { TIER_ALIAS_COLOR } from 'constants/loyalty-engine-portal-web/tier';
import { ENUM_LOYALTY_TIER_NAME } from 'constants/loyalty-engine-portal-web';
import { FilterValue } from 'antd/lib/table/interface';
import { Button } from 'antd';

const TableTierForCustomer = () => {
  const router = useRouter();
  const query = router.query;
  const { data, loading } = useCustomerTier(query);
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
      title: 'Hạng hiện tại',
      dataIndex: 'tier',
      render: (text: any) => {
        const alias = get(text, 'alias', ENUM_LOYALTY_TIER_NAME.SILVER) as string;
        return componentTag(alias.toUpperCase(), TIER_ALIAS_COLOR[alias])();
      },
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
        size='small'
        columns={columns}
        dataSource={data}
        rowKey='id'
        loading={loading}
        tableHandleChange={handleTableChange}
      />
    </>
  );
};
export default TableTierForCustomer;
