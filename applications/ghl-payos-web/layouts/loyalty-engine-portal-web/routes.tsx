import { Menu } from 'antd';
import Link from 'next/link';
export interface IRoutes {
  key: string;
  link: string;
  icon: any;
  title: string;
  children: Array<IRoutes>;
}
export const renderMenuByRoutes = (
  listChildren: Array<IRoutes>,
): Array<any> => {
  let menus: Array<any> = [];
  if (listChildren) {
    for (const children of listChildren) {
      if (children.children.length === 0) {
        const menuItem = (
          <Menu.Item key={`${children.key}`} icon={children.icon}>
            <Link href={children.link}>{children.title}</Link>
          </Menu.Item>
        );
        menus = [...menus, menuItem];
      } else if (children.children.length > 0) {
        const recMenu = renderMenuByRoutes(children.children);
        const menuSubMenu = (
          <Menu.SubMenu
            title={children.title}
            key={`${children.key}`}
            icon={children.icon}
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