import { Table, Button, Input } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { UniTable } from '..';

configure({ adapter: new Adapter() });

function createUniTable(props) {
  return (
    <UniTable
      {...props}
      tableState={{
        fieldsValue: {},
        pagination: {
          current: 1,
          pageSize: 10,
          total: 100,
        },
        loading: false,
        infos: [],
        ...(props.tableState || {}),
      }}
      dispatch={() => { }}
    />
  );
}

describe('UniTable', () => {
  it('render UniTable correctly', () => {
    let uniTable = createUniTable({
      pagination: false,
    });

    const wrapper = mount(uniTable);
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('render UniTable toolbarButtons correctly', () => {

    let uniTable = createUniTable({
      toolbarButtons: [{
        key: 'plus',
        icon: 'plus',
        type: 'primary',
        onClick: () => { },
        text: '新增',
      }, {
        key: 'plus2',
        icon: 'plus',
        type: 'primary',
        onClick: () => { },
        text: '新增',
        hide: true,
      }],
    });

    const wrapper = mount(uniTable);
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('render UniTable basicSearchs correctly', () => {
    const apiAction = jest.fn();
    let uniTable = createUniTable({
      apiAction: apiAction,
      basicSearchs: ['S-Input'],
    });

    const wrapper = mount(uniTable);
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {
          searchType: 2,
          searchValue: '233',
        },
      },
      searchType: 2,
      searchValue: '233',
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Button).at(1).simulate('click');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));
  });

  it('render UniTable advanceSearchs correctly', () => {
    const apiAction = jest.fn();
    let uniTable = createUniTable({
      apiAction: apiAction,
      advanceSearchs: [{
        type: 'Input',
        label: '处理人',
        props: {
          fieldName: 'input',
          placeholder: '请选择',
        },
      }],
    });

    const wrapper = mount(uniTable);
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {
          input: '233',
        },
      },
      input: '233',
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Button).at(1).simulate('click');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));
  });

  it('render UniTable advanceSearchs and screenSearch correctly', () => {
    const apiAction = jest.fn();
    let uniTable = createUniTable({
      apiAction: apiAction,
      advanceSearchs: [{
        type: 'Input',
        label: '处理人',
        props: {
          fieldName: 'advance',
          placeholder: '请选择',
        },
      }],
      screenSearch: [{
        type: 'Input',
        label: '处理人',
        props: {
          fieldName: 'screen',
          placeholder: '请选择',
        },
      }],
    });

    const wrapper = mount(uniTable);
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Input).at(0).simulate('change', { target: { value: '123' } });
    wrapper.find(Input).at(1).simulate('change', { target: { value: '456' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {
          advance: '123',
        },
      },
      advance: '123',
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Input).at(0).simulate('change', { target: { value: '123' } });
    wrapper.find(Input).at(1).simulate('change', { target: { value: '456' } });
    wrapper.find(Button).at(2).simulate('submit');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {
          screen: '456',
        },
      },
      screen: '456',
      pageNo: 1,
      pageSize: 10,
    }));
  });

  it('render UniTable screenSearch correctly', () => {
    const apiAction = jest.fn();
    let uniTable = createUniTable({
      apiAction: apiAction,
      screenSearch: [{
        type: 'Input',
        label: '处理人',
        props: {
          fieldName: 'input',
          placeholder: '请选择',
        },
      }],
    });

    const wrapper = mount(uniTable);
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Input).simulate('change', { target: { value: '233' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {
          input: '233',
        },
      },
      input: '233',
      pageNo: 1,
      pageSize: 10,
    }));

    wrapper.find(Button).at(1).simulate('click');
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {},
      },
      pageNo: 1,
      pageSize: 10,
    }));
  });

  it('render UniTable without pagination correctly', () => {
    const apiAction = jest.fn();
    let uniTable = createUniTable({
      apiAction: apiAction,
      pagination: false,
    });

    mount(uniTable);
    expect(apiAction).toBeCalledWith({
      except: {
        fieldsValue: {},
      },
    });
  });

  it('render UniTable getTableList hooks correctly', () => {
    const apiAction = jest.fn();
    const transformQueryDataOut = jest.fn(v => v);
    const processQueryData = jest.fn(v => ({ ...v, test: 'test' }));

    let uniTable = createUniTable({
      apiAction: apiAction,
      advanceSearchs: [{
        type: 'Input',
        label: '处理人',
        props: {
          fieldName: 'input',
          placeholder: '请选择',
        },
      }],
      transformQueryDataOut: transformQueryDataOut,
      processQueryData: processQueryData,
      pagination: false,
      firstLoadData: false,
    });

    const wrapper = mount(uniTable);
    wrapper.find(Input).simulate('change', { target: { value: '123' } });
    wrapper.find(Button).at(0).simulate('submit');
    expect(transformQueryDataOut).toBeCalledWith({
      input: '123',
    });
    expect(processQueryData).toBeCalledWith({
      input: '123',
    });
    expect(apiAction).toBeCalledWith(expect.objectContaining({
      except: {
        fieldsValue: {
          input: '123',
        },
      },
      test: 'test',
      input: '123',
    }));
  });

});
