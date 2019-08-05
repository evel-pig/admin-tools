import { Layout, LocaleProvider, Menu, Icon } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { Route } from 'react-router-dom';
import { LoginState } from '../commonModels/login';
import { MenuState } from '../commonModels/menu';
import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';
import LayoutComponent from '../components/LayoutComponent';
import { connect } from '../util/inject';
import { createGetClassName } from '../util/util';
import './BasicLayout.less';
import EnhanceTab from './EnhanceTab';
import BaiscHeaderEx, { HeaderMenuItems, RightMenuItems } from './BaiscHeaderEx';
import Setting from './Setting';
import BasicSiderMenu from './BasicSiderMenu';
import moment from 'moment';

const getClassName = createGetClassName('basic-layout');

const Content = Layout.Content;

export interface BasicLayoutOwnProps {
  headerMenuItems?: HeaderMenuItems;
  rightMenuItems?: RightMenuItems;
}

export interface BasicLayoutProps extends BasicLayoutOwnProps {
  login: LoginState;
  menu: MenuState;
}

export class BasicLayout extends LayoutComponent<BasicLayoutProps, any> {
  static appName = '';
  static defaultProps: Partial<BasicLayoutProps> = {
    headerMenuItems: {
       setting: {
        render: <Menu.Item key="setting"><Icon type="setting" />设置</Menu.Item>,
      },
      logout: {
        render: <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>,
      },
    },
    rightMenuItems: {},
  };

  constructor(props) {
    super(props);

    this.layoutName = 'BasicLayout';

    LayoutComponent.appName = this.props.app.appName;
  }

  renderRoute = () => {
    return this.props.getRouteData('BasicLayout').map(item => {
      return (
        <Route
          exact={item.exact}
          key={item.path}
          path={item.path}
          component={item.component}
        />
      );
    });
  }

  render() {
    const contentStyle: React.CSSProperties = {
      margin: '4px 0',
      height: '100%',
      position: 'relative',
    };

    const passProps = {
      location: this.props.location,
      getRoute: this.props.getRoute,
      history: this.props.history,
      app: this.props.app,
    };

    const activePane = this.props.menu.paneConfigs.filter(item => item.key === this.props.menu.activePath)[0];
    let title = '';
    if (activePane) {
      title = activePane.tab;
    }

    const currentYear = moment().format('YYYY');

    return (
      <DocumentTitle title={this.getPageTitle(title)}>
        <LocaleProvider locale={zh_CN} >
          <Layout
            className={getClassName('layout')}
          >
            <BasicSiderMenu app={this.props.app} />
            <Layout className={getClassName('mainLayout')}>
              <BaiscHeaderEx
                headerMenuItems={this.props.headerMenuItems}
                rightMenuItems={this.props.rightMenuItems}
              />
              <Content style={contentStyle}>
                <Setting />
                <ErrorBoundary>
                  <EnhanceTab
                    {...passProps}
                  />
                </ErrorBoundary>
                <Footer copyright={`${currentYear} ${this.props.app.appName}`}/>
              </Content>
            </Layout>
          </Layout>
        </LocaleProvider>
      </DocumentTitle>
    );
  }
}

const ExportBasicLayout = connect<BasicLayoutOwnProps>({
  login: 'login',
  menu: 'menu',
})(BasicLayout);

export default ExportBasicLayout;

export function injectBasicLayout(props: BasicLayoutOwnProps) {
  return class extends React.Component<any, any> {
    render() {
      return (
        <ExportBasicLayout
          {...this.props}
          {...props}
        />
      );
    }
  };
}
