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
import StationAutoConfigNotification from './station-auto-config-notification'
import StationAutoConfigSampling from './station-auto-config-sampling'
import StationAutoConfigCamera from './station-auto-config-camera'
import StationAutoConfigColor from './station-auto-config-color'


export default props => (
  <Switch>
    {/*Lấy ra các thành phần props từ component bên ngoài truyền vào như default layout*/}
    {/* NOTE   trang trạm quan trắc */}
    <Route
      exact
      path={slug.stationAuto.list}
      render={matchProps => <StationAutoList {...matchProps} {...props} />}
    />
    {/* NOTE   trang cấu hình kết nối */}
    <Route
      exact
      path={slug.stationAuto.configConnection.base}
      render={matchProps => <StationAutoConfigConnection {...matchProps} {...props} />}
    />
    {/* NOTE   trang cấu hình gửi cảnh báo */}
    <Route
      exact
      path={slug.stationAuto.configSendNotification.base}
      render={matchProps => <StationAutoConfigNotification {...matchProps} {...props} />}
    />
    {/* NOTE   trang cấu hình lấy lẫu */}
    <Route
      exact
      path={slug.stationAuto.configSampling.base}
      render={matchProps => <StationAutoConfigSampling {...matchProps} {...props} />}
    />
    {/* NOTE   trang cấu hình camera */}
    <Route
      exact
      path={slug.stationAuto.configCamera.base}
      render={matchProps => <StationAutoConfigCamera {...matchProps} {...props} />}
    />
    {/* NOTE   trang cấu hình màu sắc */}
    <Route
      exact
      path={slug.stationAuto.configColor.base}
      render={matchProps => <StationAutoConfigColor {...matchProps} {...props} />}
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