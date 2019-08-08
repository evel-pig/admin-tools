import * as React from 'react';
import useContainer from '../../../hooks/useContainer';
import { Button } from 'antd';

export interface IAccountProps {
}

export default function Account (props: IAccountProps) {
  const { push } = useContainer();

  return (
    <div>
      <Button
        onClick={() => {
          push({
            componentName: 'TInfo',
          }, {});
        }}
      >
        go common containers
      </Button>
    </div>
  );
}
