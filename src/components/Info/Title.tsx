import * as React from 'react';
import './Info.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('info');

export interface TitleProps {
  title?: string;
  subTitle?: string;
}

export default class Title extends React.Component<TitleProps, any> {
  render() {
    if (!this.props.title) {
      return null;
    }
    return (
      <div className={getClassName('title')}>
        <div className={getClassName('title-container')}>
          {this.props.title}
          <div className={getClassName('line')}></div>
        </div>
        {this.props.subTitle && <div className={getClassName('sub-title')}>{this.props.subTitle}</div>}
      </div>
    );
  }
}
