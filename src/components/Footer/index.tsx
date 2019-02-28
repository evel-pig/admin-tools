import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import './index.less';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('footer');

export interface FooterLink {
  title: string;
  blankTarget?: boolean;
  href: string;
}

export interface FooterProps {
  className?: string;
  links?: FooterLink[];
  copyright?: React.ReactNode;
}

export default class Footer extends React.Component<FooterProps, any> {
  static defaultProps = {
    links: [],
    copyright: '2018 东方星空',
  };

  render() {
    const { className, links, copyright } = this.props;

    const clsString = classNames(getClassName(), className);
    return (
      <div className={clsString}>
        {
          links && (
            <div className={'links'}>
              {links.map(link => (
                <a
                  key={link.title}
                  target={link.blankTarget ? '_blank' : '_self'}
                  href={link.href}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )
        }
        {copyright && (
        <div className={'copyright'}>
          <div>Copyright <Icon type="copyright" /> {copyright}</div>
        </div>)}
      </div>
    );
  }
}
