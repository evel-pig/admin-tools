import * as React from 'react';
import { Spin } from 'antd';

export interface DefaultLoadingComponentProps {
}

export default class DefaultLoadingComponent extends React.Component<DefaultLoadingComponentProps, any> {
  render() {
    return (
      <Spin size="large" style={{ width: '100%', margin: '40px 0' }} />
    );
  }
}
