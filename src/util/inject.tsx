import { connect as lunaConnect }  from '@epig/luna';

export function connect<OwnProps = any>(propState = {}) {
  return Component => lunaConnect<OwnProps>({
    ...propState,
    token: 'token',
  })(Component);
}
