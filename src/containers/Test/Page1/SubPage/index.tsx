import * as React from 'react';
import { Button } from 'antd';
import useContainer from '../../../../hooks/useContainer';
import subPageModel from './model';

export interface AppProps {
  options?: {
    name: string;
  };
  subPageActions: typeof subPageModel.actions;
}

export default function App(props: AppProps) {
  const { push, dispatch } = useContainer();

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
      <Button
        onClick={() => {
          dispatch(props.subPageActions.api.test({}));
        }}
      >
        redirect
      </Button>
    </div>
  );
}
