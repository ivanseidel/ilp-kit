import React, {Component} from 'react'

export default class WebPaymentsSupport extends Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="panel-title">W3C Web Payments</div>
        </div>
        <div className="panel-body">
          <button type="submit" className="btn btn-primary" disabled>
            Add this ilp-kit to this browser as a payment app.
          </button>
          <p>Sorry! your browser does not seem to support WebPayments...</p>
        </div>
      </div>
    )
  }
}
