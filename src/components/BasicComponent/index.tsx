import * as React from 'react';
import { NormalComponentProps } from '@epig/luna/lib/connect';
import menuModel, { updatePane, UpdatePanePayload, GoTabPayload } from '../../commonModels/menu';

export interface BasicComponentProps extends NormalComponentProps {
  token: any;
}

/**
 * 创建容器拓展这个组件
 */
export default class BasicComponent<P = any, S = any> extends React.Component<BasicComponentProps & P, S> {
  dispatch = (action) => {
    this.props.dispatch(action);
  }

  /**
   * 跳转子页面
   */
  push = (payload: UpdatePanePayload, options) => {
    updatePane(this.props.dispatch, payload, options);
  }

  /**
   * 跨tab跳转
   */
  go = (options: GoTabPayload) => {
    this.props.dispatch(menuModel.actions.simple.goTab(options));
  }
}