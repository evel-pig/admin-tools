import * as React from 'react';
import UniTable, {
  TableColumnConfig, ToolbarButtonDecorator,
} from '../../../components/UniTable';
import {
  AdvanceSearchDecorator,
  DateRangeDecorator,
  NumberIntervalDecorator,
} from '../../../components/TableSearchBar';
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

  const [options, setOptions] = React.useState([]);

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
    props: {
      fieldsName: ['start', 'end'],
      initialValue: [],
      dateSelects: true,
    } as DateRangeDecorator,
  }, {
    type: 'NumberInterval',
    label: '范围选择',
    props: {
      fieldsName: ['min', 'max'],
      addonSelect: {
        fieldName: 'addon',
        options: options,
      },
    } as NumberIntervalDecorator,
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
  }, {
    key: 'set',
    type: 'primary',
    onClick: () => {
      setOptions([{
        value: 1,
        text: '选项1',
      }, {
        value: 2,
        text: '选项2',
      }]);
    },
    text: 'set options',
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
