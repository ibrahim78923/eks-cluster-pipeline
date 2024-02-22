const routes = [
  {
    icon: 'ri:dashboard-fill',
    title: 'Dashboard',
    path: '/dashboard'
  },
  {
    icon: 'ion:school-outline',
    title: 'Schools',
    path: '/schools',
    children: [
      {
        icon: 'ion:school-outline',
        title: 'Schools',
        path: '/schools'
      },
      {
        icon: 'material-symbols:upgrade',
        title: 'Grades',
        path: '/grades'
      },
      {
        icon: 'ph:chalkboard-teacher',
        title: 'Teachers',
        path: '/teachers'
      },
      {
        icon: 'mdi:account-school',
        title: 'Students',
        path: '/students'
      },
      {
        icon: 'mdi:account-alert-outline',
        title: 'Security Guards',
        path: '/security-guards'
      },
      // {
      //   icon: 'mdi:account-child-circle',
      //   title: 'Parents',
      //   path: '/parents'
      // },
    ]
  },
  {
    icon: 'lucide:bell-ring',
    title: 'Notifications',
    path: '/notifications'
  },
  {
    icon: 'ic:baseline-add-chart',
    title: 'Requests',
    path: '/requests',
    children: [
      {
        icon: 'ic:baseline-access-time',
        title: 'New',
        path: '/requests/new'
      },
      {
        icon: 'material-symbols:all-match-outline',
        title: 'Sent',
        path: '/requests/sent'
      },
      {
        icon: 'akar-icons:chat-approve',
        title: 'Confirmed',
        path: '/requests/confirmed'
      },
      // {
      //   icon: 'akar-icons:chat-approve',
      //   title: 'Confirmed',
      //   path: '/requests'
      // }
    ]
  },
  {
    icon: 'lucide:menu-square',
    title: 'Report',
    path: '/',
    children: [
      {
        icon: 'mdi:account-school',
        title: 'Single Student',
        path: '/report/singleStudent'
      },
      {
        icon: 'material-symbols:upgrade',
        title: 'Grade Wise',
        path: '/report/gradewise'
      },
      {
        icon: 'ion:school-outline',
        title: 'Full School',
        path: '/report/fullschool'
      }
    ]
  }
]

export default routes
