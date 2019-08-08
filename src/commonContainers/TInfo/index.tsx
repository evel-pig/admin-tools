import * as React from 'react';
import model, { TInfoState } from './model';

export interface TInfoProps {
  tInfo: TInfoState;
  tInfoActions: typeof model.actions;
}

export default function TInfo(props: TInfoProps) {
  return (
    <div>
      TInfo
    </div>
  );
}
