import * as React from 'react';
import { Route } from 'react-router-dom';
import './UserLayout.less';
import Footer from '../components/Footer';
import LayoutComponent from '../components/LayoutComponent';
import DocumentTitle from 'react-document-title';
import { createGetClassName } from '../util/util';
import DynamicComponent from '@epig/luna/DynamicComponent';

const getClassName = createGetClassName('user-layout');

export interface UserLayoutProps {
}

export default class UserLayout extends LayoutComponent<UserLayoutProps, any> {
  static title = '';
  static desc = '';

  constructor(props) {
    super(props);

    this.layoutName = 'UserLayout';

    LayoutComponent.appName = this.props.app.appName;
    UserLayout.title = this.props.app.appName;
  }

  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={getClassName('container')}>
          <div className={getClassName('top')}>
            <div className={getClassName('header')}>
              <img
                alt=""
                className={getClassName('logo')}
              // src="https://gw.alipayobjects.com/zos/rmsportal/NGCCBOENpgTXpBWUIPnI.svg"
              />
              <span className={getClassName('title')}>{UserLayout.title}</span>
            </div>
            <div className={getClassName('desc')}>{UserLayout.desc}</div>
          </div>
          {
            this.props.getRouteData(this.layoutName).map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={props => {
                    return (
                      <DynamicComponent
                        model={{
                          component: item.components[Object.keys(item.components)[0]],
                        }}
                        {...props}
                      />
                    );
                  }}
                />
              ),
            )
          }
          <Footer
            className={getClassName('footer')}
            copyright={`2018 ${this.props.app.appName}`}
          />
        </div>
      </DocumentTitle>
    );
  }
}
