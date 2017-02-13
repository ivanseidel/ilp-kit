import React, {Component} from 'react'
import Helmet from 'react-helmet'

import ProfileForm from './ProfileForm'
import WebPaymentsSupport from './WebPaymentsSupport'

export default class Settings extends Component {
  render() {
    return (
      <div className="row">
        <Helmet title={'Settings'} />

        <div className="col-sm-offset-3 col-sm-6">
          <ProfileForm />
          <WebPaymentsSupport />
        </div>
      </div>
    )
  }
}
