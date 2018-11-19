const Sequelize = require('sequelize')
const config = require('../../config')
const database = config.database

exports.sequelize = new Sequelize(
  database.DATABASE,
  database.USERNAME,
  database.PASSWORD,
  {
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
    type: Sequelize.STRING
  },
  is_tz: {
    type: Sequelize.STRING
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
// 博客详情表
exports.Blog = this.sequelize.define('blog', {
  title: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  },
  tags: {
    type: Sequelize.STRING
  },
  is_draft:{
    type:Sequelize.INTEGER
  }
})
// 草稿详情表
exports.Draft = this.sequelize.define('draft', {
  title: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  },
  tags: {
    type: Sequelize.STRING
  }
})
// 博客分类表
exports.BlogTags = this.sequelize.define(
  'blogtags',
  {
    parentid: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    classification: {
      type: Sequelize.STRING
    },
    image:{
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)
this.User.hasOne(this.Weight)
// this.Weight.belongsTo(this.User)
this.sequelize.sync()
