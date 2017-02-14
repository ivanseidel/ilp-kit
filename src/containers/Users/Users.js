import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Helmet from 'react-helmet'

import { loadUsers } from 'redux/actions/user'

import classNames from 'classnames/bind'
import styles from './Users.scss'
const cx = classNames.bind(styles)

@connect(
  state => ({
    users: state.user.users,
    loaded: state.user.loaded
  }),
  { loadUsers })
export default class Invites extends Component {
  static propTypes = {
    loadUsers: PropTypes.func,
    users: PropTypes.array,
    loaded: PropTypes.bool
  }

  componentWillMount() {
    if(!this.props.loaded) {
      this.props.loadUsers()
    }
  }

  render() {
    const { users } = this.props

    return (
      <div className={cx('Users')}>
        <Helmet title={'Users'} />

        <BootstrapTable data={users} striped hover>
          <TableHeaderColumn dataField="name" isKey dataSort>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="balance" dataSort>Balance</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}
