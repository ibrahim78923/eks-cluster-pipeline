const getColumns = () => {
  console.log()
  const coulmns = [
    {
      key: '1',
      title: 'ID',
      dataIndex: 'id'
    },
    {
      key: '2',
      title: 'Name',
      render: (_, object) => object?.name || '-'
    },
    {
      key: '2',
      title: 'Name',
      render: (_, object) => object?.nameAr || '-'
    },

  ]
  return coulmns
}
export default getColumns
