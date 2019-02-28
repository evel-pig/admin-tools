import * as React from 'react';
import './InlineDiv.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('div-inline');

export interface InlineDivProps {
  style?: React.CSSProperties;
  span?: number;
}

export default class InlineDiv extends React.Component<InlineDivProps, any> {
  render() {
    let style: React.CSSProperties = {
      ...this.props.style,
    };
    if (this.props.span) {
      style = {
        ...style,
        width: `${this.props.span / 24 * 100}%`,
      };
    }

    return (
      <div className={getClassName()} style={style}>
        {this.props.children}
      </div>
    );
  }
}
