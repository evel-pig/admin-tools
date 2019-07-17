import * as React from 'react';
import { NormalComponentProps } from '@epig/luna/lib/connect';
import { RouteProps, LayoutProps } from '../../router';

export interface LayoutComponentProps extends NormalComponentProps, RouteProps, LayoutProps {
}

/**
 * 创建Layout拓展这个组件
 */
export default class LayoutComponent<P = any, S = any> extends React.Component<LayoutComponentProps & P, S> {
  static appName = '';
  layoutName: string;

  getPageTitle = (title = '') => {
    if (!title) {
      return LayoutComponent.appName;
    }
    return `${title} - ${LayoutComponent.appName}`;
  }
}
