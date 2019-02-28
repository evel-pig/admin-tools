import * as React from 'react';
import { Menu, Dropdown } from 'antd';
import './ThemeMenu.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('theme');

const MenuItem = Menu.Item as any;

export interface ThemeMenuProps {
  themes: {
    value: string; text: string;
  }[];
  onPreview: (item: any) => void;
  onReset: () => void;
  onSet: (item: any) => void;
  className?: string;
  selectedKeys: any[];
  text: string;
}

export default class ThemeMenu extends React.Component<ThemeMenuProps, any> {
  handleSetHeaderTheme = e => {
    this.props.onSet({
      value: e.key,
      text: e.domEvent.target.innerText,
    });
  }

  handlePreviewTheme = e => {
    this.props.onPreview({
      value: e.key,
      text: e.domEvent.target.innerText,
    });
  }

  handleResetTheme = e => {
    this.props.onReset();
  }

  render() {
    const menu = (
      <Menu
        selectedKeys={this.props.selectedKeys}
        className={`${getClassName('menu')} ${this.props.className || ''}`}
        onClick={this.handleSetHeaderTheme}
      >
        {this.props.themes.map(item => {
          return (
            <MenuItem
              key={item.value}
              onMouseEnter={this.handlePreviewTheme}
              onMouseLeave={this.handleResetTheme}
            >
              {item.text}
            </MenuItem>
          );
        })}
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <span className={`${'action'}`}>{this.props.text}</span>
      </Dropdown>

    );
  }
}
