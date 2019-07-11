import React, { ReactNode } from 'react';
import {
  Button,
  Table,
} from 'antd';
import { ButtonType } from 'antd/lib/button/button';
import { ColumnProps as TableColumnConfig, TableProps } from 'antd/lib/table';
import TableSearchBar, {
  BasicSearchType,
  BasicSearchDecorator,
  AdvanceSearchDecorator,
  ScreenSearchDecorator,
} from '../TableSearchBar';
import { connect } from '../../util/inject';
import { ListState } from '../../model/listReducers';
import './index.less';
import { createGetClassName } from '../../util/util';
import ReactDragListView from 'react-drag-listview';
import BasicComponent from '../BasicComponent';
import adminEvent from '../../event';

const getClassName = createGetClassName('unitable');

export { ColumnProps as TableColumnConfig } from 'antd/lib/table';
export { BasicSearchDecorator, AdvanceSearchDecorator, ScreenSearchDecorator } from '../TableSearchBar';

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
  hide?: boolean;
}

export interface PageKeyName {
  pageNo: string;
  pageSize: string;
}

export type buttonsDirectionTypes = 'top' | 'bottom';

export interface UniTableOwnProps {
  /** 请求列表的apiAction */
  apiAction?: any;
  /** 行定义 */
  columns: TableColumnConfig<any>[];
  /** 表格相关数据 */
  tableState?: ListState<any>;
  /** 基础搜索 */
  basicSearchs?: BasicSearchType[] | BasicSearchDecorator[];
  /** 高级搜索 */
  advanceSearchs?: AdvanceSearchDecorator[];
  /** 筛选搜索 */
  screenSearch?: ScreenSearchDecorator[];
  /** 按钮渲染 */
  toolbarButtons?: ToolbarButtonDecorator[];
  /** 按钮方向 */
  buttonsDirection?: buttonsDirectionTypes;
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
  /** 处理进来的查询参数 */
  transformQueryDataIn?: (queryData: any) => any;
  /** 处理出去的查询数据 */
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
  /** 自定义渲染(嵌套)table */
  customRenderTable?: (table: any) => React.ReactNode;
  /** table footer */
  footer?: (currentPageData: Object[]) => React.ReactNode;
  /** table row key */
  rowKey?: string | ((record: any, index: number) => string);
}

interface UniTableProps extends UniTableOwnProps { }

interface MyState {
  selectedRowKeys: any[];
  selectedRows: any[];
}

export class UniTable extends BasicComponent<UniTableProps, Partial<MyState>> {
  static pageNoKeyName = 'pageNo';
  static pageSizeKeyName = 'pageSize';
  static globalTableProps: Partial<TableProps<any>> = {};
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
    onExpand: () => { },
    expandIcon: () => false,
    expandedRowKeys: [],
    buttonsDirection: 'bottom',
  };

  unsubscribeRefreshUniTable = null;

  advanceSearchFirstValues = null;
  screenSearchFirstValues = null;

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
      if (!this.props.advanceSearchs) {
        this.getTableList({});
      }
    }
    this.unsubscribeRefreshUniTable = adminEvent.on('refreshUniTable', ({ refreshAction }) => {
      if (this.props.apiAction && refreshAction) {
        if (this.props.apiAction().type === refreshAction().type) {
          this.getTableList(this.props.transformQueryDataIn(this.props.tableState.fieldsValue || {}));
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeRefreshUniTable) {
      this.unsubscribeRefreshUniTable();
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
    const { tableState, dispatch, apiAction, otherParams } = this.props;
    if (!apiAction) {
      return;
    }
    fieldsValue = this.props.transformQueryDataOut(fieldsValue);
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
      if (item.hide) {
        return null;
      }
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

  handleAdvanceSearchFirstLoad = (values) => {
    this.advanceSearchFirstValues = values || {};
    this.firstLoadWithSearchs();
  }

  handleScreenFirstLoad = (values) => {
    this.screenSearchFirstValues = values || {};
    this.firstLoadWithSearchs();
  }

  firstLoadWithSearchs = () => {
    if (this.advanceSearchFirstValues && this.screenSearchFirstValues) {
      this.getTableList({
        ...this.advanceSearchFirstValues,
        ...this.screenSearchFirstValues,
      });
    }
  }

  renderAdvanceSearchs = () => {
    const { basicSearchs, advanceSearchs, tableState, omitSearchs, buttonsDirection } = this.props;
    if (basicSearchs || advanceSearchs) {
      return (
        <TableSearchBar
          onReset={this.handleReset}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          advanceSearchs={advanceSearchs}
          basicSearchs={basicSearchs}
          fieldsValue={this.props.transformQueryDataIn(tableState ? tableState.fieldsValue || {} : {})}
          omitSearchs={omitSearchs}
          toolbarButtons={buttonsDirection === 'top' && this.renderButtonBar()}
          firstLoadData={this.props.firstLoadData}
          onFirstLoad={this.handleAdvanceSearchFirstLoad}
        />
      );
    } else {
      return null;
    }
  }

  renderScreenSearchs = () => {
    const { screenSearch, advanceSearchs, tableState, omitSearchs } = this.props;
    const style = {
      borderTop: '1px solid #ccc',
      marginTop: 12,
      paddingTop: 12,
    };
    if (screenSearch) {
      return (
        <div style={advanceSearchs.length > 0 && style}>
          <TableSearchBar
            onReset={this.handleReset}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            advanceSearchs={screenSearch}
            fieldsValue={this.props.transformQueryDataIn(tableState ? tableState.fieldsValue || {} : {})}
            omitSearchs={omitSearchs}
            searchText="筛选"
            firstLoadData={this.props.firstLoadData}
            onFirstLoad={this.handleScreenFirstLoad}
          />
        </div>
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
    } else if (this.props.customRenderTable) {
      return this.props.customRenderTable(table);
    } else {
      return table;
    }
  }

  getRowkey = () => {
    if (this.props.rowKey) {
      return this.props.rowKey;
    }
    return (record, index) => record.key || index.toString();
  }

  render() {
    const { tableState: t, columns, toolbarButtons, renderOtherSearchs, pagination, buttonsDirection } = this.props;
    const tableState = t || {
      infos: [],
      pagination: null,
      loading: false,
      fieldsValue: {},
    };
    let _pagination = (pagination && tableState.infos.length > 0) ? tableState.pagination : false;
    return (
      <div className={getClassName('tableList')}>
        {this.renderAdvanceSearchs()}
        {this.renderScreenSearchs()}
        {renderOtherSearchs}
        <div className={'tableListOperator'}>
          {toolbarButtons && toolbarButtons.length > 0 && buttonsDirection === 'bottom' ? this.renderButtonBar() : null}
        </div>
        {this.props.tableHeader}
        {this.renderTable(
          <Table
            {...UniTable.globalTableProps}
            columns={columns}
            rowKey={this.getRowkey()}
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
            footer={this.props.footer}
          />,
        )}
      </div>
    );
  }
}

export default connect<UniTableOwnProps>({})(UniTable);
