export default {
  dashboard: '/dashboard',
  landFill: {
    base: '/landfill',
    list: '/landfill',
    create: '/landfill/create'
  },
  transitStation: {
    base: '/transit-station',
    list: '/transit-station',
    create: '/transit-station/create'
  },
  appointment: {
    base: '/appointment',
    list: '/appointment',
    create: '/appointment/create'
  },
  categories: {
    base: '/categories',
    list: '/categories',
    create: '/categories/create',
    edit: '/categories/edit/:code',
    editWithCode: '/categories/edit/'
  },
  map: {
    base: '/map'
  }
}
