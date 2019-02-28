import React from 'react';
import { STYLE_PREFIX } from './constants';

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = { ...node };
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

/**
 * 格式化Label
 * @param label 标签字符串
 */
export function formatLabel(label: string): React.ReactElement<any> {
  return <span className="label">{label || ''}：</span>;
}

export function createGetClassName(myPrefix) {
  return (className?) => {
    return `${STYLE_PREFIX}-${myPrefix}${className ? '-' + className : ''}`;
  };
}

/**
 * 获取组件名称（将首字母大写）
 * @param componentName 组件名称（首字母没有大写）
 * @return 组件名称
 */
export function getComponentName(componentName: string): string {
  return componentName.replace(/(\w)/, v => v.toUpperCase());
}

export const noop = () => {};

import { createAction } from 'redux-actions';
export const adminNormalActions = {
  loginTimeout: createAction<any>('loginTimeout') as any,
};

/**
 * 获取图片的base64
 * @param img 图片
 * @param callback {result: 带头部的base64 , base64: 没有头部的base64}
 */
export function getBase64(img, callback: (result: string, base64: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const result = reader.result as string;
    callback(result, result.split(',')[1]);
  });
  reader.readAsDataURL(img);
}

/**
 * 判断是不是图片文件
 * @param fileType 图片类型
 */
export function isImage(fileType: string) {
  return fileType === 'image/jpeg' || fileType === 'image/png';
}

/**
 * 分转元
 * @param money 分
 * @param precision 精度
 */
export function fen2yuan(money, precision = 2) {
  return (money / 100).toFixed(precision);
}
