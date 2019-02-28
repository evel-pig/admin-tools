import React from 'react';
import { createGetClassName } from '../../util/util';

const getClassName = createGetClassName('unitable');

export const renderActions = (render: (record: any, index: number) => React.ReactNode) => (t, record, index) => {
  return (
    <div className={getClassName('action-container')}>
      {render(record, index)}
    </div>
  );
};

export const renderIndex = (pagination = { current: 1, pageSize: 10 }) => (t, record, index) => {
  return (pagination.current - 1) * pagination.pageSize + ++index;
};
