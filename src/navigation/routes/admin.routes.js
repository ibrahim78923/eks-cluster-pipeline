const routes = [
  {
    icon: 'ri:dashboard-fill',
    title: 'Dashboard',
    path: '/client-dashboard'
  },
  {
    icon: 'bi:people',
    title: 'Clients',
    path: '/clients'
  },
  {
    icon: 'lucide:menu-square',
    title: 'CMS',
    path: '/',
    children: [
      {
        icon: 'material-symbols:upgrade',
        title: 'Plans',
        path: '/cms/plans'
      }
    ]
  }
]

export default routes
