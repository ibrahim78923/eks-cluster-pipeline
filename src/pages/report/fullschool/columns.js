import { formatDate } from '../../../utiles/utiles'

const getColumns = ({ pagination }) => [
  {
    key: '0',
    title: 'Sr. No',
    render: (_, object, index) => index + 1 + (pagination.current - 1) * pagination.pageSize
  },
  {
    key: '1',
    title: 'User Name',
    render: (_, object) => object.parentId
  },
  {
    key: '2',
    title: 'Student Name',
    render: (_, object) => object.student?.name || '-'
  },
  {
    key: '3',
    title: 'Date & Time',
    render: (_, object) => (object?.createdAt ? formatDate(object?.createdAt) : '-'),
    align: 'center'
  },
  {
    key: '4',
    title: 'Picked by',
    render: (_, object) => <p style={{ textTransform: 'capitalize' }}>{object?.pickUpGuardian}</p>
  }
]
export default getColumns
