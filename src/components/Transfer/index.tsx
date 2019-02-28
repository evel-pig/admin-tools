import * as React from 'react';
import { Button } from 'antd';
import './Transfer.less';
import TransferList from './TransferList';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('transfer');

export interface TransferProps {
  dataSource: TransferDataSource[];
  checkedKeys: any[];
  onChange: (moveKeys: any, direction: 1 | -1) => void;
  titles: string[];
  operationTexts?: string[];
  otherOperations?: {
    key: string;
    render: React.ReactNode;
  }[];
  disabled?: boolean;
  listStyle?: React.CSSProperties;
  targetDrag?: boolean;
  onTargetDragEnd?: (fromIndex: number, toIndex: number) => void;
  search?: boolean;
}

export interface TransferDataSource {
  key: any;
  text: string;
}

export interface MyState {
  originCheckedKeys: any[];
  targetCheckedKeys: any[];
  searchValue: string;
}

export default class Transfer extends React.Component<TransferProps, Partial<MyState>> {
  static defaultProps = {
    dataSource: [],
    checkedKeys: [],
    operations: null,
    otherOperations: [],
    disabled: false,
    targetDrag: false,
    search: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      originCheckedKeys: [],
      targetCheckedKeys: [],
      searchValue: null,
    };
  }

  handleOriginSelectAll = checked => {
    const { originDataSource } = this.getDataSource();

    this.setState({
      originCheckedKeys: checked ? originDataSource.map(item => item.key) : [],
    });
  }

  handleOriginSelect = (key, checked) => {
    let newOriginCheckedKeys = [];
    if (checked) {
      newOriginCheckedKeys = this.state.originCheckedKeys.concat([key]);
    } else {
      newOriginCheckedKeys = this.state.originCheckedKeys.filter(item => item !== key);
    }
    this.setState({
      originCheckedKeys: newOriginCheckedKeys,
    });
  }

  handleTargetSelect = (key, checked) => {
    let newTargetCheckedKeys = [];
    if (checked) {
      newTargetCheckedKeys = this.state.targetCheckedKeys.concat([key]);
    } else {
      newTargetCheckedKeys = this.state.targetCheckedKeys.filter(item => item !== key);
    }
    this.setState({
      targetCheckedKeys: newTargetCheckedKeys,
    });
  }

  handleTargetSelectAll = checked => {
    const { targetDataSource } = this.getDataSource();

    this.setState({
      targetCheckedKeys: checked ? targetDataSource.map(item => item.key) : [],
    });
  }

  handleSearch = value => {
    this.setState({ searchValue: value });
  }

  getDataSource = () => {
    const originDataSource = [];
    const targetDataSource = [];
    const { dataSource, checkedKeys } = this.props;
    dataSource.forEach(item => {
      if (checkedKeys.indexOf(item.key) >= 0) {
        targetDataSource.push(item);
      } else {
        if (this.state.searchValue) {
          if (item.text.indexOf(this.state.searchValue) > -1) {
            originDataSource.push(item);
          }
        } else {
          originDataSource.push(item);
        }
      }
    });
    targetDataSource.sort((a, b) => checkedKeys.indexOf(a.key) - checkedKeys.indexOf(b.key));
    return {
      originDataSource,
      targetDataSource,
    };
  }

  handleLeftClick = () => {
    this.props.onChange(this.state.originCheckedKeys, 1);
    this.setState({
      originCheckedKeys: [],
    });
  }

  handleRightClick = () => {
    this.props.onChange(this.state.targetCheckedKeys, -1);
    this.setState({
      targetCheckedKeys: [],
    });
  }

  renderOtherOperations = () => {
    return this.props.otherOperations.map(item => {
      return (
        <div className={getClassName('operation-btn')} key={item.key}>
          {item.render}
        </div>
      );
    });
  }

  render() {
    const { originDataSource, targetDataSource } = this.getDataSource();
    return (
      <div className={getClassName()}>
        <TransferList
          title={this.props.titles[0]}
          dataSource={originDataSource}
          checkedKeys={this.state.originCheckedKeys}
          onSelect={this.handleOriginSelect}
          onSelectAll={this.handleOriginSelectAll}
          style={this.props.listStyle}
          drag={false}
          onSearch={this.props.search ? this.handleSearch : null}
        />
        <div className={getClassName('operations')}>
          <Button
            icon="right"
            disabled={this.state.originCheckedKeys.length === 0 || this.props.disabled}
            onClick={this.handleLeftClick}
            className={getClassName('operation-btn')}
          >
            {this.props.operationTexts ? this.props.operationTexts[0] : ''}
          </Button>
          <Button
            icon="left"
            disabled={this.state.targetCheckedKeys.length === 0 || this.props.disabled}
            onClick={this.handleRightClick}
            className={getClassName('operation-btn')}
          >
            {this.props.operationTexts ? this.props.operationTexts[1] : ''}
          </Button>
          {this.renderOtherOperations()}
        </div>
        <TransferList
          title={this.props.titles[1]}
          dataSource={targetDataSource}
          checkedKeys={this.state.targetCheckedKeys}
          onSelect={this.handleTargetSelect}
          onSelectAll={this.handleTargetSelectAll}
          style={this.props.listStyle}
          drag={this.props.targetDrag}
          onDragEnd={this.props.onTargetDragEnd}
        />
      </div>
    );
  }
}
