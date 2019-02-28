import * as React from 'react';
import './Setting.less';
import { Tabs, Form, Icon } from 'antd';
import ThemeMenu from '../components/ThemeMenu';
import { NormalComponentProps } from '@epig/luna/lib/connect';
import { connect } from '../util/inject';
import menuModel, { MenuState } from '../commonModels/menu';
import settingModel, { SettingState } from '../commonModels/setting';
import { createGetClassName } from '../util/util';

const getClassName = createGetClassName('setting');

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const headerThemes = [{
  value: 'header-default',
  text: '默认',
}, {
  value: 'header-light',
  text: '灰色',
}, {
  value: 'header-red',
  text: '红色',
}, {
  value: 'header-green',
  text: '绿色',
}, {
  value: 'header-blue',
  text: '蓝色',
}];

const siderThemes = [{
  value: 'sider-default',
  text: '默认',
}, {
  value: 'sider-light',
  text: '灰色',
}, {
  value: 'sider-red',
  text: '红色',
}, {
  value: 'sider-green',
  text: '绿色',
}, {
  value: 'sider-blue',
  text: '蓝色',
}];

export interface SettingProps extends NormalComponentProps {
  menu: MenuState;
  setting: SettingState;
}

class Setting extends React.Component<SettingProps, any> {
  handleResetHeaderTheme = () => {
    this.props.dispatch(menuModel.actions.simple.resetHeaderTheme({
    }));
  }

  handlePreviewHeaderTheme = item => {
    this.props.dispatch(menuModel.actions.simple.previewHeaderTheme({
      theme: item.value,
    }));
  }

  handleSetHeaderTheme = item => {
    this.props.dispatch(menuModel.actions.simple.setHeaderTheme({
      theme: item,
    }));
  }

  handlePreviewSiderTheme = item => {
    this.props.dispatch(menuModel.actions.simple.previewSiderTheme({
      theme: item.value,
    }));
  }

  handleResetSiderTheme = () => {
    this.props.dispatch(menuModel.actions.simple.resetSiderTheme());
  }

  handleSetSiderTheme = item => {
    this.props.dispatch(menuModel.actions.simple.setSiderTheme({
      theme: item,
    }));
  }

  handleClose = () => {
    this.props.dispatch(settingModel.actions.simple.toogleVisible({
      visible: false,
    }));
  }

  render() {
    const style: React.CSSProperties = {
      top: `${this.props.setting.visible ? '0' : '-200px'}`,
      opacity: this.props.setting.visible ? 1 : 0,
    };

    const headerTheme = this.props.menu.previewHeaderTheme || (this.props.menu.headerTheme.value || 'header-default');
    const siderTheme = this.props.menu.previewSiderTheme || (this.props.menu.siderTheme.value || 'sider-default');

    return (
      <div
        className={getClassName()}
        style={style}
      >
        <div className={getClassName('close')} onClick={this.handleClose}><Icon type="close" /></div>
        <Tabs
          animated={false}
        >
          <TabPane
            tab="基础设置"
            key="basic"
          >
            <div className={getClassName('container')}>
              <Form
                layout="inline"
              >
                <FormItem
                  label="顶部主题"
                >
                  <ThemeMenu
                    text={this.props.menu.headerTheme.text || '默认'}
                    themes={headerThemes}
                    onPreview={this.handlePreviewHeaderTheme}
                    onReset={this.handleResetHeaderTheme}
                    onSet={this.handleSetHeaderTheme}
                    selectedKeys={[headerTheme]}
                  />
                </FormItem>
                <FormItem
                  label="侧边主题"
                >
                  <ThemeMenu
                    text={this.props.menu.siderTheme.text || '默认'}
                    themes={siderThemes}
                    onPreview={this.handlePreviewSiderTheme}
                    onReset={this.handleResetSiderTheme}
                    onSet={this.handleSetSiderTheme}
                    selectedKeys={[siderTheme]}
                  />
                </FormItem>
              </Form>
            </div>
          </TabPane>
          <TabPane
            tab="高级设置"
            key="advance"
          >
            <div className={getClassName('container')}>
              高级设置
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect({
  menu: 'menu',
  setting: 'setting',
})(Setting);
