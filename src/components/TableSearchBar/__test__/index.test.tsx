import { Button, Input } from 'antd';
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

    // wrapper.find('.toogle-form').simulate('click');

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      startTime: '2017-12-01 12:00:00',
      endTime: '2017-12-10 12:00:00',
      handleOperatorId: 2,
    });
  });

  it('set DatePicker format', () => {
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
              moment('2017-12-01'),
              moment('2017-12-10'),
            ],
            format: 'YYYY-MM-DD',
          },
        },
      ],
      fieldsValue: {},
      onSearch: handleSearch,
    });

    const wrapper = mount(tableSearchBar);

    // wrapper.find('.toogle-form').simulate('click');

    wrapper.find(Button).at(0).simulate('submit');
    expect(handleSearch).toBeCalledWith({
      startTime: '2017-12-01',
      endTime: '2017-12-10',
    });
  });
});
