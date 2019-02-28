import { Layout } from 'antd';
import classnames from 'classnames';
import 'moment/locale/zh-cn';
import * as React from 'react';
import { MenuState } from '../commonModels/menu';
import LayoutComponent from '../components/LayoutComponent';
import { connect } from '../util/inject';
import { createGetClassName } from '../util/util';
import './BasicLayout.less';
import EnhanceMenu from './EnhanceMenu';

const getClassName = createGetClassName('basic-layout');

const Sider = Layout.Sider;

export interface BasicSiderMenuOwnProps {
  app: any;
}

export interface BasicSiderMenuProps extends BasicSiderMenuOwnProps {
  menu: MenuState;
}

export class BasicSiderMenu extends LayoutComponent<BasicSiderMenuProps, any> {
  render() {
    const siderTheme = this.props.menu.previewSiderTheme || this.props.menu.siderTheme.value;

    return (
      <Sider
        trigger={null}
        className={classnames('my-sider', siderTheme, getClassName('sider'))}
        width={256}
        collapsible
        collapsed={this.props.menu.collapsed}
      >
        <div className={getClassName('logo')} />
        <EnhanceMenu
          siderTheme={siderTheme}
          app={this.props.app}
        />
      </Sider>
    );
  }
}

export default connect<BasicSiderMenuOwnProps>({
  menu: 'menu',
})(BasicSiderMenu);
