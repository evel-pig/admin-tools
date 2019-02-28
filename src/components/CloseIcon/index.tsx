import * as React from 'react';
import './CloseIcon.less';
import { createGetClassName } from '../../util/util';
import { Icon } from 'antd';
import classnames from 'classnames';

const getClassName = createGetClassName('image-close');

export interface CloseIconProps {
  onClose: (e) => void;
  className?: string;
}

export default class CloseIcon extends React.Component<CloseIconProps, any> {
  render() {
    return (
      <span
        className={classnames(getClassName(), this.props.className)}
        onClick={this.props.onClose}
      >
        <Icon type="close" />
      </span>
    );
  }
}
