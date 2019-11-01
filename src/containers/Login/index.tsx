import React from 'react';
import { Form, Input, Button, Icon, Checkbox, Alert } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import './Login.less';
import { connect } from '../../util/inject';
import loginModel, { LoginState } from '../../commonModels/login';
import BasicComponent from '../../components/BasicComponent';
import { createGetClassName, noop } from '../../util/util';

const getClassName = createGetClassName('login');

const FormItem = Form.Item;

interface RequestParameterKeyName {
  username: string;
  password: string;
}

export interface LoginOwnProps {
  autoComplete?: string;
  onForgetPassword?: () => void;
  noRemember?: boolean;
  noForgetPassword?: boolean;
  customForgetPassword?: () => React.ReactNode;
  requestParameterKeyName?: RequestParameterKeyName;
  logo?: () => React.ReactNode;
}

interface LoginProps extends LoginOwnProps {
  form: WrappedFormUtils;
  login: LoginState;
  app: any;
}

class Login extends BasicComponent<LoginProps, any> {
  static defaultProps = {
    autoComplete: 'on',
    onForgetPassword: noop,
    noRemember: false,
    noForgetPassword: false,
    requestParameterKeyName: {
      username: 'username',
      password: 'password',
    },
  };

  interval: any;

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!!err) {
          return;
        }
        this.props.dispatch(loginModel.actions.api.login({
          [this.props.requestParameterKeyName.username]: values.userName,
          [this.props.requestParameterKeyName.password]: values.password,
        }));
      },
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={getClassName()}>
        <div className={getClassName('top')}>
          <div className={getClassName('header')}>
            {this.props.logo && <div>{this.props.logo()}</div>}
            <span className={getClassName('title')}>{this.props.app.appName}</span>
          </div>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{
                required: true, message: '请输入账户名！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" className={'prefixIcon'} />}
                placeholder="请输入账户名"
                autoComplete={this.props.autoComplete}
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码！',
              }],
            })(
              <Input
                size="large"
                prefix={<Icon type="lock" className={'prefixIcon'} />}
                type="password"
                placeholder="请输入密码"
                autoComplete={this.props.autoComplete}
              />,
            )}
          </FormItem>
          <FormItem className={'additional'}>
            {!this.props.noRemember && getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={'autoLogin'}>自动登录</Checkbox>,
            )}
            <div className={'forgot'}>
              {this.props.customForgetPassword && this.props.customForgetPassword()}
              {!this.props.customForgetPassword && !this.props.noForgetPassword && (
                <a onClick={this.props.onForgetPassword}>忘记密码</a>
              )}
            </div>
            <Button
              size="large"
              loading={this.props.login.loading}
              className={'submit'}
              type="primary"
              htmlType="submit"
            >
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrapperLogin = Form.create()(Login);

const ExportLogin = connect<LoginOwnProps>({
  'login': 'login',
})(WrapperLogin);

export default ExportLogin;

export function injectLogin(passProps: LoginOwnProps) {
  return class extends React.Component<any, any> {
    render() {
      return (
        <ExportLogin
          {...this.props}
          {...passProps}
        />
      );
    }
  };
}
