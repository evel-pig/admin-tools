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
import { useApi } from '@epig/luna';

export interface Page1Props {
  page1: Page1State;
  page1Actions: typeof model.actions;
}

export default function Page1(props: Page1Props) {

  const { push } = useContainer();

  const [options, setOptions] = React.useState([]);

  useApi({
    path: '/getuser',
    data: {
      id: 1,
    },
  });

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
        placeholder: '请选择',
      },
    } as NumberIntervalDecorator,
  }, {
    type: 'Select',
    label: '状态',
    props: {
      fieldName: 'status',
      options: [{
        value: 1,
        text: '1',
      }, {
        value: 2,
        text: '2',
      }],
    },
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
  }, {
    key: 'disabled',
    type: 'default',
    onClick: () => {},
    disabled: true,
    text: 'disabled',
  }, {
    key: 'goCommonContainers',
    type: 'primary',
    onClick: () => {
      push({
        componentName: 'TInfo',
      }, {});
    },
    text: 'go common containers',
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
