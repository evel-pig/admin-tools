import * as React from 'react';
import { Button } from 'antd';
import useContainer from '../../../../hooks/useContainer';

export interface AppProps {
  options?: {
    name: string;
  };
}

export default function App(props: AppProps) {
  const { push } = useContainer();

  return (
    <div>
      {(props.options && props.options.name) ? props.options.name : 'sub page'}
      <Button
        onClick={() => {
          push({
            componentName: 'SubPage',
          }, {
            name: 'next',
          });
        }}
      >
        go next sub page
      </Button>
    </div>
  );
}
