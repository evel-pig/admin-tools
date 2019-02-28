import * as React from 'react';
import { Switch, Router } from 'react-router';
import { Route } from 'react-router-dom';
import { getPlainNode, history } from '../util/util';

function getRouteData(navData) {
  return (layoutName: string) => {
    const route = navData.filter(item => item.layout === layoutName)[0];

    const nodeList = getPlainNode(route.children);

    return nodeList;
  };
}

function getRoute(navData) {
  return (layoutName: string, path: string) => {
    const layoutRoutes = navData.filter(item => item.layout === layoutName)[0];

    let targetRoute = null;

    layoutRoutes.children.forEach(item => {
      if (item.path === path) {
        targetRoute = { ...item };
      }
    });

    return targetRoute;
  };
}

function getRouteTitle(navData) {
  return (layoutName: string, path: string) => {
    const layoutRoutes = navData.filter(item => item.layout === layoutName)[0];

    let targetRoute = null;

    if (layoutRoutes.path === path) {
      return layoutRoutes.name;
    }

    layoutRoutes.children.forEach(item => {
      if (item.path === path) {
        targetRoute = { ...item };
      }
    });

    if (targetRoute) {
      return targetRoute.name;
    } else {
      return '';
    }
  };
}

export interface RouteProps {
  location: any;
  history: any;
}

function getReturnType<R> (f: (...args: any[]) => R): {returnType: R} {
  return null!;
}

export let getRouteDataType = getReturnType(getRouteData);
export let getRouteType = getReturnType(getRoute);
export let getRouteTitleType = getReturnType(getRouteTitle);

export interface LayoutProps {
  getRouteData: typeof getRouteDataType.returnType;
  getRoute: typeof getRouteType.returnType;
  getRouteTitle: typeof getRouteTitleType.returnType;
  app: any;
}

export interface NavDataItem {
  /** 废弃, 现在页面标题直接使用接口的数据 */
  name?: string;
  path: string;
  components: any;
  models?: any[];
}

export interface NavData {
  component: any;
  layout: string;
  /** 废弃, 现在页面标题直接使用接口的数据 */
  name?: string;
  path: string;
  children: NavDataItem[];
}

function RouterConfig(navData: NavData[], app) {
  const passProps = {
    getRouteData: getRouteData(navData),
    getRoute: getRoute(navData),
    getRouteTitle: getRouteTitle(navData),
    app,
  };

  return (
    <Router history={history}>
      <Switch>
        {navData.map(item => {
          return (
            <Route
              key={item.path}
              path={item.path}
              render={props => <item.component {...props} {...passProps} />}
            />
          );
        })}
      </Switch>
    </Router>
  );
}

export default RouterConfig;
