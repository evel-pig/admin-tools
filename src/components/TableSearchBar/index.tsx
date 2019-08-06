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
  Switch,
} from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { DATE_FORMAT, DATEONLY_FORMAT } from '../../util/constants';
import { SINPUT_CONFIG, SSINPUT_CONFIG, DATERANGE_CONFIG } from './constanst';
import './index.less';
import { createGetClassName } from '../../util/util';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { SelectProps } from 'antd/lib/select';
import { SwitchProps } from 'antd/lib/switch';

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
  placeholder?: string;
  allowClear?: boolean;
  mode?: 'multiple' | 'tags' | 'combobox';
  disabled?: boolean;
  onChange?: (value: any, options: any) => void;
  changeFieldName?: string;
  changeFieldValue?: number | string;
  antdSelectProps?: Partial<SelectProps>;
}

export interface BaseInputDecorator {
  fieldName: string;
  initialValue?: string;
  placeholder?: string;
}

export interface DateRangeDecorator {
  fieldsName: string[];
  initialValue?: moment.Moment[];
  placeholder?: string[];
  format?: string;
  dateSelects?: DateSelect[] | true;
  allowClear?: boolean;
  addonSelect?: BaseSelectDecorator;
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
  placeholder?: string;
  format?: string;
}

export interface NumberIntervalDecorator {
  fieldsName: string[];
  initialValue: any[];
  placeholder?: string[];
  disabled?: boolean;
  addonSelect?: BaseSelectDecorator;
}

export interface OptGroupSelectDecorator extends BaseSelectDecorator {
  /** 子字段名*/
  subFieldName?: string;
}

export interface SwitchDecorator {
  fieldName: string;
  initialValue: boolean;
  antdSwitchProps?: Partial<SwitchProps>;
}

// 设置BasicSearchType是为了区分'S-Input' | 'SS-Input'，实际上render和SelectInput一样;
export type BasicSearchType = 'S-Input' | 'SS-Input' | 'DateRange';
export interface BasicSearchDecorator {
  type: BasicSearchType;
  label?: string;
  props?: SSInputDecorator | Partial<DateRangeDecorator>;
}

export type AdvanceSearchType = 'Select' | 'SelectInput' | 'DateRange' | 'Input' | 'InputNumber'
  | 'Radio' | 'DatePicker' | 'NumberInterval' | 'OptGroupSelect' | 'Checkbox' | 'Switch';
export interface AdvanceSearchDecorator {
  type: AdvanceSearchType | 'custom';
  label?: string;
  // tslint:disable-next-line:max-line-length
  props?: BaseSelectDecorator | SelectInputDecorator | DateRangeDecorator | InputDecorator | InputNumberDecorator | RadioDecorator |
  DatePickerDecorator | NumberIntervalDecorator | OptGroupSelectDecorator | CheckboxDecorator | SwitchDecorator;
  customRender?: (form?: WrappedFormUtils) => React.ReactNode;
}

export interface ScreenSearchDecorator extends AdvanceSearchDecorator {

}

export interface TableSearchBarOwnProps {
  basicSearchs?: BasicSearchType[] | BasicSearchDecorator[];
  advanceSearchs?: AdvanceSearchDecorator[];
  onSearch: (fieldsValue) => void;
  onReset: (fieldsValue) => void;
  onChange?: (fieldsvalue, form?: WrappedFormUtils) => void;
  fieldsValue: any;
  wrappedComponentRef?: any;
  omitSearchs?: any;
  omitSearchsNum?: number;
  searchText?: string;
  toolbarButtons?: React.ReactNode;
  firstLoadData?: boolean;
  onFirstLoad?: (fieldsvalue) => void;
}

export interface TableSearchBarProps extends TableSearchBarOwnProps, FormComponentProps {
}

interface TableSearchBarState {
  expandForm: boolean;
  momentField: Record<string, any>;
  advanceSearchs: AdvanceSearchDecorator[];
}

const DEFAULT_STARTTIME = '00:00:00';
const DEFAULT_ENDTIME = '23:59:59';

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

/**
   * 获取BasicSearchs;
   * 传进来string：使用默认的config;
   * 传进来object：object的值覆盖默认的config;
   * @param search
   */
function getBasicSearchs(search: BasicSearchDecorator) {
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

/**
 * 将basicSearchs合并到advanceSearchs;
 * @param basicSearchs
 * @param advanceSearchs
 */
function getAdvanceSearchs(basicSearchs, advanceSearchs) {
  let _advanceSearchs: AdvanceSearchDecorator[] = [];
  if (basicSearchs && basicSearchs.length > 0) {
    for (let search of basicSearchs) {
      _advanceSearchs.push(getBasicSearchs(search));
    }
  }

  if (advanceSearchs && advanceSearchs.length > 0) {
    _advanceSearchs = _advanceSearchs.concat(advanceSearchs);
  }

  // 从配置进来的记录需要转换moment的field
  const momentField = {};

  _advanceSearchs.forEach(config => {
    switch (config.type) {
      case 'DatePicker':
        let _datePickerProps = config.props as DatePickerDecorator;
        momentField[_datePickerProps.fieldName] = _datePickerProps.format || DATE_FORMAT;
        break;
      case 'DateRange':
        let _dateRangeProps = config.props as DateRangeDecorator;
        momentField[_dateRangeProps.fieldsName[0]] = _dateRangeProps.format || DATE_FORMAT;
        momentField[_dateRangeProps.fieldsName[1]] = _dateRangeProps.format || DATE_FORMAT;
        break;
      default:
        break;
    }
  });

  return {
    momentField: momentField,
    advanceSearchs: _advanceSearchs,
  };
}

class TableSearchBar extends PureComponent<TableSearchBarProps, TableSearchBarState> {
  static getDerivedStateFromProps(nextProps: TableSearchBarProps, prevState: any) {
    const { momentField, advanceSearchs } = getAdvanceSearchs(nextProps.basicSearchs, nextProps.advanceSearchs);

    return {
      momentField,
      advanceSearchs,
    };
  }

  constructor(props) {
    super(props);
    const { momentField, advanceSearchs } = getAdvanceSearchs(props.basicSearchs, props.advanceSearchs);
    this.state = {
      expandForm: false,
      momentField,
      advanceSearchs,
    };
  }

  componentDidMount() {
    if (this.props.basicSearchs || this.props.advanceSearchs) {
      this.setFieldsValueFromState();
      if (this.props.firstLoadData && this.props.onFirstLoad) {
        this.props.onFirstLoad(this.getFieldsValue());
      }
    }
  }

  componentDidUpdate(prevProps: TableSearchBarProps, prevState) {
    if (prevProps.fieldsValue !== this.props.fieldsValue) {
      let shouldUpdate = false;
      for (const key in prevProps.fieldsValue) {
        if (prevProps.fieldsValue[key] !== this.props.fieldsValue[key]) {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        this.setFieldsValueFromState();
      }
    }
  }

  setFieldsValueFromState = () => {
    const needResetFields = [];
    const _fieldsValue = {};
    const { fieldsValue } = this.props;
    const currentValues = this.props.form.getFieldsValue();

    let index = 0;
    Object.keys(currentValues).forEach(key => {
      // 读取需要设置的值
      if (fieldsValue[key] !== undefined && fieldsValue[key] !== null) {
        index++;
        if (this.state.momentField[key]) {
          _fieldsValue[key] = this.getMomentValue(fieldsValue[key]);
        } else {
          _fieldsValue[key] = fieldsValue[key];
        }
      } else {
        needResetFields.push(key);
      }
    });
    // 从this.props.fieldsValue中恢复数据;
    if (index > 0) {
      this.props.form.setFieldsValue(_fieldsValue);
    }
    // this.props.fieldsValue没有数据的就直接reset;
    if (needResetFields.length > 0) {
      this.props.form.resetFields(needResetFields);
    }
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

  getFieldsValue = () => {
    const fieldsValue = this.props.form.getFieldsValue();
    return this.transfromValues(fieldsValue);
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    this.props.onReset(this.getFieldsValue());
  }

  /**
   * 转换fieldsValue
   */
  transfromValues = (fieldsValue) => {
    for (let item of this.state.advanceSearchs) {
      // 当searchValue为空时，SelectInput的值都忽略掉
      if (item.type === 'SelectInput') {
        const props = item.props as SelectInputDecorator;
        if (props.searchValue.fieldName && !fieldsValue[props.searchValue.fieldName]) {
          if (props.searchValue) {
            delete fieldsValue[props.searchValue.fieldName];
          }
          if (props.searchType) {
            delete fieldsValue[props.searchType.fieldName];
          }
          if (props.mappingType) {
            delete fieldsValue[props.mappingType.fieldName];
          }
        }
      }
      //  去掉addonSelect的值;
      if (item.type === 'DateRange' || item.type === 'NumberInterval') {
        const props = item.props as DateRangeDecorator;
        if (props.addonSelect && props.addonSelect.fieldName) {
          const fieldsNames = props.fieldsName;
          if (!fieldsValue[fieldsNames[0]] && !fieldsValue[fieldsNames[1]]) {
            delete fieldsValue[props.addonSelect.fieldName];
          }
        }
      }
    }

    Object.keys(fieldsValue).forEach(key => {
      // 只转换从配置进来的moment对象,自定义渲染的自己处理值
      if (moment.isMoment(fieldsValue[key]) && this.state.momentField[key]) {
        fieldsValue[key] = fieldsValue[key].format(this.state.momentField[key]);
      }
      // 去除为空的值
      if (fieldsValue[key] === null || fieldsValue[key] === undefined || fieldsValue[key] === '') {
        delete fieldsValue[key];
      }
    });
    return fieldsValue;
  }

  getMomentValue = (value) => {
    if (value) {
      if (moment.isMoment(value)) {
        return value;
      }
      return moment(value);
    }
    return value;
  }

  checkVisible = config => {
    if (typeof config.props.visible !== 'undefined') {
      const values = this.props.form.getFieldsValue();
      return config.props.visible(values);
    }
    return true;
  }

  renderInput = config => {
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: props.initialValue,
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
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    if (!this.checkVisible(config)) {
      return null;
    }
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: props.initialValue,
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
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: props.initialValue,
        })(
          <Select
            {...(props.antdSelectProps || {})}
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
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: props.initialValue,
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
    const { label, props } = config;
    const { searchType, mappingType, searchValue } = props as SelectInputDecorator;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={searchValue.fieldName}>
        <Input.Group className={className('ss-input')} compact>
          <FormItem style={{ width: 100 }}>
            {getFieldDecorator(searchType.fieldName, {
              initialValue: searchType.initialValue,
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
                initialValue: mappingType.initialValue,
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
              initialValue: searchValue.initialValue,
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
    const { label } = config;
    const props = config.props as DateRangeDecorator;
    const { getFieldDecorator } = this.props.form;
    const initialValue = props.initialValue || [null, null];
    const fotmat = props.format || DATE_FORMAT;
    const dateSelects = props.dateSelects ? props.dateSelects === true ? defaultDateSelects : props.dateSelects : false;
    return (
      <FormItem key={props.fieldsName[0]} label={label} className={className('compact')}>
        {props.addonSelect ?
          this.renderSelect({
            type: 'Select',
            label: '',
            props: {
              ...props.addonSelect,
            } as BaseSelectDecorator,
          }) : null}
        <FormItem>
          {getFieldDecorator(props.fieldsName[0], {
            initialValue: this.getMomentValue(initialValue[0]),
          })(
            <DatePicker
              format={fotmat}
              showTime={{ defaultValue: moment(DEFAULT_STARTTIME, 'HH:mm:ss') }}
              allowClear={props.allowClear}
            />,
          )}
        </FormItem>
        <FormItem>
          <span> - </span>
        </FormItem>
        <FormItem>
          {getFieldDecorator(props.fieldsName[1], {
            initialValue: this.getMomentValue(initialValue[1]),
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
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: props.initialValue,
        })(
          <RadioGroup options={props.options} />,
        )}
      </FormItem>
    );
  }

  renderCheckbox = config => {
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: props.initialValue,
        })(
          <AllCheckboxGroup options={props.options} />,
        )}
      </FormItem>
    );
  }

  renderDatePicker = (config) => {
    const { label, props } = config;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName as never, {
          initialValue: this.getMomentValue(props.initialValue),
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
    const { label } = config;
    const props = config.props as NumberIntervalDecorator;
    const { getFieldDecorator } = this.props.form;
    const initialValue = props.initialValue || [null, null];
    return (
      <FormItem label={label} key={props.fieldsName[0]} className={className('compact')}>
        {props.addonSelect ?
          this.renderSelect({
            type: 'Select',
            label: '',
            props: {
              ...props.addonSelect,
            } as BaseSelectDecorator,
          }) : null}
        <FormItem >
          {getFieldDecorator(props.fieldsName[0], {
            initialValue: initialValue[0],
          })(
            <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" disabled={props.disabled} />,
          )}
        </FormItem>
        <FormItem>
          <span> - </span>
        </FormItem>
        <FormItem>
          {getFieldDecorator(props.fieldsName[1], {
            initialValue: initialValue[1],
          })(
            <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最大值" disabled={props.disabled} />,
          )}
        </FormItem>
      </FormItem>
    );
  }

  renderSwitch(config) {
    const { label } = config;
    const props = config.props as SwitchDecorator;
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={label} key={props.fieldName}>
        {getFieldDecorator(props.fieldName, {
          valuePropName: 'checked',
          initialValue: props.initialValue || false,
        })(
          <Switch {...(props.antdSwitchProps || {})} />,
        )}
      </FormItem>
    );
  }

  renderFormItem() {
    const { omitSearchsNum, omitSearchs } = this.props;
    let advanceSearchs: AdvanceSearchDecorator[] = [...this.state.advanceSearchs];
    if (advanceSearchs.length === 0) {
      return null;
    }
    // 收起的时候截取部分advanceSearchs
    if (advanceSearchs.length > omitSearchsNum && omitSearchs && !this.state.expandForm) {
      advanceSearchs = advanceSearchs.slice(0, omitSearchsNum);
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
        case 'Switch':
          _Component = this.renderSwitch(config);
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
    const { toolbarButtons, omitSearchs, searchText = '查询' } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout={'inline'}>
        {this.renderFormItem()}
        <FormItem>
          <div>
            <Button type="primary" htmlType="submit">{searchText}</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            {omitSearchs && this.state.advanceSearchs.length > this.props.omitSearchsNum ?
              <a className="toogle-form" style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {this.state.expandForm ?
                  <>
                    收起
                  <Icon type="up" />
                  </> :
                  <>
                    展开
                  <Icon type="down" />
                  </>
                }
              </a> : null}
          </div>
        </FormItem>
        <div className={className('tablesearch-button')}>
          {toolbarButtons}
        </div>
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
      _.onChange(allValues, _.form);
    }
  },
})(TableSearchBar) as React.ComponentClass<TableSearchBarOwnProps>;
