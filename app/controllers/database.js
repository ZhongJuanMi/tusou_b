const Sequelize = require('sequelize')
const config = require('../../config')
const database = config.database

exports.sequelize = new Sequelize(
  database.DATABASE,
  database.USERNAME,
  database.PASSWORD, {
    host: database.HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  }
)
// 用户信息表
exports.User = this.sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },

  height: {
    type: Sequelize.STRING
  },
  idealWeight: {
    type: Sequelize.STRING
  },
  gender: {
    type: Sequelize.STRING,
  }
})
// 体重信息表
exports.Weight = this.sequelize.define('weight', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id',
    unique: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  weight: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.STRING
  },
  time: {
    type: Sequelize.STRING
  },
  AP: {
    type: Sequelize.STRING
  }
})

this.User.hasOne(this.Weight)
this.Weight.belongsTo(this.User)

this.sequelize.sync()