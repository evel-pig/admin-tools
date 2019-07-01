import * as React from 'react';
import { NormalComponentProps } from '@epig/luna/lib/connect';
import menuModel, { updatePane, UpdatePanePayload, GoTabPayload, cancelModal } from '../../commonModels/menu';

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
    updatePane(payload, options);
  }

  /**
   * 跨tab跳转
   */
  go = (options: GoTabPayload) => {
    this.props.dispatch(menuModel.actions.simple.goTab(options));
  }

  /**
   * 关闭modal子页面
   */
  cancelModal = () => {
    cancelModal();
  }
}
