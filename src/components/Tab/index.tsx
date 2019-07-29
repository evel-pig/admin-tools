import * as React from 'react';
import './Tab.less';
import classnames from 'classnames';
import { Icon } from 'antd';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('tab');

export interface TabItem {
  key: string;
  tab: string;
}

export interface TabProps {
  tabs: TabItem[];
  activeKey: string;
  onTabChange: (key: string) => void;
  onTabRemove: (key: string) => void;
  operations?: any;
  operationsDirection?: 'left' | 'right';
}

export interface MyState {
  translate3d: number;
  scrollVisible: boolean;
  leftEnable: boolean;
  rightEnable: boolean;
  scroll: boolean;
  init: boolean;
}

export default class Tab extends React.Component<TabProps, Partial<MyState>> {
  static defaultProps = {
    tabs: [],
    operationsDirection: 'left',
  };

  tabNav: HTMLDivElement;
  tabNavWrapper: HTMLDivElement;

  constructor(props) {
    super(props);

    this.tabNav = null;
    this.tabNavWrapper = null;

    this.state = {
      translate3d: 0,
      scrollVisible: false,
      leftEnable: false,
      rightEnable: false,
      scroll: false,
      init: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    this.update();
  }

  renderTab = () => {
    return this.props.tabs.map(item => {
      const isActive = item.key === this.props.activeKey;
      return (
        <div
          className={classnames(getClassName('item'), {
            ['active']: isActive,
          })}
          key={item.key}
          onClick={() => this.props.onTabChange(item.key)}
          data-key={item.key}
        >
          {item.tab}
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.props.onTabRemove(item.key);
            }}
          >
            <Icon
              type="close"
              className={getClassName('item-close')}
            />
          </span>
          {isActive && <div className={getClassName('item-active-bar')}></div>}
        </div>
      );
    });
  }

  getTabNavWidth = () => {
    if (this.tabNav === null) {
      return 0;
    }
    const rect = this.tabNav.getBoundingClientRect();
    return rect.width;
  }

  getTabNavWrapperWidth = () => {
    if (this.tabNavWrapper === null) {
      return 0;
    }
    const rect = this.tabNavWrapper.getBoundingClientRect();
    return rect.width;
  }

  update = () => {
    this.updateScrollVisible();
    /** warn: Uncaught TypeError: Cannot read property 'childNodes' of null */
    if (this.tabNav === null) {
      return;
    }
    for (let i = 0; i < this.tabNav.childNodes.length; i++) {
      this.scrollActiveTab();
    }
  }

  handleAfterScroll = () => {
    const tabNavWidth = this.getTabNavWidth();
    const tabNavWrapperWidth = this.getTabNavWrapperWidth();
    if (this.state.scroll) {
      this.setState({
        scroll: false,
        leftEnable: this.state.translate3d !== 0,
        rightEnable: (tabNavWrapperWidth + this.state.translate3d) !== tabNavWidth,
      });
    }
  }

  updateScrollVisible = () => {
    const tabNavWidth = this.getTabNavWidth();
    const tabNavWrapperWidth = this.getTabNavWrapperWidth();
    if (tabNavWidth > tabNavWrapperWidth && !this.state.scrollVisible) {
      this.setState({
        scrollVisible: true,
        leftEnable: this.state.translate3d !== 0,
        rightEnable: this.state.translate3d === 0,
      });
    }
    if (tabNavWidth < tabNavWrapperWidth && this.state.scrollVisible) {
      this.setState({
        scrollVisible: false,
      });
    }
  }

  scrollActiveTab = () => {
    const tabNavWidth = this.getTabNavWidth();
    const tabNavWrapperWidth = this.getTabNavWrapperWidth();
    for (let i = 0; i < this.tabNav.childNodes.length; i++) {
      const tabNode = this.tabNav.childNodes[i] as HTMLDivElement;
      if (tabNode.dataset.key === this.props.activeKey) {
        let shouldScrollLength = this.state.translate3d;
        const maxScrollWidth = tabNavWidth - tabNavWrapperWidth;
        if (this.state.translate3d > tabNode.offsetLeft
          || tabNode.offsetLeft + tabNode.offsetWidth > (tabNavWrapperWidth + this.state.translate3d)) {
          shouldScrollLength = tabNode.offsetLeft;
        }
        if (shouldScrollLength > maxScrollWidth) {
          shouldScrollLength = maxScrollWidth;
        }
        if (shouldScrollLength < 0) {
          shouldScrollLength = 0;
        }
        this.setState({
          translate3d: shouldScrollLength,
          leftEnable: shouldScrollLength !== 0,
          rightEnable: shouldScrollLength === 0,
          init: true,
        });
        break;
      }
    }
  }

  componentDidUpdate(prevProps: TabProps) {
    this.updateScrollVisible();
    this.handleAfterScroll();
    if (this.props.activeKey !== prevProps.activeKey || !this.state.init) {
      this.scrollActiveTab();
    }
  }

  scrollRight = () => {
    if (!this.state.rightEnable) {
      return;
    }
    let shouldScrollLength = 0;
    const tabNavWidth = this.getTabNavWidth();
    const tabNavWrapperWidth = this.getTabNavWrapperWidth();
    const maxScrollWidth = tabNavWidth - tabNavWrapperWidth;
    if (tabNavWrapperWidth + this.state.translate3d >= maxScrollWidth) {
      shouldScrollLength = maxScrollWidth;
    } else {
      shouldScrollLength = this.state.translate3d + tabNavWrapperWidth;
    }
    this.setState({
      translate3d: shouldScrollLength,
      scroll: true,
    });
  }

  scrollLeft = () => {
    if (!this.state.leftEnable) {
      return;
    }
    let shouldScrollLength = 0;
    const tabNavWrapperWidth = this.getTabNavWrapperWidth();
    if (this.state.translate3d - tabNavWrapperWidth < 0) {
      shouldScrollLength = 0;
    } else {
      shouldScrollLength = this.state.translate3d - tabNavWrapperWidth;
    }
    this.setState({
      translate3d: shouldScrollLength,
      scroll: true,
    });
  }

  render() {
    const tabNavStyle: React.CSSProperties = {
      transform: `translate3d(${-this.state.translate3d}px, 0px, 0px)`,
    };

    const LeftScroll = this.state.scrollVisible ? (
      <span
        className={
          classnames(
            getClassName('scroll-icon'),
            getClassName('scroll-icon-right'),
            {
              [getClassName('scroll-icon-disabled')]: !this.state.rightEnable,
            },
          )
        }
        onClick={this.scrollRight}
      >
        <Icon
          type="right"
        />
      </span>
    ) : null;

    const RightScroll = this.state.scrollVisible ? (
      <span
        className={
          classnames(
            getClassName('scroll-icon'),
            getClassName('scroll-icon-left'),
            {
              [getClassName('scroll-icon-disabled')]: !this.state.leftEnable,
            },
          )}
        onClick={this.scrollLeft}
      >
        <Icon
          type="left"
        />
      </span>
    ) : null;

    return (
      <div className={getClassName()}>
        <div
          className={
          classnames(
            getClassName('extra-content'), {
            [getClassName('extra-content-left')]: this.props.operationsDirection === 'left',
            [getClassName('extra-content-right')]: this.props.operationsDirection === 'right',
          })}
        >
          {this.props.operations}
        </div>
        <div className={getClassName('nav-container')}>
          {LeftScroll}
          {RightScroll}
          <div ref={node => this.tabNavWrapper = node} className={getClassName('nav-wrapper')}>
            <div ref={node => this.tabNav = node} style={tabNavStyle} className={getClassName('nav')}>
              {this.renderTab()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
