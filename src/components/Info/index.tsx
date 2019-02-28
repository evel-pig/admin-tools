import * as React from 'react';
import { Row, Col } from 'antd';
import { formatLabel } from '../../util/util';
import Divider from './Divider';
import Title from './Title';

export interface InfoItemDecorator {
  /** 文本 */
  label?: string;
  /** col span */
  span?: number;
  /** 固定宽度 */
  width?: number;
  /** 内容 */
  text?: any;
  /** 自定义内容 */
  customerValue?: React.ReactNode;
}

export interface InfoProps {
  dataSource: InfoItemDecorator[][];
  rowClassName?: string;
  divider?: boolean;
  title?: string;
}

export default class Info extends React.Component<InfoProps, any> {
  static defaultProps = {
    dataSource: [],
    rowClassName: 'advance-row',
    customerValue: null,
  };
  static Divider = Divider;
  static Title = Title;

  renderDivider() {
    return (
      <Divider />
    );
  }

  hasSetSpan = (items: InfoItemDecorator[]) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].span !== undefined) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div>
        <Title
          title={this.props.title}
        />
        {this.props.dataSource.map((items, index) => {
          let span = null;
          if (!this.hasSetSpan(items)) {
            span = 24 / items.length;
          }
          return (
            <Row className={this.props.rowClassName} key={index.toString()}>
              {items.map((item, index2) => {
                let style: React.CSSProperties = {};
                if (item.width) {
                  style = {
                    ...style,
                    width: `${item.width}px`,
                  };
                }
                return (
                  <Col style={style} span={item.span || span} key={index2.toString()}>
                    {item.customerValue ? item.customerValue
                      : <p className="ant-form-text">{formatLabel(item.label)}{item.text}</p>}
                  </Col>
                );
              })}
            </Row>
          );
        })}
        {this.props.divider ? this.renderDivider() : null}
      </div>
    );
  }
}
