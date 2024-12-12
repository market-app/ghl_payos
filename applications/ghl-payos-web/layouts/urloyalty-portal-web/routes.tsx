import { Menu } from 'antd';
import Link from 'next/link';
export interface IRoutes {
  key: string;
  link: string;
  icon: any;
  title: string;
  child: Array<IRoutes>;
}
const renderMenuByRoutes = (
  children: Array<IRoutes>,
  campaignId: any,
): Array<any> => {
  let menus: Array<any> = [];
  if (children) {
    for (const item of children) {
      if (item.child.length === 0) {
        const menuItem = (
          <Menu.Item key={`${item.key}`} icon={item.icon}>
            <Link href={item.link}>{item.title}</Link>
          </Menu.Item>
        );
        menus = [...menus, menuItem];
      } else if (item.child.length > 0) {
        const recMenu = renderMenuByRoutes(item.child, campaignId);
        const menuSubMenu = (
          <Menu.SubMenu
            title={item.title}
            key={`${item.key}`}
            icon={item.icon}
          >
            {recMenu}
          </Menu.SubMenu>
        );
        menus = [...menus, menuSubMenu];
      }
    }
  } else return [];
  return menus;
};
const routes = ({
  routes = [],
  campaignId,
}: {
  routes: Array<IRoutes>;
  campaignId: any;
}) => {
  const componentMenu = renderMenuByRoutes(routes, campaignId);
  return componentMenu;
};
export default routes;
