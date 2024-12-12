import React, { memo } from 'react';
import { Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
const { Option } = Select;

export const listDay = [
  {
    label: t('Mon'),
    value: 1,
  },
  {
    label: t('Tue'),
    value: 2,
  },
  {
    label: t('Wed'),
    value: 3,
  },
  {
    label: t('Thu'),
    value: 4,
  },
  {
    label: t('Fri'),
    value: 5,
  },
  {
    label: t('Sat'),
    value: 6,
  },
  {
    label: t('Sun'),
    value: 0,
  },
];

const DayPicker = ({ name, rules, disabled }: any) => {
  const { t } = useTranslation();

  return (
    <Form.Item labelCol={{ span: 24 }} label={<b>{t('Benefit.dayInWeek')}</b>} name={name} rules={rules}>
      <Select disabled={disabled}>
        {listDay.map((day) => (
          <Option key={day.value} value={day.value}>
            {day.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default memo(DayPicker);
