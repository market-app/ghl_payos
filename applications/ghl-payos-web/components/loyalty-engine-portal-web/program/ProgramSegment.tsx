import { Button, Form, FormInstance, Select, Space, Typography } from 'antd';
import { ENUM_LOYALTY_PROGRAM_TYPE } from 'constants/loyalty-engine-portal-web';
import {
  ENUM_PROGRAM_SEGMENT_ATTR,
  ENUM_PROGRAM_SEGMENT_EVENT_DETAIL_VALUE,
  ENUM_PROGRAM_SEGMENT_LOGIC,
  ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE,
  ISegmentSuitableComponentDetail,
  SEGMENT_CONDITION,
} from 'constants/loyalty-engine-portal-web/program';
import { differenceBy, isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import ProgramSegmentItem from './ProgramSegmentItem';

interface IProps {
  form: FormInstance<any>;
  isEdit: boolean;
  programType: ENUM_LOYALTY_PROGRAM_TYPE;
}
const ProgramSegment = ({ form, isEdit, programType }: IProps) => {
  const programSegment: ISegmentSuitableComponentDetail[] = Form.useWatch(['segment'], form);
  const [showOptionSegment, setShowOptionSegment] = useState(false);
  // trigger khi value option thay change là nó remove luôn
  const [valueOption, setValueOption] = useState<string | null>(null);

  const listSegmentItemSuitableForAdd = useMemo(() => {
    if (!programType || isEmpty(programSegment)) return [];

    const listSegment = differenceBy(SEGMENT_CONDITION[programType], programSegment, 'attr');
    return listSegment;
  }, [programSegment, programType]);

  const handleChangeOption = (value: string, add: any) => {
    add(SEGMENT_CONDITION[programType].find((item) => item.attr === value));
    setValueOption(null);
  };

  useEffect(() => {
    if (isEmpty(programSegment)) return;

    // trigger khi type_of_event = non_transaction thì thêm event_type = birthday
    const isExistTypeOfEventNonTransaction = programSegment.find(
      (segmentItem) =>
        segmentItem.attr === ENUM_PROGRAM_SEGMENT_ATTR.TYPE_OF_EVENT &&
        segmentItem.value == ENUM_PROGRAM_SEGMENT_TYPE_OF_EVENT_VALUE.NON_TRANSACTION,
    );
    const isExistEventDetail = programSegment.find(
      (segmentItem) => segmentItem.attr === ENUM_PROGRAM_SEGMENT_ATTR.EVENT_DETAIL,
    );
    if (isExistTypeOfEventNonTransaction && !isExistEventDetail) {
      form.setFieldValue('segment', [
        ...programSegment,
        {
          attr: ENUM_PROGRAM_SEGMENT_ATTR.EVENT_DETAIL,
          logic: ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS,
          value: ENUM_PROGRAM_SEGMENT_EVENT_DETAIL_VALUE.BIRTHDAY,
        },
      ]);
    }
  }, [programSegment]);

  return (
    <>
      <Form.List name={['segment']}>
        {(fields, { add, remove }) => (
          <>
            {programType &&
              fields.map(({ key, name, ...restField }, index) => (
                <ProgramSegmentItem
                  remove={remove}
                  programType={programType}
                  segmentItem={{ name, ...restField } as any}
                  form={form}
                  key={key}
                  name={index}
                  isEdit={isEdit}
                />
              ))}

            <Space
              style={{
                width: '100%',
                marginBottom: '20px',
                display: listSegmentItemSuitableForAdd.length ? '' : 'none',
              }}
            >
              {showOptionSegment ? (
                <>
                  <Typography>Chọn điều kiện:</Typography>
                  <Select
                    disabled={!listSegmentItemSuitableForAdd.length}
                    value={valueOption}
                    onChange={(value) => handleChangeOption(value, add)}
                    style={{ minWidth: '200px' }}
                    options={listSegmentItemSuitableForAdd.map((item) => ({
                      value: item.attr,
                      label: item.attr,
                    }))}
                  />
                </>
              ) : (
                <Button
                  type='primary'
                  disabled={!listSegmentItemSuitableForAdd.length}
                  onClick={() => setShowOptionSegment(true)}
                >
                  Thêm điều kiện
                </Button>
              )}
            </Space>
          </>
        )}
      </Form.List>
    </>
  );
};
export default ProgramSegment;
