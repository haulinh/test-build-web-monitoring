import React from 'react'
import { Switch, Route } from 'react-router-dom'
import slug from 'constants/slug'
import StationAutoList from './station-auto-list'
import StationAutoCreate from './station-auto-create'
import StationAutoEdit from './station-auto-edit'
import StationAutoConfig from './station-auto-config'
import StationAutoFtpInfo from './station-auto-ftp-info'
import StationAutoFtpFile from './station-auto-ftp-file'
import StationAutoRange from './station-auto-range'
import StationAutoConfigConnection from './station-auto-config-connection'

export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    <Route
      exact
      path={slug.stationAuto.list}
      render={matchProps => <StationAutoList {...matchProps} {...props} />}
    />
    <Route
      exact
      path={slug.stationAuto.configConnection.base}
      render={matchProps => <StationAutoConfigConnection {...matchProps} {...props} />}
    />
    <Route 
      path={slug.stationAuto.configConnection.ftpWithKey} 
      component={StationAutoFtpInfo}
    />
    <Route
      path={slug.stationAuto.configConnection.fileWithKey} 
      component={StationAutoConfig}
    />
    <Route path={slug.stationAuto.edit} component={StationAutoEdit} />
    <Route path={slug.stationAuto.ftpFile} component={StationAutoFtpFile} />
    <Route path={slug.stationAuto.range} component={StationAutoRange} />
    <Route path={slug.stationAuto.create} component={StationAutoCreate} />
  </Switch>
)



// {/* <Switch>
// {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
// <Route
//   exact
//   path={slug.stationAuto.list}
//   render={matchProps => <StationAutoList {...matchProps} {...props} />}
// />
// <Route
//   path={slug.stationAuto.create}
//   render={matchProps => <StationAutoCreate {...matchProps} {...props} />}
// />
// <Route path={slug.stationAuto.edit} component={StationAutoEdit} />
// <Route path={slug.stationAuto.config} component={StationAutoConfig} />
// <Route path={slug.stationAuto.ftpInfo} component={StationAutoFtpInfo} />
// <Route path={slug.stationAuto.ftpFile} component={StationAutoFtpFile} />
// <Route path={slug.stationAuto.range} component={StationAutoRange} />
// {/*<Route path={slug.stationAuto.create} component={StationAutoCreate} />*/}
// </Switch> */}