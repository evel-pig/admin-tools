import React, { ReactNode } from 'react';
import {
  Button,
  Table,
} from 'antd';
import { ButtonType } from 'antd/lib/button/button';
import { ColumnProps as TableColumnConfig } from 'antd/lib/table';
import TableSearchBar, {
  BasicSearchType,
  BasicSearchDecorator,
  AdvanceSearchDecorator,
} from '../TableSearchBar';
import { connect } from '../../util/inject';
import { ListState } from '../../model/listReducers';
import './index.less';
import { createGetClassName } from '../../util/util';
import ReactDragListView from 'react-drag-listview';
import BasicComponent from '../BasicComponent';

const getClassName = createGetClassName('unitable');

export { ColumnProps as TableColumnConfig } from 'antd/lib/table';
export { BasicSearchDecorator, AdvanceSearchDecorator } from '../TableSearchBar';

export interface ToolbarButtonDecorator {
  key: string;
  type: ButtonType;
  icon?: string;
  onClick: (selectedRows: any[]) => void;
  // onClick: (selectedRows: any[], selectedKeys: any[], queryParams: any) => void;
  // enableForAll: boolean;
  loading?: boolean;
  disabled?: boolean;
  text: string;
  enableForAll?: boolean;
}

export interface PageKeyName {
  pageNo: string;
  pageSize: string;
}

export interface UniTableOwnProps {
  /** 请求列表的apiAction */
  apiAction: any;
  /** 行定义 */
  columns: TableColumnConfig<any>[];
  /** 表格相关数据 */
  tableState: ListState<any>;
  /** 基础搜索 */
  basicSearchs?: BasicSearchType[] | BasicSearchDecorator[];
  /** 高级搜索 */
  advanceSearchs?: AdvanceSearchDecorator[];
  /** 按钮渲染 */
  toolbarButtons?: ToolbarButtonDecorator[];
  /** 其他搜索 */
  renderOtherSearchs?: any;
  /** 首次渲染是否请求apiAction */
  firstLoadData?: boolean;
  /** 是否显示分页控件 */
  pagination?: boolean;
  /** 加载数据接口需要的额外参数 */
  otherParams?: any;
  rowSelection?: boolean;
  /** 是否支持拖拽 */
  drag?: boolean;
  /** 拖拽后的回调 */
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
  /** 拖拽handleSelector */
  handleSelector?: string;
  transformQueryDataIn?: (queryData: any) => any;
  transformQueryDataOut?: (queryData: any) => any;
  pageKeyName?: PageKeyName;
  /** fieldsValue改变的回调 */
  onFieldsValueChange?: (fieldsValue: any) => void;
  /** fieldsValue查询的回调 */
  onFieldsValueSearch?: (fieldsValue: any) => void;
  /** fieldsValue重置的回调 */
  onFieldsValueReset?: (fieldsValue: any) => void;
  /** advanceSearchs是否折叠 */
  omitSearchs?: boolean;
  processQueryData?: (queryData) => any;
  tableHeader?: React.ReactNode;
  onGetData?: (requestParams: any, fieldsValue: any, pageNo: number, pageSize: number) => void;
  expandedRowRender?: (record: any, index, indent, expanded) => React.ReactNode;
  onExpand?: (expanded, record) => void;
  /** 自定义展开图标 */
  expandIcon?: (props) => ReactNode;
  /** 展开的行 */
  expandedRowKeys?: string[];
}

interface UniTableProps extends UniTableOwnProps { }

interface MyState {
  selectedRowKeys: any[];
  selectedRows: any[];
}

export class UniTable extends BasicComponent<UniTableProps, Partial<MyState>> {
  static pageNoKeyName = 'pageNo';
  static pageSizeKeyName = 'pageSize';
  static defaultProps = {
    firstLoadData: true,
    basicSearch: false,
    pagination: true,
    otherParams: {},
    rowSelection: false,
    drag: false,
    omitSearchs: true,
    transformQueryDataIn: (queryData) => queryData,
    transformQueryDataOut: (queryData) => {
      return {
        ...queryData,
      };
    },
    pageKeyName: {},
    processQueryData: queryData => queryData,
    onExpand: () => {},
  };

  tableSearchBar: any;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    const { firstLoadData } = this.props;
    if (firstLoadData) {
      let defaultValues = {};
      if (this.tableSearchBar) {
        defaultValues = this.tableSearchBar.getDefaultValue();
        defaultValues = this.tableSearchBar.transfromValues(defaultValues);
      }
      this.getTableList({
        ...defaultValues,
        ...this.props.transformQueryDataIn(this.props.tableState.fieldsValue),
      });
    }
  }

  handleSearch = (fieldsValue) => {
    const { onFieldsValueSearch } = this.props;
    if (onFieldsValueSearch) {
      onFieldsValueSearch(fieldsValue);
    }
    this.getTableList(fieldsValue, 1);
  }

  handleReset = (fieldsValue) => {
    const { onFieldsValueReset } = this.props;
    if (onFieldsValueReset) {
      onFieldsValueReset(fieldsValue);
    }
    this.getTableList(fieldsValue, 1, 10);
  }

  handleChange = (fieldsValue) => {
    const { onFieldsValueChange } = this.props;
    if (onFieldsValueChange) {
      onFieldsValueChange(fieldsValue);
    }
  }

  handleTableOnChange = (pagination, filters, sorter) => {
    const fieldsValue = this.props.transformQueryDataIn(this.props.tableState.fieldsValue);
    this.getTableList(fieldsValue, pagination.current, pagination.pageSize);
  }

  getTableList(fieldsValue?: any, pageNo?: number, pageSize?: number) {
    fieldsValue = this.props.transformQueryDataOut(fieldsValue);
    const { tableState, dispatch, apiAction, otherParams } = this.props;
    let params = {
      except: { fieldsValue: fieldsValue },
      ...otherParams,
    };
    if (this.props.pagination !== false) {
      params = {
        ...params,
        [this.props.pageKeyName.pageNo || UniTable.pageNoKeyName]: pageNo || tableState.pagination.current,
        [this.props.pageKeyName.pageSize || UniTable.pageSizeKeyName]: pageSize || tableState.pagination.pageSize,
      };
    }
    if (fieldsValue) {
      const queryData = this.props.processQueryData(fieldsValue);
      params = { ...params, ...queryData };
    }
    if (this.props.onGetData) {
      this.props.onGetData(params, fieldsValue, pageNo, pageSize);
    }

    dispatch(apiAction(params));
    this.setState({
      selectedRowKeys: [],
    });
  }

  renderButtonBar() {
    const { toolbarButtons } = this.props;
    return toolbarButtons.map((item, index) => {
      const enableForAll = typeof item.enableForAll === 'undefined' ? true : item.enableForAll;
      return (
        <Button
          key={item.key}
          icon={item.icon}
          type={item.type}
          onClick={() => {
            item.onClick(this.state.selectedRows);
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          }}
          disabled={enableForAll ? false : this.state.selectedRowKeys.length === 0}
        >
          {item.text}
        </Button>
      );
    });
  }

  renderAdvanceSearchs = () => {
    const { basicSearchs, advanceSearchs, tableState, omitSearchs } = this.props;
    if (basicSearchs || advanceSearchs) {
      return (
        <TableSearchBar
          onReset={this.handleReset}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          advanceSearchs={advanceSearchs}
          basicSearchs={basicSearchs}
          fieldsValue={this.props.transformQueryDataIn(tableState.fieldsValue)}
          wrappedComponentRef={(form) => this.tableSearchBar = form}
          omitSearchs={omitSearchs}
        />
      );
    } else {
      return null;
    }
  }

  handleChangeRow = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
    });
  }

  renderTable = (table: ReactNode) => {
    if (this.props.drag) {
      return (
        <ReactDragListView
          handleSelector={this.props.handleSelector || 'tr'}
          onDragEnd={this.props.onDragEnd}
        >
          {table}
        </ReactDragListView>
      );
    } else {
      return table;
    }
  }

  render() {
    const { tableState, columns, toolbarButtons, renderOtherSearchs,  pagination } = this.props;
    let _pagination = (pagination && tableState.infos.length > 0) ? tableState.pagination : false;
    return (
      <div className={getClassName('tableList')}>
        {this.renderAdvanceSearchs()}
        {renderOtherSearchs}
        <div className={'tableListOperator'}>
          {toolbarButtons && toolbarButtons.length > 0 ? this.renderButtonBar() : null}
        </div>
        {this.props.tableHeader}
        {this.renderTable(
          <Table
            columns={columns}
            rowKey={(record, index) => index.toString()}
            dataSource={tableState.infos}
            pagination={_pagination}
            onChange={this.handleTableOnChange}
            loading={tableState.loading}
            rowSelection={this.props.rowSelection ? {
              selections: true,
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.handleChangeRow,
            } : null}
            expandedRowRender={this.props.expandedRowRender}
            onExpand={this.props.onExpand}
            expandIcon={this.props.expandIcon}
            expandedRowKeys={this.props.expandedRowKeys}
          />,
        )}
      </div>
    );
  }
}

export default connect<UniTableOwnProps>({})(UniTable);
