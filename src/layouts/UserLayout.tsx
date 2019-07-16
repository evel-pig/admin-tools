import * as React from 'react';
import { Route } from 'react-router-dom';
import './UserLayout.less';
import Footer from '../components/Footer';
import LayoutComponent from '../components/LayoutComponent';
import DocumentTitle from 'react-document-title';
import { createGetClassName } from '../util/util';
import { DynamicComponent } from '@epig/luna';

const getClassName = createGetClassName('user-layout');

export interface UserLayoutProps {
}

export default class UserLayout extends LayoutComponent<UserLayoutProps, any> {
  constructor(props) {
    super(props);

    this.layoutName = 'UserLayout';

    LayoutComponent.appName = this.props.app.appName;
  }

  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={getClassName('container')}>
          {
            this.props.getRouteData(this.layoutName).map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={props => {
                    const key = Object.keys(item.components)[0];
                    return (
                      <DynamicComponent
                        model={{
                          component: item.components[key],
                          models: ((item.models || {})[key] || []).concat([require('../commonModels/token')]),
                        }}
                        {...props}
                        app={this.props.app}
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
