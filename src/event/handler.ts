import adminEvent from '.';

export function refreshUniTable(refreshAction: any) {
  adminEvent.send({
    type: 'refreshUniTable',
    refreshAction: refreshAction,
  });
}
