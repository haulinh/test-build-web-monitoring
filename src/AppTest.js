import React from 'react'
import axios from 'axios'
import 'whatwg-fetch'
import { getConfigApi } from 'config'

const token =
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWFmODQ2ZmVlZmMyMDBhMjI2NmY5YzMiLCJpYXQiOjE1MzcwMTI0MTB9.rSZGniFLtxd2KsXaPqCK628RJfVSx3N5yAdx24qaaao'

export default class AppTest extends React.Component {
  async componentDidMount() {
    const config = getConfigApi()
    try {
      fetch(config.aqi, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
        .catch(e => {
          console.log(e)
        })
      // const {data} = await fet.get(config.aqi, {
      //   headers:{
      //     "Authorization": token
      //   }
      // })
      // console.log(data)
    } catch (e) {
      console.log(e)
    }
  }
  render() {
    return <div>Blank</div>
  }
}
