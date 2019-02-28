import * as React from 'react';
import { Menu, Icon } from 'antd';
import menuModel, { MenuState, MenuDecorator } from '../commonModels/menu';
import { connect } from '../util/inject';
import BasicComponent from '../components/BasicComponent';
import classnames from 'classnames';
import { createGetClassName, history, adminNormalActions } from '../util/util';
const SubMenu = Menu.SubMenu;

const getClassName = createGetClassName('basic-layout');

export interface EnhanceMenuOwnProps {
  siderTheme: string;
  app: any;
}

export interface EnhanceMenuProps extends EnhanceMenuOwnProps {
  data: MenuState;
}

class EnhanceMenu extends BasicComponent<EnhanceMenuProps, any> {
  componentDidMount() {
    if (this.props.app.noRequestMenu) {
      if (!this.props.token.token) {
        this.props.dispatch(adminNormalActions.loginTimeout({}));
        history.push({
          pathname: '/user/login',
        });
      } else {
        if (this.props.app.checkPermission) {
          this.props.dispatch(menuModel.actions.simple.checkPermission({}));
        }
      }
      return;
    }
    this.props.dispatch(menuModel.actions.api.getOperatorInfo({}));
  }

  handleSubMenuChange = (openKeys) => {
    const { dispatch } = this.props;
    dispatch(menuModel.actions.simple.changeSubMenu({
      activeSubMenu: openKeys,
    }));
  }

  renderMenuItem = (subItem: MenuDecorator, item: MenuDecorator) => {
    let key = null;
    let text = null;
    let icon = '';
    if (item) {
      key = `/${subItem.name}/${item.name}`;
      text = item.text;
      icon = item.icon;
    } else {
      key = `/${subItem.name}`;
      text = subItem.text;
      icon = subItem.icon;
    }
    return (
      <Menu.Item
        key={key}
      >
        <span><Icon type={icon} /><span>{text}</span></span>
      </Menu.Item>
    );
  }

  renderMenus = () => {
    const { data } = this.props;
    const menus = data.menus.map(menu => {
      if (menu.leaf) {
        return this.renderMenuItem(menu, null);
      }
      // 当子节点leaf为false的时候，menu.items才有值
      let items = !menu.leaf ? menu.items : [];
      const menuItems = items.filter(item => item.notDisplayInMenu !== true).map(item => {
        return this.renderMenuItem(menu, item);
      });
      if (menuItems.length === 0) {
        return null;
      }
      return (
        <SubMenu
          key={menu.name}
          title={<span><Icon type={menu.icon}/><span>{menu.text}</span></span>}
        >
          {menuItems}
        </SubMenu>
      );
    });
    return menus.filter(item => item !== null);
  }

  handleSelect = ({ key }) => {
    history.push(key);
  }

  render() {
    const sidebar = this.props.data;

    const menuClass = classnames(getClassName('menu'), 'my-sider', this.props.siderTheme);

    return (
      <div className={getClassName('menuOutWrap')}>
        <div
          className={getClassName('menuWrap')}
          style={{ width: '273px' }}
        >
          <Menu
            theme="dark"
            mode="inline"
            onOpenChange={this.handleSubMenuChange}
            openKeys={sidebar.activeSubMenu}
            selectedKeys={[sidebar.activePath]}
            className={menuClass}
            style={this.props.data.collapsed ? {} : { width: '256px' }}
            onSelect={this.handleSelect}
          >
            {this.renderMenus()}
          </Menu>
        </div>
      </div>
    );
  }
}

export default connect<EnhanceMenuOwnProps>({
  'data': 'menu',
})(EnhanceMenu);
