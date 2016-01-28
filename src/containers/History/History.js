import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as historyActions from 'redux/modules/history';

import { HistoryItem } from 'components';

import classNames from 'classnames/bind';
import styles from './History.scss';
const cx = classNames.bind(styles);

@connect(
  state => ({
    history: state.history.history,
    user: state.auth.user
  }),
  historyActions)
export default class Home extends Component {
  static propTypes = {
    load: PropTypes.func,
    history: PropTypes.array,
    user: PropTypes.object,
    showJson: PropTypes.func
  }

  // Load the history
  componentDidMount() {
    this.props.load();
  }

  render() {
    const {history, user, showJson} = this.props;

    return (
      <div>
        <ul className={cx('list')}>
          {history && history.map(item => {
            return <li key={item.id}><HistoryItem item={item} user={user} showJson={showJson} /></li>;
          })}
        </ul>
      </div>
    );
  }
}
