export default {
  meEndpoint: '/auth/me',
  admin: { name: 'admin', defaultEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,displayName: 'Super Admin',homepage: '/client-dashboard', loginEndpoint: 'admins/login' },
  roles: [
    { name: 'client', displayName: 'Admin', loginEndpoint: 'clients/login', homepage: '/dashboard' },
    { name: 'teacher', displayName: 'Teacher', loginEndpoint: 'teachers/loginByEmail', homepage: '/teacher-dashboard/requests/new' }
  ],
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  storageAliasTokenKeyName: 'aliasToken',
  onTokenExpiration: 'refreshToken',
  clientRole: {
    name: 'client',
    displayName: 'Admin',
    loginEndpoint: 'clients/login',
    homepage: '/dashboard'
  }
}
