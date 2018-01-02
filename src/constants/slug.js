export default {
  dashboard: '/dashboard',
  login: '/login',
  landFill: {
    base: '/landfill',
    list: '/landfill',
    create: '/landfill/create'
  },
  transitStation: {
    base: '/transit-station',
    list: '/transit-station',
    create: '/transit-station/create',
    edit: '/transit-station/edit/:_id',
    editWithCode: '/transit-station/edit/'

  },
  appointment: {
    base: '/appointment',
    list: '/appointment',
    create: '/appointment/create'
  },
  category: {
    base: '/category',
    list: '/category',
    create: '/category/create',
    edit: '/category/edit/:code',
    editWithCode: '/category/edit/'
  },
  map: {
    base: '/map'
  },
  organization: {
    base: '/organization',
    list: '/organization',
    create: '/organization/create',
    edit: '/organization/edit/:_id',
    editWithId: '/organization/edit/'
  }
}
