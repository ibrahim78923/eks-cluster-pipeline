import adminRoutes from './admin.routes'
import clientRoutes from './client.routes'
import teacherRoutes from './teacher.routes'

const getRoutes = (role = '') => {
  switch (role.toLowerCase()) {
    case 'admin':
      return adminRoutes
    case 'client':
      return clientRoutes
    case 'teacher':
      return teacherRoutes
    default:
      return []
  }
}

export default getRoutes
