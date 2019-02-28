import * as React from 'react';
import './Error.less';
import { Button } from 'antd';
import { createGetClassName } from '../../util/util';

const prefix = 'error';

const getClassName = createGetClassName(prefix);

export interface ErrorProps {
}

export default class Error extends React.Component<ErrorProps, any> {
  handleRefresh = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className={getClassName()}>
        <div className={'text'}>发生错误，刷新再试</div>
        <Button onClick={this.handleRefresh} type="primary">刷新</Button>
      </div>
    );
  }
}
