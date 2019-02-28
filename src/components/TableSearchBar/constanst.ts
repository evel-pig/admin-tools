const SINPUT_CONFIG = {
  label: '关键词',
  type: 'SelectInput',
  props: {
    searchType: {
      fieldName: 'searchType',
      initialValue: 2,
      options: [{
        value: 2,
        text: '反馈账号',
      }, {
        value: 3,
        text: '关键词',
      }],
    },
    searchValue: {
      fieldName: 'searchValue',
      placeholder: '请输入关键词',
    },
  },
};

const SSINPUT_CONFIG = {
  label: '',
  type: 'SelectInput',
  props: {
    searchType: {
      fieldName: 'searchType',
      initialValue: 1,
      options: [{
        value: 1,
        text: '流水号',
      }, {
        value: 2,
        text: '手机号',
      }, {
        value: 3,
        text: '身份证号',
      }, {
        value: 4,
        text: '姓名',
      }],
    },
    mappingType: {
      fieldName: 'mappingType',
      initialValue: 1,
      options: [{
        value: 1,
        text: '等于',
      }, {
        value: 2,
        text: '半模糊',
      }, {
        value: 3,
        text: '全模糊',
      }],
    },
    searchValue: {
      fieldName: 'searchValue',
      placeholder: '请输入关键词',
    },
  },
};

const DATERANGE_CONFIG = {
  type: 'DateRange',
  label: '反馈时间',
  props: {
    fieldsName: ['startTime', 'endTime'],
    placeholder: ['开始日期', '结束日期'],
  },
};

export {
  SINPUT_CONFIG,
  SSINPUT_CONFIG,
  DATERANGE_CONFIG,
};
