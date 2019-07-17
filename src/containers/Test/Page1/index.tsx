import * as React from 'react';
import UniTable, {
  TableColumnConfig, ToolbarButtonDecorator,
} from '../../../components/UniTable';
import { AdvanceSearchDecorator, DateRangeDecorator } from '../../../components/TableSearchBar';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import useContainer from '../../../hooks/useContainer';
import model, { Page1State } from './model';

export interface Page1Props {
  page1: Page1State;
  page1Actions: typeof model.actions;
}

export default function Page1(props: Page1Props) {

  const { push } = useContainer();

  const searchs1: AdvanceSearchDecorator[] = [{
    type: 'Input',
    props: {
      fieldName: 'input',
    },
  }];

  const searchs2: AdvanceSearchDecorator[] = [{
    type: 'custom',
    customRender: (form) => {
      return (
        <Form.Item key={'custom'} label={'自定义'}>
          {form.getFieldDecorator('custom', {
            initialValue: moment('2019-04-01'),
          })(
            <DatePicker />,
          )}
        </Form.Item>
      );
    },
  }, {
    type: 'DateRange',
    label: '时间选择',
    props: {
      fieldsName: ['start', 'end'],
      addonSelect: {
        fieldName: 'timezone',
        initialValue: 1,
        options: [{
          value: 1,
          text: '北京时间',
        }, {
          value: 2,
          text: '美东时间',
        }],
      },
      dateSelects: true,
    } as DateRangeDecorator,
  }];

  const columns: TableColumnConfig<any>[] = [{
    dataIndex: 'id',
    title: 'id',
  }];

  const toolbarButtons: ToolbarButtonDecorator[] = [{
    key: 'plus',
    icon: 'plus',
    type: 'primary',
    onClick: () => {
      push({
        componentName: 'SubPage',
      }, null);
    },
    text: '新增',
  }];

  return (
    <UniTable
      columns={columns}
      basicSearchs={['S-Input', 'DateRange']}
      advanceSearchs={searchs1}
      screenSearch={searchs2}
      omitSearchs={false}
      toolbarButtons={toolbarButtons}
      apiAction={props.page1Actions.api.getList}
      tableState={props.page1}
    />
  );
}
