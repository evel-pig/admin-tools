import adminEvent from '.';

export function refreshUniTable(id?: string) {
  adminEvent.send({
    type: 'refreshUniTable',
    id: id,
  });
}
