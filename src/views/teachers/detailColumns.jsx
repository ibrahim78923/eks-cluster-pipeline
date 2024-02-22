const getColumns = ({pagination}) => {
  const coulmns = [
    {
      key: '0',
      title: "Sr. No",
      render: (_, object,index) => (index + 1) + ((pagination.current - 1) * pagination.pageSize)
    },
    {
      key: '1',
      title: "Id",
      dataIndex: "id",
    },
    {
      key: '1',
      title: "Name",
      dataIndex: "name",
    }
  ]
  return coulmns;
}
export default getColumns;