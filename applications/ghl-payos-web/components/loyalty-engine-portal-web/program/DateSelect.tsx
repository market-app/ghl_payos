import React, { memo } from 'react';
import { Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

export const listDate = Array.from({ length: 31 }, (_, i) => ({
  label: `${t('Day')} ${i + 1}`,
  value: i + 1,
}));

const DateSelect = ({ name, rules, disabled }: any) => {
  const { t } = useTranslation();

  return (
    <Form.Item labelCol={{ span: 24 }} label={<b>{t('Benefit.dayInMonth')}</b>} name={name} rules={rules}>
      <Select disabled={disabled} options={listDate} placeholder={t('Benefit.dayInMonthPlaceholder')} />
    </Form.Item>
  );
};

export default memo(DateSelect);
