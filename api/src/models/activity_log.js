'use strict'

module.exports = ActivityLogFactory

const _ = require('lodash')
const Container = require('constitute').Container
const Model = require('five-bells-shared').Model
const PersistentModelMixin = require('five-bells-shared').PersistentModelMixin
const Database = require('../lib/db')
const Validator = require('five-bells-shared/lib/validator')
const Sequelize = require('sequelize')
const UserFactory = require('./user')
const PaymentFactory = require('./payment')
const SettlementFactory = require('./settlement')
const ActivityLogsItemFactory = require('./activity_logs_item')

ActivityLogFactory.constitute = [Database, Validator, Container]
function ActivityLogFactory (sequelize, validator, container) {
  let ActivityLogsItem
  let Payment
  let Settlement

  class ActivityLog extends Model {
    static convertFromExternal (data) {
      return data
    }

    static convertToExternal (data) {
      delete data.created_at
      delete data.updated_at

      return data
    }

    static convertFromPersistent (data) {
      data = _.omit(data, _.isNull)
      return data
    }

    static convertToPersistent (data) {
      return data
    }

    static * getUserActivityLog (userId, page, limit) {
      page = page > 0 ? Number(page) : 1
      limit = Number(limit)

      // TODO:BEFORE_DEPLOY don't include all of the fields
      return ActivityLog.DbModel.findAndCountAll({
        distinct: true,
        where: { user_id: userId },
        include: [
          { model: Payment.DbModel },
          { model: Settlement.DbModel }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset: limit * (page - 1)
      })
    }

    static * getActivityLog (id) {
      // TODO:BEFORE_DEPLOY don't include all of the fields
      return ActivityLog.findOne({
        where: { id },
        include: [
          { model: Payment.DbModel },
          { model: Settlement.DbModel }
        ]
      })
    }
  }

  ActivityLog.validateExternal = validator.create('ActivityLog')

  PersistentModelMixin(ActivityLog, sequelize, {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    }
    // TODO:BEFORE_DEPLOY update migration
  })

  container.schedulePostConstructor(User => {
    ActivityLog.DbModel.belongsTo(User.DbModel)
  }, [ UserFactory ])

  container.schedulePostConstructor(model => {
    ActivityLogsItem = model

    container.schedulePostConstructor(model => {
      Payment = model

      // Payment
      ActivityLog.DbModel.belongsToMany(Payment.DbModel, {
        through: {
          model: ActivityLogsItem.DbModel,
          unique: false,
          scope: {
            item_type: 'payment'
          }
        },
        foreignKey: 'activity_log_id',
        constraints: false
      })
    }, [ PaymentFactory ])

    // Settlement
    container.schedulePostConstructor(model => {
      Settlement = model

      ActivityLog.DbModel.belongsToMany(Settlement.DbModel, {
        through: {
          model: ActivityLogsItem.DbModel,
          unique: false,
          scope: {
            item_type: 'settlement'
          }
        },
        foreignKey: 'activity_log_id',
        constraints: false
      })
    }, [ SettlementFactory ])
  }, [ ActivityLogsItemFactory ])

  return ActivityLog
}
