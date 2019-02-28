import * as React from 'react';
import './Info.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('info');

export interface DividerProps {
}

export default class Divider extends React.Component<DividerProps, any> {
  render() {
    return (
      <div className={getClassName('divider')}>{}</div>
    );
  }
}
