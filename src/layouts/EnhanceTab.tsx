import { Button, Modal } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import menuModel, { BackComponentDecorator, MenuState, MenuDecorator } from '../commonModels/menu';
import { DynamicComponent } from '@epig/luna';
import LayoutComponent, { LayoutComponentProps } from '../components/LayoutComponent';
import Tab from '../components/Tab';
import Exception404 from '../containers/Exception/404';
import { connect } from '../util/inject';
import { createGetClassName } from '../util/util';
import './EnhanceTab.less';
import { Breadcrumb } from 'antd';

const getClassName = createGetClassName('e-tab');

interface EnhanceTabOwnProps {
  style?: React.CSSProperties;
}

export interface EnhanceTabProps extends EnhanceTabOwnProps {
  data: MenuState;
}

class EnhanceTab extends LayoutComponent<EnhanceTabProps, any> {
  panes: {
    key: string;
    contentNode: React.ReactNode;
    isActive: boolean;
    componentName: string;
  }[];
  models: any;

  constructor(props) {
    super(props);

    this.panes = [];
    this.models = {};

    if (props.app.noRequestMenu) {
      this.beforeUpdatePaneConfig(props).then(() => {
        this.updatePaneConfig(props.location.pathname, props);
      });
    }
  }

  componentDidUpdate(prevProps: any, prevState) {
    if (!this.props.data.loading && prevProps.data.loading) {
      this.beforeUpdatePaneConfig(this.props).then(() => {
        this.updatePaneConfig(this.props.location.pathname, this.props);
      });
      return;
    }
    if (this.props.location.pathname === prevProps.location.pathname) {
      if (window['hotReloadLayout']) {
        window['hotReloadLayout'] = false;
        this.beforeUpdatePaneConfig(this.props).then(() => {
          this.updatePaneConfig(this.props.location.pathname, this.props);
        });
      }
      return;
    }

    this.beforeUpdatePaneConfig(this.props).then(() => {
      this.updatePaneConfig(this.props.location.pathname, this.props);
    });
  }

  beforeUpdatePaneConfig = (props) => {
    return new Promise(resolve => {
      let targetRoute = props.getRoute('BasicLayout', props.location.pathname);

      if (targetRoute) {
        const models = {};
        Object.keys(targetRoute.components).map(key => {
          models[key] = {
            component: targetRoute.components[key],
            models: ((targetRoute.models || {})[key] || []).concat([require('../commonModels/token')]),
          };
        });
        this.models = {
          ...this.models,
          ...models,
        };
        resolve();
      } else {
        resolve();
      }
    });
  }

  updatePaneConfig = (pathname, props: EnhanceTabProps & LayoutComponentProps) => {
    const { dispatch, data } = props;
    if (pathname === '/') {
      if (props.data.exception) {
        dispatch(menuModel.actions.simple.activePane({
          activePath: pathname,
          activeSubMenu: '',
        }));
      }
      if (props.data.paneConfigs.length > 0) {
        props.history.push(props.data.paneConfigs[props.data.paneConfigs.length - 1].key);
      }
      return;
    }
    const subMenuName = pathname.match(/[^\/]\w+/)[0];
    const itemName = pathname.match(/[^\/]\w+$/)[0];
    const { paneConfigs } = data;

    let menus = data.menus;
    if (!menus) {
      return;
    }

    let subMenu = menus.filter(menu => menu.name === subMenuName)[0];
    if (!subMenu) {
      dispatch(menuModel.actions.simple.setException({
        exception: '404',
      }));
      return;
    }
    let item: MenuDecorator = null;
    if (subMenu.leaf) {
      item = subMenu;
    } else {
      item = subMenu.items.filter(t => t.name === itemName)[0];
    }
    if (!item) {
      dispatch(menuModel.actions.simple.setException({
        exception: '404',
      }));
      return;
    }
    let breadcrumbNames = [];
    if (item.name === subMenu.name) {
      breadcrumbNames = [
        subMenu.text,
      ];
    } else {
      breadcrumbNames = [
        subMenu.text,
        item.text,
      ];
    }
    dispatch(menuModel.actions.simple.changeBreadcrumbNames({
      breadcrumbNames,
    }));
    let pane = paneConfigs.filter(t => t.key === pathname);
    if (pane.length > 0) {
      dispatch(menuModel.actions.simple.activePane({
        activePath: pathname,
        activeSubMenu: subMenuName,
      }));
      return;
    }
    dispatch(menuModel.actions.simple.pushPane({
      activePath: pathname,
      title: item.text,
      activeSubMenu: subMenuName,
    }));
  }

  handleTabRemove = (targetKey) => {
    const { dispatch, data } = this.props;
    let { activePath, paneConfigs } = data;
    let lastIndex = -1;
    paneConfigs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    if (lastIndex >= 0) {
      activePath = paneConfigs[lastIndex].key;
    } else {
      if (paneConfigs.length - 1 > 0) {
        lastIndex = lastIndex + 1;
        activePath = paneConfigs[lastIndex + 1].key;
      } else {
        activePath = '';
      }
    }
    // 当activePath === ''，返回主页
    if (activePath === '') {
      activePath = '/';
    }
    this.props.history.push({
      pathname: activePath,
    });
    dispatch(menuModel.actions.simple.popPane({
      key: targetKey,
      activePath: activePath,
    }));
  }

  handleTabChane = activeKey => {
    this.props.history.push({
      pathname: activeKey,
    });
  }

  handleRemoveOthers = () => {
    this.props.dispatch(menuModel.actions.simple.removeOtherPanes());
  }

  handleRefresh = (e) => {
    const { activePath, paneConfigs } = this.props.data;
    let paneConfig = paneConfigs.filter(t => t.key === activePath)[0];
    let oldComponentName = paneConfig.componentName;
    this.props.dispatch(menuModel.actions.simple.refreshPane({
      loading: true,
      newComponentName: oldComponentName,
    }));
  }

  handleBack = (backComponent: BackComponentDecorator) => {
    const { dispatch } = this.props;
    dispatch(menuModel.actions.simple.back());
    if (backComponent.onClick) {
      backComponent.onClick();
    }
  }

  getComponent = (key, componentName, options): string | React.ReactNode => {
    let model = this.models[componentName];
    if (!model) {
      return '';
    }

    if (options) {
      return <DynamicComponent model={model} key={componentName} options={options} />;
    } else {
      return <DynamicComponent model={model} key={componentName} />;
    }
  }

  renderBreadcrumbName = () => {
    return (
      <div className={getClassName('breadcrumb')}>
        <Breadcrumb>
          {this.props.data.breadcrumbNames.map((item, index) => {
            return <Breadcrumb.Item key={index.toString()} >{item}</Breadcrumb.Item>;
          })}
        </Breadcrumb>
      </div>
    );
  }

  renderTabPanes = () => {
    if (this.props.data.loading) {
      return null;
    }
    if (this.props.data.exception) {
      return <Exception404 />;
    }

    const { paneConfigs, activePath } = this.props.data;
    let newPanes = [];
    let currentBackComponent = null;
    let tabs = [];
    if (activePath) {
      paneConfigs.forEach((paneConfig, index) => {
        let ComponentNode = this.getComponent(paneConfig.key, paneConfig.componentName, paneConfig.options);
        let pane = this.panes.filter(t => t.key === paneConfig.key);
        let isNew = false;
        if (pane.length === 0) {
          isNew = true;
        } else {
          if (pane[0].key) {
            if (pane[0].componentName !== paneConfig.componentName) {
              isNew = true;
            }
          } else {
            isNew = true;
          }
          if (pane[0].contentNode === '') {
            isNew = true;
          }
        }

        if (isNew || window['hotReload']) {
          newPanes.push(getTabPane(
            paneConfig.key, ComponentNode, paneConfig.key === activePath, paneConfig.componentName,
          ));
        } else {
          newPanes.push({
            ...pane[0],
            isActive: paneConfig.key === activePath,
          });
        }
        if (activePath === paneConfig.key) {
          currentBackComponent = paneConfig.backComponent;
        }

        tabs.push({
          key: paneConfig.key,
          tab: paneConfig.tab,
        });
      });
    }

    if (!this.props.data.multipleTab) {
      newPanes = newPanes.filter(pane => pane.key === this.props.data.activePath);
      tabs = tabs.filter(tab => tab.key === this.props.data.activePath);
    }

    // if (window['hotReload']) {
    //   window['hotReload'] = false;
    // }
    this.panes = newPanes;
    if (this.panes.length > 0) {
      let backButton = null;
      if (currentBackComponent) {
        backButton = (
          <Button type="primary" onClick={() => { this.handleBack(currentBackComponent); }}>返回</Button>
        );
      }
      const operations = (
        <div className={getClassName('tab-operations')}>
          {this.props.data.multipleTab && <Button onClick={this.handleRemoveOthers}>关闭其他</Button>}
          <Button onClick={this.handleRefresh}>刷新</Button>
          {backButton}
          {!this.props.data.multipleTab && this.renderBreadcrumbName()}
        </div>
      );
      return (
        <React.Fragment>
          <div className={getClassName('header')}>
            <Tab
              activeKey={activePath}
              tabs={this.props.data.multipleTab ? tabs : []}
              onTabChange={this.handleTabChane}
              onTabRemove={this.handleTabRemove}
              operations={operations}
            />
          </div>
          <div className={getClassName('content-wrapper')}>
            {this.panes.map(item => {
              if (this.props.data.multipleTab) {
                const keyArr = item.key.split('/');
                keyArr.splice(0, 1);
                return (
                  <div
                    className={classnames(getClassName('content'), keyArr.join('-'), {
                      [getClassName('content-item-active')]: item.isActive,
                      [getClassName('content-item-inactive')]: !item.isActive,
                    })}
                    key={item.key}
                  >
                    {item.contentNode}
                  </div>
                );
              } else {
                return item.contentNode;
              }
            })}
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  renderModalPane = () => {
    const { modalPaneConfig } = this.props.data;

    if (this.props.data.modalPaneConfig) {
      let ComponentNode = this.getComponent(
        modalPaneConfig.key,
        modalPaneConfig.componentName,
        modalPaneConfig.options,
      );

      return (
        <Modal
          visible
          title={modalPaneConfig.title}
          footer={[]}
          onCancel={() => {
            if (modalPaneConfig.onCancel) {
              modalPaneConfig.onCancel();
            }
            this.props.dispatch(menuModel.actions.simple.startCancelModal());
          }}
          width={modalPaneConfig.width}
        >
          {ComponentNode}
        </Modal>
      );
    }
    return null;
  }

  render() {
    return (
      <div style={this.props.style} className={getClassName('tab')}>
        {this.renderTabPanes()}
        {this.renderModalPane()}
      </div>
    );
  }
}

export default connect({
  'data': 'menu',
})(EnhanceTab);

let getTabPane = (key, contentNode, isActive: boolean, componentName) => {
  return {
    key,
    contentNode,
    isActive,
    componentName,
  };
};
