import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import ReactTooltip from 'react-tooltip'
import * as authActions from 'redux/actions/auth'

import Dropdown from 'react-bootstrap/lib/Dropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import { LinkContainer } from 'react-router-bootstrap'

import Amount from 'components/Amount/Amount'

import Onboarding from 'containers/Onboarding/Onboarding'
import SendForm from 'containers/SendForm/SendForm'
import Activity from 'containers/Activity/Activity'
import Stats from 'containers/Stats/Stats'

import classNames from 'classnames/bind'
import styles from './Home.scss'
const cx = classNames.bind(styles)

@connect(
  state => ({
    user: state.auth.user,
    activeTab: state.auth.activeTab,
    verified: state.auth.verified,
    config: state.auth.config
  }),
  authActions)
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    reload: PropTypes.func,
    config: PropTypes.object,
  }

  state = {}

  reload = () => {
    this.setState({
      ...this.state,
      reloading: true
    })

    this.props.reload({ username: this.props.user.username })
      .then(() => {
        this.setState({
          ...this.state,
          reloading: false
        })
      })
      .catch(() => {
        this.setState({
          ...this.state,
          reloading: false
        })
      })
  }

  toggleStats = (event) => {
    this.setState({
      ...this.state,
      showStats: !this.state.showStats
    })

    event.preventDefault()

    tracker.track('Toggle Stats')
  }

  renderDepositLink = settlementMethod => {
    const destination = this.props.user.destination

    if (settlementMethod.type === 'custom') {
      return (
        <MenuItem href={`${settlementMethod.uri}?destination=${destination}`} key={settlementMethod.name}>
          {settlementMethod.logo && <img src={settlementMethod.logo} className={cx('logo')}/>}
          {!settlementMethod.logo && settlementMethod.name}
        </MenuItem>
      )
    }

    return (
      <LinkContainer to={`/settle/${settlementMethod.type}/${destination}`} key={settlementMethod.name}>
        <MenuItem>
          {settlementMethod.logo && <img src={settlementMethod.logo} className={cx('logo')}/>}
          {!settlementMethod.logo && settlementMethod.name}
        </MenuItem>
      </LinkContainer>
    )
  }

  render() {
    const { user, config } = this.props
    const { showStats, reloading } = this.state

    // For some reason dynamic routers have problems with that state
    if (!user) return null
    return (
      <div className="row">
        <div className={cx('col-sm-8', 'activityBox')}>
          {/* Onboarding */}
          <Onboarding />

          {/* Activity */}
          {/* <div>
            {showStats &&
            <a href="" onClick={this.toggleStats}>Payment Activity</a>}
            {!showStats &&
            <span>Payment Activity</span>}
          </div>
          <div className="pull-right">
            {showStats &&
            <span>Stats</span>}
            {!showStats &&
            <a href="" onClick={this.toggleStats}>Stats</a>}
          </div> */}

          <div className={cx('header')}>
            <h3>Activity</h3>
          </div>

          {!showStats && <Activity />}
          {showStats && <Stats />}
        </div>
        <div className="col-sm-4">
          {/* Balance */}
          <div className={cx('balanceContainer')}>
            <h4 className={cx('balanceDescription')}>Your Balance</h4>
            <div className={cx('balance')}>
              <Amount amount={user.balance} currencySymbol={config.currencySymbol} />
              {config.reload && <span className={cx('but')}>*</span>}
            </div>
            {!config.reload && config.settlementMethods && config.settlementMethods.length > 0 &&
            <div className={cx('settlementButtonBox')}>
              <Dropdown id="settlementButton" pullRight>
                <Dropdown.Toggle bsStyle="success" bsSize="large">
                  Deposit
                </Dropdown.Toggle>
                <Dropdown.Menu className={cx('options')}>
                  {config.settlementMethods.map(this.renderDepositLink)}
                </Dropdown.Menu>
              </Dropdown>
            </div>}
            {config.reload &&
            <div>
              <a className="btn btn-success btn-lg"
                 onClick={!user.isAdmin && this.reload} disabled={user.isAdmin}
                 data-tip={user.isAdmin && "You have enough, you're the admin"}>
                {!reloading && 'Get More'}
                {reloading && 'Getting...'}
              </a>
              <div className={cx('balanceFake')}>* Don't get too excited, this is fake money</div>
            </div>}
          </div>

          {/* Send Form */}
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">Send Money</div>
            </div>
            <div className="panel-body">
              <SendForm />
            </div>
          </div>
        </div>

        <ReactTooltip />
      </div>
    )

  }
}
