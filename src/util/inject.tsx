import lunaConnect  from '@epig/luna/connect';

export function connect<OwnProps = any>(propState = {}) {
  return Component => lunaConnect<OwnProps>({
    ...propState,
    token: 'token',
  })(Component);
}
