import { Card, Flex, Typography } from 'antd';

interface IProps {
  amount: number;
  title: string;
  durationType: string;
  id: number;
}
const PlanItem = (plan: IProps) => {
  const cardStyle = { 
    width: "360px", 
    height: "192px", 
    borderRadius: "16px", 
    marginRight: "24px", 
    boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" 
 }
  return (
    <Card style={{ width: '300px', borderRadius:'10px' , border:'1px #6655ff solid'}} hoverable>
      <Flex justify={'space-between'} >
        <Typography> Gói {plan.title}</Typography>
        <Flex>
          <Typography>{plan.amount}</Typography>
          <Typography>{plan.durationType}</Typography>
        </Flex>
      </Flex>
    </Card>
  );
};
export default PlanItem;
