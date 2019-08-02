import * as React from 'react';
import { Layout, Dropdown, Menu, Icon, Avatar } from 'antd';
import './BasicLayout.less';
import { connect } from '../util/inject';
import loginModel, { LoginState } from '../commonModels/login';
import menuModel, { MenuState } from '../commonModels/menu';
import 'moment/locale/zh-cn';
import classnames from 'classnames';
import settingModel from '../commonModels/setting';
import { createGetClassName, history } from '../util/util';
import BasicComponent from '../components/BasicComponent';
import Debounce from 'lodash-decorators/debounce';

const getClassName = createGetClassName('basic-layout');

const Header = Layout.Header;

export interface HeaderMenuItem {
  render: React.ReactNode;
  onClick: () => void;
}

export type HeaderMenuItems = {[key: string]: HeaderMenuItem};

export interface BaiscHeaderExOwnProps {
  headerMenuItems: HeaderMenuItems;
}

export interface BaiscHeaderExProps extends BaiscHeaderExOwnProps {
  login: LoginState;
  menu: MenuState;
}

export class BaiscHeaderEx extends BasicComponent<BaiscHeaderExProps, any> {
  handleClickMenu = (e) => {
    switch (e.key) {
      case 'logout':
        if (this.props.login.loading) {
          return;
        }
        this.props.dispatch(loginModel.actions.api.logout({
        }));
        break;
      case 'setting':
        this.props.dispatch(settingModel.actions.simple.toogleVisible({
          visible: true,
        }));
        break;
      default:
        break;
    }
    if (this.props.headerMenuItems[e.key]) {
      this.props.headerMenuItems[e.key].onClick();
    }
  }

  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    this.props.dispatch(menuModel.actions.simple.toogleCollapsed({
      collapsed: !this.props.menu.collapsed,
    }));
    this.triggerResizeEvent();
  }

  logout = () => {
    this.props.dispatch(loginModel.actions.api.logout({
    }));
  }

  editPassword = () => {
    history.push('/system/editPassword');
  }

  render() {
    const customMenuItems = Object.keys(this.props.headerMenuItems).map(key => {
      return this.props.headerMenuItems[key].render;
    });
    const menu = (
      <Menu selectedKeys={[]} onClick={this.handleClickMenu}>
        {customMenuItems}
        <Menu.Item key="setting"><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type={this.props.login.loading ? 'loading' : 'logout'} />退出登录</Menu.Item>
      </Menu>
    );

    const headerClass = classnames(
      getClassName('header'),
      this.props.menu.previewHeaderTheme || this.props.menu.headerTheme.value,
    );

    return (
      <Header className={headerClass}>
        <Icon
          className={getClassName('trigger')}
          type={this.props.menu.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={getClassName('right')}>
          <Dropdown overlay={menu}>
            <span className={`${'action'} ${'account'}`}>
              <Avatar
                size="small"
                className={'avatar'}
                src={this.props.menu.avatar || ''}
              />
              {this.props.menu.name}
            </span>
          </Dropdown>
          <span className={`${'setting'}`} onClick={this.editPassword}>修改密码</span>
          <span className={`${'setting'}`} onClick={this.logout}>
            退出账号
          </span>
        </div>
      </Header>
    );
  }
}

export default connect<BaiscHeaderExOwnProps>({
  menu: 'menu',
  login: 'login',
})(BaiscHeaderEx);
