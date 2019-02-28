import * as React from 'react';
import './BasicDetail.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('basic-detail');

export interface BasicDetailProps {
  title: string;
}

export default class BasicDetail extends React.Component<BasicDetailProps, any> {
  render() {
    return (
      <div className={getClassName()}>
        <div className={'title'}>{this.props.title}</div>
        <div className={'content'}>{this.props.children}</div>
        <div className={'line'} />
      </div>
    );
  }
}
