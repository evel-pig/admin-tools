import React, { PureComponent } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  Icon,
  DatePicker,
  InputNumber,
  Radio,
  Tag,
  Checkbox,
} from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { DATE_FORMAT, DATEONLY_FORMAT } from '../../util/constants';
import { SINPUT_CONFIG, SSINPUT_CONFIG, DATERANGE_CONFIG } from './constanst';
import './index.less';
import { createGetClassName } from '../../util/util';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

const className = createGetClassName('table-search-bar');

const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class AllCheckboxGroup extends React.Component<CheckboxGroupProps, any> {
  handleClear = () => {
    this.props.onChange([]);
  }

  render() {
    return (
      <div>
        <span onClick={this.handleClear} style={{ cursor: 'pointer', color: '#1890ff', marginRight: '10px' }}>清除</span>
        <CheckboxGroup {...this.props} />
      </div>
    );
  }
}

interface BaseSelect {
  value: any;
  text: string;
  color: string;
  onClick?: (value: string) => Moment[];
}

type DateSelectValue = 'lastOne' | 'lastThree' | 'lastWeek' | 'lastMonth';

interface DateSelect extends BaseSelect {
  value: DateSelectValue;
}

const handleTagClick = (value: DateSelectValue) => {
  switch (value) {
    case 'lastOne':
      const lastDay = moment().subtract(1, 'day');
      return [lastDay, lastDay];
    case 'lastThree':
      return [moment().subtract(2, 'day'), moment().subtract(0, 'day')];
    case 'lastWeek':
      return [moment().subtract(6, 'day'), moment().subtract(0, 'day')];
    case 'lastMonth':
      return [moment().subtract(29, 'day'), moment().subtract(0, 'day')];
    default:
      break;
  }

  return [];
};

const defaultDateSelects: DateSelect[] = [
  {
    value: 'lastOne',
    text: '昨天',
    color: '#ff7875',
    onClick: handleTagClick,
  },
  {
    value: 'lastThree',
    text: '前3天',
    color: '#ff4d4f',
    onClick: handleTagClick,
  },
  {
    value: 'lastWeek',
    text: '前7天',
    color: '#f5222d',
    onClick: handleTagClick,
  },
  {
    value: 'lastMonth',
    text: '前30天',
    color: '#cf1322',
    onClick: handleTagClick,
  },
];

export interface BasicOptionsDecorator {
  /** 值 */
  value?: number | string;
  id?: number;
  /** 显示的文字 */
  text?: string;
  name?: string;
}

export interface CommonSearchPropsDecorator {
  fieldName: string;
  visible?: (values: any) => boolean;
  className?: string;
}

export interface InputDecorator extends CommonSearchPropsDecorator {
  initialValue?: string;
}

export interface InputNumberDecorator extends CommonSearchPropsDecorator {
  initialValue?: string;
}

export interface BaseSelectDecorator extends CommonSearchPropsDecorator {
  initialValue?: number | string;
  options: BasicOptionsDecorator[];
  allowClear?: boolean;
  mode?: 'multiple' | 'tags' | 'combobox';
  disabled?: boolean;
  onChange?: (value: any, options: any) => void;
  changeFieldName?: string;
  changeFieldValue?: number | string;
}

export interface BaseInputDecorator {
  fieldName: string;
  initialValue?: string;
  placeholder?: string;
}

export interface DateRangeDecorator extends CommonSearchPropsDecorator {
  fieldsName: string[];
  initialValue: moment.Moment[];
  placeholder: string[];
  format?: string;
  dateSelects: DateSelect[] | true;
  allowClear?: boolean;
  timeZone?: BaseSelectDecorator | boolean;
}

export interface SelectInputDecorator {
  searchType: BaseSelectDecorator;
  mappingType?: BaseSelectDecorator;
  searchValue: BaseInputDecorator;
}

export interface SSInputDecorator {
  searchType?: Partial<BaseSelectDecorator>;
  mappingType?: Partial<BaseSelectDecorator>;
  searchValue?: Partial<BaseInputDecorator>;
}

export interface RadioDecorator {
  fieldName: string;
  initialValue?: any;
  options: string[] | Array<{
    label: string;
    value: any;
    disabled?: boolean
  }>;
}

export interface CheckboxDecorator {
  fieldName: string;
  initialValue?: any[];
  options: {
    label: string;
    value: any;
    disabled?: boolean
  }[];
}

export interface DatePickerDecorator {
  fieldName: string;
  initialValue: moment.Moment;
  placeholder: string;
  format?: string;
}

export interface NumberIntervalDecorator {
  fieldsName: string[];
  initialValue: any[];
  placeholder: string[];
  disabled?: boolean;
}

export interface OptGroupSelectDecorator extends BaseSelectDecorator {
  /** 子字段名*/
  subFieldName?: string;
}

// 设置BasicSearchType是为了区分'S-Input' | 'SS-Input'，实际上render和SelectInput一样;
export type BasicSearchType = 'S-Input' | 'SS-Input' | 'DateRange';
export interface BasicSearchDecorator {
  type: BasicSearchType;
  label?: string;
  props?: SSInputDecorator | Partial<DateRangeDecorator>;
}

export type AdvanceSearchType = 'Select' | 'SelectInput' | 'DateRange' | 'Input' | 'InputNumber'
  | 'Radio' | 'DatePicker' | 'NumberInterval' | 'OptGroupSelect' | 'Checkbox';
export interface AdvanceSearchDecorator {
  type: AdvanceSearchType | 'custom';
  label?: string;
  // tslint:disable-next-line:max-line-length
  props?: BaseSelectDecorator | SelectInputDecorator | DateRangeDecorator | InputDecorator | InputNumberDecorator | RadioDecorator |
  DatePickerDecorator | NumberIntervalDecorator | OptGroupSelectDecorator | CheckboxDecorator;
  customRender?: (form?: WrappedFormUtils) => React.ReactNode;
}

export interface TableSearchBarOwnProps {
  basicSearchs?: BasicSearchType[] | BasicSearchDecorator[];
  advanceSearchs?: AdvanceSearchDecorator[];
  onSearch: (fieldsValue) => void;
  onReset: (fieldsValue) => void;
  onChange?: (fieldsvalue) => void;
  fieldsValue: any;
  wrappedComponentRef?: any;
  omitSearchs?: any;
}

export interface TableSearchBarProps extends TableSearchBarOwnProps, FormComponentProps {
}

interface TableSearchBarState {
  expandForm: boolean;
  basicSearchs: AdvanceSearchDecorator[];
  advanceSearchs: AdvanceSearchDecorator[];
}

/**
 * 合并object,会覆盖第一个object值
 * @param to 目标object
 * @param from 源object
 */
function assign(to, from) {
  if (typeof to !== 'object' || typeof from !== 'object') {
    throw new Error('传入参数必须为object');
  }
  let _obj = { ...to };
  for (let key of Object.keys(from)) {
    if (typeof from[key] !== 'object') {
      _obj[key] = from[key];
    } else {
      if (!Array.isArray(from[key])) {
        _obj[key] = assign(_obj[key], from[key]);
      } else {
        _obj[key] = from[key];
      }
    }
  }
  return _obj;
}

const DEFAULT_STARTTIME = '00:00:00';
const DEFAULT_ENDTIME = '23:59:59';

class TableSearchBar extends PureComponent<TableSearchBarProps, TableSearchBarState> {
  static getDerivedStateFromProps(nextProps: TableSearchBarProps, prevState: any) {
    if (prevState.expandForm === undefined) {
      return null;
    }
    return {
      advanceSearchs: nextProps.advanceSearchs
        ? prevState.basicSearchs.concat(nextProps.advanceSearchs) : prevState.basicSearchs,
    };
  }

  constructor(props) {
    super(props);

    let stateBasicSearchs = [];
    let stateAdvanceSearchs = [];

    const { basicSearchs, advanceSearchs } = props;
    if (basicSearchs && basicSearchs.length > 0) {
      for (let search of basicSearchs) {
        stateBasicSearchs.push(this.getBasicSearchs(search));
      }
    }
    stateAdvanceSearchs = advanceSearchs ? stateBasicSearchs.concat(advanceSearchs) : stateBasicSearchs;

    this.state = {
      expandForm: false,
      basicSearchs: stateBasicSearchs,
      advanceSearchs: stateAdvanceSearchs,
    };
  }

  /**
   * 获取BasicSearchs;
   * 传进来string：使用默认的config;
   * 传进来object：object的值覆盖默认的config;
   * @param search
   */
  getBasicSearchs(search) {
    let config;
    let isString = typeof search === 'string';
    let type = isString ? search : search.type;
    switch (type) {
      case 'S-Input':
        if (isString) {
          config = { ...SINPUT_CONFIG };
        } else {
          // 合并传进来的数据
          config = assign(SINPUT_CONFIG, search);
        }
        config.type = 'SelectInput'; // 重置为advanceSearchs的SelectInput;
        break;
      case 'SS-Input':
        if (isString) {
          config = { ...SSINPUT_CONFIG };
        } else {
          // 合并传进来的数据
          config = assign(SSINPUT_CONFIG, search);
        }
        config.type = 'SelectInput'; // 重置为advanceSearchs的SelectInput;
        break;
      case 'DateRange':
        if (isString) {
          config = { ...DATERANGE_CONFIG };
        } else {
          // 合并传进来的数据
          config = assign(DATERANGE_CONFIG, search);
        }
        break;
      default:
        break;
    }
    return config;
  }

  toggleForm = () => {
    this.setState({ expandForm: !this.state.expandForm });
  }

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return null;
      }
      const _fieldsValue = this.transfromValues(fieldsValue);
      this.props.onSearch(_fieldsValue);
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const fieldsValue = this.getDefaultValue();
    const _fieldsValue = this.transfromValues(fieldsValue);
    this.props.onReset(_fieldsValue);
  }

  /**
   * 转换fieldsValue
   */
  transfromValues = (fieldsValue) => {
    let _fieldsValue = fieldsValue;
    for (let item of this.state.advanceSearchs) {
      if (item.type === 'DateRange') {
        const props = item.props as DateRangeDecorator;
        for (let fieldName of props.fieldsName) {
          _fieldsValue[fieldName] = fieldsValue[fieldName] ?
            fieldsValue[fieldName].format(props.format || DATE_FORMAT) : null;
          // 数值为空时删除值;
          if (!_fieldsValue[fieldName]) {
            delete _fieldsValue[fieldName];
          }
        }
        if (props.timeZone) {
          let fieldName = typeof props.timeZone === 'object' ? props.timeZone.fieldName : 'timeZone';
          if (!_fieldsValue[fieldName]) {
            delete _fieldsValue[fieldName];
          }
        }
      }
      if (item.type === 'DatePicker') {
        const props = item.props as DatePickerDecorator;
        _fieldsValue[props.fieldName] = fieldsValue[props.fieldName] ?
          fieldsValue[props.fieldName].format(props.format || DATE_FORMAT) : null;
        // 数值为空时删除值;
        if (!_fieldsValue[props.fieldName]) {
          delete _fieldsValue[props.fieldName];
        }
      }
      // 当searchValue为空时，SelectInput的值都忽略掉
      if (item.type === 'SelectInput') {
        const props = item.props as SelectInputDecorator;
        if (props.searchValue.fieldName && !fieldsValue[props.searchValue.fieldName]) {
          if (props.searchValue) {
            delete _fieldsValue[props.searchValue.fieldName];
          }
          if (props.searchType) {
            delete _fieldsValue[props.searchType.fieldName];
          }
          if (props.mappingType) {
            delete _fieldsValue[props.mappingType.fieldName];
          }
        }
      }
    }
    return _fieldsValue;
  }

  /**
   * 优先设置initialValue为this.props.fieldsValue[fieldName]
   */
  getInitialValue = (type, fieldName, defaultValue) => {
    const fieldsValue = this.props.fieldsValue;
    let initialValue = defaultValue;
    if (fieldsValue && fieldsValue[fieldName] !== undefined) {
      if (type === 'DateRange' || type === 'DatePicker') {
        initialValue = fieldsValue[fieldName] !== null ? moment(fieldsValue[fieldName]) : null;
      } else {
        initialValue = fieldsValue[fieldName];
      }
    }
    return initialValue;
  }

  getDefaultValue() {
    let advanceSearchs = this.state.advanceSearchs;
    if (advanceSearchs.length > 2 && this.props.omitSearchs && !this.state.expandForm) {
      advanceSearchs = advanceSearchs.slice(0, 2);
    }
    let fieldsValue = {};
    for (let config of advanceSearchs) {
      let props: any = config.props;
      switch (config.type) {
        case 'Select':
          fieldsValue[props.fieldName] = props.initialValue;
          break;
        case 'SelectInput':
          const { searchType, mappingType, searchValue } = props as SelectInputDecorator;
          if (!searchValue.initialValue) {
            break;
          }
          fieldsValue[searchType.fieldName] = searchType.initialValue;
          fieldsValue[searchValue.fieldName] = searchValue.initialValue;
          if (mappingType) {
            fieldsValue[mappingType.fieldName] = mappingType.initialValue;
          }
          break;
        case 'DateRange':
          const initialValue = props.initialValue || [null, null];
          fieldsValue[props.fieldsName[0]] = initialValue[0];
          fieldsValue[props.fieldsName[1]] = initialValue[1];
          if (props.timeZone) {
            if (typeof props.timeZone === 'object' && props.timeZone.fieldName) {
              fieldsValue[props.timeZone.fieldName] = props.timeZone.initialValue || 1;
            } else {
              fieldsValue['timeZone'] = 1;
            }
          }
          break;
        case 'Input':
          fieldsValue[props.fieldName] = props.initialValue;
          break;
        case 'InputNumber':
          fieldsValue[props.fieldName] = props.initialValue;
          break;
        case 'Radio':
          fieldsValue[props.fieldName] = props.initialValue;
          break;
        case 'DatePicker':
          fieldsValue[props.fieldName] = props.initialValue;
          break;
        case 'NumberInterval':
          const initialValueNumber = props.initialValue || [null, null];
          fieldsValue[props.fieldsName[0]] = initialValueNumber[0];
          fieldsValue[props.fieldsName[1]] = initialValueNumber[1];
          break;
        case 'Checkbox':
          fieldsValue[props.fieldName] = props.initialValue;
          break;
        default:
          break;
      }
    }
    return fieldsValue;
  }

  checkVisible = config => {
    if (typeof config.props.visible !== 'undefined') {
      const values = this.props.form.getFieldsValue();
      return config.props.visible(values);
    }
    return true;
  }

  renderInput = config => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <Input
            placeholder={props.placeholder}
            className={config.props.className}
          />,
        )}
      </FormItem>
    );
  }

  renderInputNumber = config => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    if (!this.checkVisible(config)) {
      return null;
    }
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <InputNumber
            placeholder={props.placeholder}
            className={config.props.className}
          />,
        )}
      </FormItem>
    );
  }

  renderSelect = (config) => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <Select
            placeholder={props.placeholder}
            allowClear={props.allowClear}
            mode={props.mode}
            style={{ minWidth: '150px' }}
            disabled={props.disabled}
            className={props.className}
            onChange={(v, options) => {
              if (props.onChange) { props.onChange(v, options); }
              if (props.changeFieldName) {
                this.changeFieldNameValue(props.changeFieldName, props.changeFieldValue || undefined);
              }
            }}
          >
            {props.options.map((item, index) => (
              <Option key={index} value={item.value !== undefined ? item.value : item.id}>
                {item.text || item.name}
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
    );
  }

  changeFieldNameValue = (fieldsName, value) => {
    this.props.form.setFieldsValue({
      [fieldsName]: value,
    });
  }

  renderOptGroupSelect = (config) => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    console.log('props', props);
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <Select
            placeholder={props.placeholder}
            allowClear={props.allowClear}
            mode={props.mode}
            style={{ minWidth: '150px' }}
            disabled={props.disabled}
          >
            {props.options.map((items, index) => (
              <OptGroup label={`${items.name}`} key={index}>
                {
                  items && items[props.subFieldName] && items[props.subFieldName].map((item, idx) => (
                    <Option key={index + idx} value={item.value !== undefined ? item.value : item.id}>
                      {item.text || item.name}
                    </Option>
                  ))
                }
              </OptGroup>
            ))}
          </Select>,
        )}
      </FormItem>
    );
  }

  renderSelectInput = (config) => {
    const { type, label, props } = config;
    const { searchType, mappingType, searchValue } = props as SelectInputDecorator;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={searchValue.fieldName}>
        <Input.Group className={className('ss-input')} compact>
          <FormItem style={{ width: 100 }}>
            {getFieldDecorator(searchType.fieldName, {
              initialValue: this.getInitialValue(type, searchType.fieldName, searchType.initialValue),
            })(
              <Select style={{ width: 100 }}>
                {searchType.options.map((item, index) => (
                  <Option key={index.toString()} value={item.value !== undefined ? item.value : item.id}>
                    {item.text || item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          {mappingType ?
            <FormItem style={{ width: 100 }}>
              {getFieldDecorator(mappingType.fieldName, {
                initialValue: this.getInitialValue(type, mappingType.fieldName, mappingType.initialValue),
              })(
                <Select style={{ width: 100 }}>
                  {mappingType.options.map((item, index) => (
                    <Option key={index.toString()} value={item.value !== undefined ? item.value : item.id}>
                      {item.text || item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem> : null}
          <FormItem>
            {getFieldDecorator(searchValue.fieldName, {
              initialValue: this.getInitialValue(type, searchValue.fieldName, searchValue.initialValue),
            })(
              <Input placeholder={searchValue.placeholder || '查询关键词'} />,
            )}
          </FormItem>
        </Input.Group>
      </FormItem>
    );
  }

  changeDate = (fieldsName: string[], values: Moment[]) => {
    this.props.form.setFieldsValue({
      [fieldsName[0]]: moment(`${values[0].format(DATEONLY_FORMAT)} ${DEFAULT_STARTTIME}`),
      [fieldsName[1]]: moment(`${values[1].format(DATEONLY_FORMAT)} ${DEFAULT_ENDTIME}`),
    });
  }

  handleTagClick = (item: DateSelect, config) => {
    const values = item.onClick(item.value);
    this.changeDate(config.fieldsName, values);
  }

  renderTags = (datasource: BaseSelect[], config: DateRangeDecorator) => {
    return (
      <div className={className('tag-list')}>
        {datasource.map(item => {
          return (
            <Tag
              key={item.value}
              color={item.color}
              onClick={() => { this.handleTagClick(item, config); }}
            >
              {item.text}
            </Tag>);
        })}
      </div>
    );
  }

  renderDateRange = (config) => {
    const { type, label } = config;
    const props = config.props as DateRangeDecorator;
    const { getFieldDecorator } = this.props.form;
    const initialValue = props.initialValue || [null, null];
    const fotmat = props.format || DATE_FORMAT;
    const dateSelects = props.dateSelects ? props.dateSelects === true ? defaultDateSelects : props.dateSelects : false;
    return (
      <FormItem key={props.fieldsName[0]} label={label}>
        {props.timeZone && props.timeZone ?
          this.renderSelect({
            type: 'Select',
            label: '',
            props: {
              fieldName: 'timeZone',
              initialValue: 1,
              options: [{
                value: 1,
                text: '美东时间',
              }, {
                value: 2,
                text: '北京时间',
              }],
              ...(typeof props.timeZone === 'object' ? props.timeZone : {}),
            } as BaseSelectDecorator,
          }) : null}
        <FormItem style={{ marginRight: 0 }}>
          {getFieldDecorator(props.fieldsName[0], {
            initialValue: this.getInitialValue(type, props.fieldsName[0], initialValue[0]),
          })(
            <DatePicker
              format={fotmat}
              showTime={{ defaultValue: moment(DEFAULT_STARTTIME, 'HH:mm:ss') }}
              allowClear={props.allowClear}
            />,
          )}
        </FormItem>
        <span> - </span>
        <FormItem style={{ marginRight: 0 }}>
          {getFieldDecorator(props.fieldsName[1], {
            initialValue: this.getInitialValue(type, props.fieldsName[1], initialValue[1]),
          })(
            <DatePicker
              format={fotmat}
              showTime={{ defaultValue: moment(DEFAULT_ENDTIME, 'HH:mm:ss') }}
              allowClear={props.allowClear}
            />,
          )}
        </FormItem>
        {dateSelects && this.renderTags(dateSelects, props)}
      </FormItem>
    );
  }

  renderRadio = (config) => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <RadioGroup options={props.options} />,
        )}
      </FormItem>
    );
  }

  renderCheckbox = config => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <AllCheckboxGroup options={props.options} />,
        )}
      </FormItem>
    );
  }

  renderDatePicker = (config) => {
    const { type, label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getInitialValue(type, props.fieldName, props.initialValue),
        })(
          <DatePicker
            style={{ width: '100%' }}
            format={props.format || DATE_FORMAT}
            showTime={{ defaultValue: moment(DEFAULT_ENDTIME, 'HH:mm:ss') }}
            placeholder={props.placeholder || '请选择日期'}
          />,
        )}
      </FormItem>
    );
  }

  renderNumberInterval = (config) => {
    const { type, label } = config;
    const props = config.props as NumberIntervalDecorator;
    const { getFieldDecorator } = this.props.form;
    const initialValue = props.initialValue || [null, null];
    return (
      <FormItem key={props.fieldsName[0]}>
        <FormItem label={label} style={{ marginRight: 0 }}>
          {getFieldDecorator(props.fieldsName[0], {
            initialValue: this.getInitialValue(type, props.fieldsName[0], initialValue[0]),
          })(
            <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" disabled={props.disabled} />,
          )}
        </FormItem>
        <span> - </span>
        <FormItem style={{ marginRight: 0 }}>
          {getFieldDecorator(props.fieldsName[1], {
            initialValue: this.getInitialValue(type, props.fieldsName[1], initialValue[1]),
          })(
            <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最大值" disabled={props.disabled} />,
          )}
        </FormItem>
      </FormItem>
    );
  }

  renderFormItem(advanceSearchs: AdvanceSearchDecorator[]) {
    if (advanceSearchs.length === 0) {
      return null;
    }
    return advanceSearchs.map((config, index) => {
      let _Component;
      switch (config.type) {
        case 'Select':
          _Component = this.renderSelect(config);
          break;
        case 'SelectInput':
          _Component = this.renderSelectInput(config);
          break;
        case 'DateRange':
          _Component = this.renderDateRange(config);
          break;
        case 'Input':
          _Component = this.renderInput(config);
          break;
        case 'InputNumber':
          _Component = this.renderInputNumber(config);
          break;
        case 'Radio':
          _Component = this.renderRadio(config);
          break;
        case 'DatePicker':
          _Component = this.renderDatePicker(config);
          break;
        case 'NumberInterval':
          _Component = this.renderNumberInterval(config);
          break;
        case 'OptGroupSelect':
          _Component = this.renderOptGroupSelect(config);
          break;
        case 'Checkbox':
          _Component = this.renderCheckbox(config);
          break;
        case 'custom':
          _Component = config.customRender && config.customRender(this.props.form);
          break;
        default:
          _Component = <div />;
          break;
      }
      return _Component;
    });
  }

  /**
   * 渲染表单
   */
  renderForm() {
    let advanceSearchs = this.state.advanceSearchs;
    let showExpandFormToggle = false;
    if (advanceSearchs.length > 2 && this.props.omitSearchs && !this.state.expandForm) {
      showExpandFormToggle = true;
      advanceSearchs = advanceSearchs.slice(0, 2);
    }
    return (
      <Form onSubmit={this.handleSearch} layout={'inline'}>
        {this.renderFormItem(advanceSearchs)}
        {!this.state.expandForm ?
          <FormItem>
            <div>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {showExpandFormToggle ?
                <a className="toogle-form" style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a> : null}
            </div>
          </FormItem> : null}
        {this.state.expandForm ?
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </div>
          </div> : null}
      </Form>
    );
  }

  render() {
    return (
      <div className={className('tableList-form')} >
        {this.renderForm()}
      </div>
    );
  }
}

export default Form.create<TableSearchBarProps>({
  onValuesChange(_, values, allValues) {
    if (_.onChange) {
      _.onChange(allValues);
    }
  },
})(TableSearchBar) as React.ComponentClass<TableSearchBarOwnProps>;
