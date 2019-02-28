import * as React from 'react';
import './Transfer.less';
import { Checkbox, Input } from 'antd';
import { createGetClassName } from '../../util/util';
import ReactDragListView from 'react-drag-listview';

const getClassName = createGetClassName('transfer');

const Search = Input.Search;

export interface TransferDataSource {
  key: any;
  text: string;
}

export interface TransferListProps {
  title: string;
  dataSource: TransferDataSource[];
  checkedKeys: any[];
  onSelect: (selectedKey: any, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  style?: React.CSSProperties;
  drag?: boolean;
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
  onSearch?: (value: string) => void;
}

export default class TransferList extends React.Component<TransferListProps, any> {
  handleCheckAllChange = e => {
    if (this.props.dataSource.length === 0) {
      return;
    }
    this.props.onSelectAll(e.target.checked);
  }

  handleChange = (e, key) => {
    this.props.onSelect(key, e.target.checked);
  }

  handleDragEnd = (fromIndex, toIndex) => {
    if (this.props.onDragEnd) {
      this.props.onDragEnd(fromIndex, toIndex);
    }
  }

  render() {
    const indeterminate = !!this.props.checkedKeys.length
      && this.props.checkedKeys.length < this.props.dataSource.length;

    const list = this.props.dataSource.map(item => {
      return (
        <div
          className={getClassName('list-item')}
          key={item.key}
        >
          <Checkbox
            onChange={e => { this.handleChange(e, item.key); }}
            checked={this.props.checkedKeys.indexOf(item.key) >= 0}
          />
          <span className={getClassName('list-item-text')}>{item.text}</span>
        </div>
      );
    });

    return (
      <div className={getClassName('list')} style={this.props.style}>
        <div className={getClassName('list-header')}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.handleCheckAllChange}
            checked={this.props.checkedKeys.length > 0
              && this.props.checkedKeys.length === this.props.dataSource.length}
          />
          <span className={getClassName('title')}>{this.props.title}</span>
        </div>
        <div className={getClassName('list-body')}>
          {this.props.onSearch ?
            <Search
              onChange={(e) => { this.props.onSearch(e.target.value); }}
            /> : null}
          {this.props.drag ?
            <React.Fragment>
              <ReactDragListView
                onDragEnd={this.handleDragEnd}
                nodeSelector={'div'}
                handleSelector={'div'}
              >
                {list}
              </ReactDragListView>
              <div style={{ textAlign: 'center' }}>拖动调整顺序</div>
            </React.Fragment>
            : list}
        </div>
      </div>
    );
  }
}
