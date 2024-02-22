const getColumns = () => {
  const coulmns = [
    {
      key: '1',
      title: 'ID',
      dataIndex: 'parentId'
    },
    {
      key: '2',
      title: 'Name',
      render: (_, object) => object?.parent?.name || '-'
    },
    {
      key: '3',
      title: 'Role',
      render: (_, object) => object?.parent?.role?.toUpperCase() || '-'
    },
    {
      key: '7',
      title: 'National Id',
      render: (_, object) => object?.parent?.nationalId || '-'
    }
  ]
  return coulmns
}
export default getColumns
