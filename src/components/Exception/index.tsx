import * as React from 'react';
import config from './typeConfig';
import { Button } from 'antd';
import './Exception.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('exception');

export interface ExceptionProps {
  type?: string;
  title?: string;
  desc?: string;
  actions?: any;
  onClick?: any;
}

export default class Exception extends React.Component<ExceptionProps, any> {
  static defaultProps = {
    onClick: () => { },
  };

  render() {
    const { type, title, desc, actions } = this.props;
    const pageType = type in config ? type : '404';

    return (
      <div className={getClassName()}>
        <div className={'content'}>
          <h1>{title || config[pageType].title}</h1>
          <div className={'desc'}>{desc || config[pageType].desc}</div>
          <div className={'actions'}>
            {actions || <Button type="primary" onClick={this.props.onClick}>返回上一页</Button>}
          </div>
        </div>
      </div>
    );
  }
}
