import { Button, Input, Select, Form, DatePicker } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';
import React from 'react';
import TableSearchBar from '..';

configure({ adapter: new Adapter() });

function createTableSearchBar(props) {
  return (
    <TableSearchBar {...props} />
  );
}

describe('TableSearchBar', () => {
  it('render TableSearchBar correctly', () => {
    let tableSearchBar = createTableSearchBar({});

    const wrapper = mount(tableSearchBar);
    expect(wrapper.find(Button)).toHaveLength(2);
    expect(wrapper.find(Button).at(0).props().children).toBe('查询');
    expect(wrapper.find(Button).at(1).props().children).toBe('重置');
  });

  it('handle search and reset correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      basicSearchs: ['S-Input'],
      fieldsValue: {},
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({ searchType: 2, searchValue: '233' });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});
  });

  it('render basicSearchs correctly', () => {
    const handleSearch = jest.fn();

    let tableSearchBar = createTableSearchBar({
      basicSearchs: [{
        type: 'SS-Input',
        props: {
          mappingType: {
            fieldName: 'testMappingType',
          },
        },
      }, 'DateRange'],
      fieldsValue: {},
      onSearch: handleSearch,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Select).at(0).simulate('click');
    wrapper.find('.ant-select-dropdown-menu-item').at(3).simulate('click');
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      searchType: 4,
      testMappingType: 1,
      searchValue: '233',
    });
  });

  it('render advanceSearchs correctly', () => {
    const handleSearch = jest.fn();

    let tableSearchBar = createTableSearchBar({
      basicSearchs: [],
      advanceSearchs: [
        {
          type: 'DateRange',
          label: '反馈时间',
          props: {
            fieldsName: ['startTime', 'endTime'],
            placeholder: ['开始日期', '结束日期'],
            initialValue: [
              moment('2017-12-01 12:00:00'),
              moment('2017-12-10 12:00:00'),
            ],
          },
        },
        {
          type: 'Select',
          label: '处理人',
          props: {
            fieldName: 'handleOperatorId',
            placeholder: '请选择',
            options: [
              {
                value: 1,
                text: '真的',
              },
              {
                value: 2,
                text: '不好',
              },
            ],
            initialValue: 2,
          },
        },
      ],
      fieldsValue: {},
      onSearch: handleSearch,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      startTime: '2017-12-01 12:00:00',
      endTime: '2017-12-10 12:00:00',
      handleOperatorId: 2,
    });
  });

  it('render basicSearchs and advanceSearchs correctly', () => {
    const handleSearch = jest.fn();

    let tableSearchBar = createTableSearchBar({
      basicSearchs: ['S-Input'],
      advanceSearchs: [{
        type: 'Input',
        label: '处理人',
        props: {
          fieldName: 'input',
          placeholder: '请选择',
        },
      }],
      fieldsValue: {},
      onSearch: handleSearch,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Input).at(0).simulate('change', { target: { value: '123' } });
    wrapper.find(Input).at(1).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      searchType: 2,
      searchValue: '123',
      input: '233',
    });
  });

  it('render fields from fieldsValue correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'DateRange',
          label: '反馈时间',
          props: {
            fieldsName: ['startTime', 'endTime'],
            placeholder: ['开始日期', '结束日期'],
            initialValue: [
              moment('2017-12-01'),
              moment('2017-12-10'),
            ],
          },
        },
        {
          type: 'Input',
          label: '处理人',
          props: {
            fieldName: 'input',
          },
        },
      ],
      fieldsValue: {
        startTime: '2018-12-01',
        endTime: '2018-12-10 12:00:00',
      },
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      startTime: '2018-12-01 00:00:00',
      endTime: '2018-12-10 12:00:00',
      input: '233',
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({
      startTime: '2017-12-01 00:00:00',
      endTime: '2017-12-10 00:00:00',
    });

  });

  it('render DatePicker correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'DatePicker',
          label: '时间',
          props: {
            fieldName: 'date',
            initialValue: moment('2017-12-01'),
          },
        },
      ],
      fieldsValue: {},
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      date: '2017-12-01 00:00:00',
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({
      date: '2017-12-01 00:00:00',
    });

  });

  it('render DateRange correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      basicSearchs: [],
      advanceSearchs: [
        {
          type: 'DateRange',
          label: '反馈时间',
          props: {
            fieldsName: ['startTime', 'endTime'],
            placeholder: ['开始日期', '结束日期'],
            initialValue: [
              moment('2017-12-01'),
              moment('2017-12-10'),
            ],
            format: 'YYYY-MM-DD',
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
          },
        },
      ],
      fieldsValue: {},
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      timezone: 1,
      startTime: '2017-12-01',
      endTime: '2017-12-10',
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({
      timezone: 1,
      startTime: '2017-12-01',
      endTime: '2017-12-10',
    });
  });

  it('render InputNumber correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'InputNumber',
          props: {
            fieldName: 'num',
          },
        },
      ],
      fieldsValue: {},
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({});

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});

    wrapper.find('.ant-input-number-input').simulate('change', { target: { value: '123' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      num: 123,
    });
  });

  it('render Radio correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'Radio',
          props: {
            fieldName: 'radio',
            options: [{
              label: 'a',
              value: 1,
            }, {
              label: 'b',
              value: 2,
            }, {
              label: 'c',
              value: 3,
            }],
          },
        },
      ],
      fieldsValue: { radio: 1 },
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      radio: 1,
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});

    wrapper.find('.ant-radio-input').at(2).simulate('change');
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      radio: 3,
    });
  });

  it('render NumberInterval correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'NumberInterval',
          props: {
            fieldsName: ['min', 'max'],
          },
        },
      ],
      fieldsValue: { min: 1, max: 10 },

      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      min: 1,
      max: 10,
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});

    wrapper.find('.ant-input-number-input').at(0).simulate('change', { target: { value: '10' } });
    wrapper.find('.ant-input-number-input').at(1).simulate('change', { target: { value: '100' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      min: 10,
      max: 100,
    });
  });

  it('render OptGroupSelect correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'OptGroupSelect',
          props: {
            fieldName: 'opts',
            options: [],
          },
        },
      ],
      fieldsValue: { opts: 1 },
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      opts: 1,
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});
  });

  it('render Checkbox correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'Checkbox',
          props: {
            fieldName: 'checkbox',
            options: [{
              label: 'a',
              value: 1,
            }, {
              label: 'b',
              value: 2,
            }],
          },
        },
      ],
      fieldsValue: { checkbox: [1] },
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      checkbox: [1],
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});

    wrapper.find('.ant-checkbox-input').at(1).simulate('change');
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      checkbox: [2],
    });
  });

  it('render Switch correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'Switch',
          props: {
            fieldName: 'switch',
          },
        },
      ],
      fieldsValue: { switch: true },
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      switch: true,
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({
      switch: false,
    });

    wrapper.find('.ant-switch').simulate('click');
    expect(handleSearch).toBeCalledWith({
      switch: true,
    });
  });

  it('render custom correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'custom',
          customRender: (form) => {
            return (
              <Form.Item key={'aaa'}>
                {form.getFieldDecorator('aaa', {
                  initialValue: moment('2019-04-01'),
                })(
                  <DatePicker />,
                )}
              </Form.Item>
            );
          },
        }, {
          type: 'custom',
          customRender: (form) => {
            return (
              <Form.Item key={'bbb'}>
                {form.getFieldDecorator('bbb', {})(
                  <Input />,
                )}
              </Form.Item>
            );
          },
        },
      ],
      fieldsValue: { aaa: moment('2019-01-01') },
      onSearch: handleSearch,
      onReset: handleReset,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      aaa: moment('2019-01-01'),
      bbb: '233',
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({
      aaa: moment('2019-04-01'),
    });
  });

  it('render omitSearchs correctly', () => {
    const handleSearch = jest.fn();
    const handleReset = jest.fn();

    let tableSearchBar = createTableSearchBar({
      advanceSearchs: [
        {
          type: 'Input',
          label: '处理人',
          props: {
            fieldName: 'input1',
          },
        },
        {
          type: 'Input',
          label: '处理人',
          props: {
            fieldName: 'input2',
          },
        },
        {
          type: 'Input',
          label: '处理人',
          props: {
            fieldName: 'input3',
            initialValue: 'input3',
          },
        }],
      fieldsValue: { input1: 'input1' },
      onSearch: handleSearch,
      onReset: handleReset,
      omitSearchs: true,
      omitSearchsNum: 1,
    });

    const wrapper = mount(tableSearchBar);

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      input1: 'input1',
    });

    wrapper.find(Button).at(1).simulate('click');
    expect(handleReset).toBeCalledWith({});

    wrapper.find('.toogle-form').simulate('click');
    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      input3: 'input3',
    });
  });

});
