import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Input, Row, Select, Typography } from 'antd';
import { ENUM_LOYALTY_PROGRAM_TYPE } from 'constants/loyalty-engine-portal-web';
import {
  ENUM_PROGRAM_SEGMENT_ATTR,
  ENUM_PROGRAM_SEGMENT_LOGIC,
  ISegmentSuitableComponent,
  ISegmentSuitableComponentDetail,
  SEGMENT_CONDITION,
} from 'constants/loyalty-engine-portal-web/program';
import SegmentValueClientSource from './segment-value/SegmentValueClientSource';
import SegmentValueEventDetail from './segment-value/SegmentValueEventDetail';
import SegmentValueTier from './segment-value/SegmentValueTier';
import SegmentValueTypeOfEvent from './segment-value/SegmentValueTypeOfEvent';

interface IProps {
  form: FormInstance<any>;
  segmentItem: ISegmentSuitableComponentDetail;
  name: number;
  isEdit: boolean;
  programType: ENUM_LOYALTY_PROGRAM_TYPE;
  remove: any;
}
const ProgramSegmentItem = ({ form, name, isEdit, programType, remove }: IProps) => {
  const segmentItem = form.getFieldValue(['segment', name]);

  const SEGMENT_SUITABLE_COMPONENT: ISegmentSuitableComponent = {
    [ENUM_LOYALTY_PROGRAM_TYPE.PERK]: [
      {
        attr: ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE,
        logic: [ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS],
        value: <SegmentValueClientSource name={name} form={form} />,
      },
      {
        attr: ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER,
        logic: [ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS],
        value: <SegmentValueTier name={name} isEdit={isEdit} />,
      },
    ],
    [ENUM_LOYALTY_PROGRAM_TYPE.EARNING]: [
      {
        attr: ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE,
        logic: [ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS],
        value: <SegmentValueClientSource name={name} form={form} />,
      },
      {
        attr: ENUM_PROGRAM_SEGMENT_ATTR.TYPE_OF_EVENT,
        logic: [ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS],
        value: <SegmentValueTypeOfEvent name={name} isEdit={isEdit} />,
      },
      {
        attr: ENUM_PROGRAM_SEGMENT_ATTR.EVENT_DETAIL,
        logic: [ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS],
        value: <SegmentValueEventDetail name={name} isEdit={isEdit} />,
      },
      {
        attr: ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER,
        logic: [ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS],
        value: <SegmentValueTier name={name} isEdit={isEdit} />,
      },
    ],
  };
  const suitableSegmentDetail: ISegmentSuitableComponentDetail = SEGMENT_SUITABLE_COMPONENT[programType].find(
    (segment) => segment.attr === segmentItem.attr,
  ) as any;
  if (suitableSegmentDetail) {
    form.setFieldValue(['segment', name, 'attr'], suitableSegmentDetail.attr);
    form.setFieldValue(['segment', name, 'logic'], suitableSegmentDetail.logic[0]);
  }

  const disableDeleteBtn = () => {
    if (isEdit) return true;
    const listSegmentConditionForProgramType = SEGMENT_CONDITION[programType].find(
      (segment) => segment.attr == segmentItem.attr,
    );
    if (!listSegmentConditionForProgramType) return true;
    if (typeof listSegmentConditionForProgramType.required === 'boolean')
      return listSegmentConditionForProgramType.required;

    // check xem có lệ thuộc vào 1 component nào nữa không
    return listSegmentConditionForProgramType.required(form);
  };

  if (!suitableSegmentDetail) return <Typography>Không tìm thấy điều kiện phù hợp</Typography>;

  return (
    <>
      <Row gutter={10}>
        <Col>
          <Form.Item
            label={`Attribution `}
            name={[name, 'attr']}
            required
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Attribution không được để trống',
              },
            ]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label='Logic'
            name={[name, 'logic']}
            required
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Logic không được để trống',
              },
            ]}
          >
            <Select
              options={suitableSegmentDetail.logic.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={8}>{suitableSegmentDetail.value}</Col>
        <Col span={2}>
          <Form.Item label=' ' labelCol={{ span: 24 }}>
            <Button type='primary' danger onClick={() => remove(name)} disabled={disableDeleteBtn()}>
              <DeleteOutlined />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default ProgramSegmentItem;
