const {
  sequelize,
  Weight,
  User
} = require('./database')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'tuzatuza0713'
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

// 设置体重值
exports.setWeight = async (ctx, next) => {
  let token = ctx.header.authorization
  if (token) {
    try {
      let {
        name,
        id
      } = await verify(token.split(' ')[1], secret)
      let user = await User.findOne({
        where: {
          name,
          id
        }
      })
      if (user) {
        let {
          datetime,
          weight
        } = ctx.request.body
        let _datetime = datetime.split(" ")
        let date = _datetime[0]
        let time = _datetime[1]
        let AP = parseInt(time.slice(0, 2)) < 12 ? 'AM' : 'PM'
        await Weight.create({
          userId: user.id,
          weight,
          date,
          time,
          AP
        })
      } else {
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
      }
    } catch (err) {
      throw new ApiError(ApiErrorNames.TOKEN_EXPIRED_ERROR)
    }
  } else {
    throw new ApiError(ApiErrorNames.USER_NOT_LOGIN)
  }
}
// 获取体重信息
exports.getWeight = async (ctx, next) => {
  let token = ctx.header.authorization
  if (token) {
    try {
      let {
        id
      } = await verify(token.split(' ')[1], secret)
      let user = await User.findAll({
        include: [Weight],
        where: {
          id
        }
      })
      if (user) {
        if (user.length > 1 || user[0].weight) {
          let weights = user.map(item => item.weight)
          let res = weights.map(item => {
            return {
              date: item.date,
              weight: item.weight,
              AP: item.AP
            }
          })
          let amres = res.filter(item => item.AP === 'AM')
          let pmres = res.filter(item => item.AP === 'PM')
          ctx.body = {
            weights: weightCon(weightPer(amres), weightPer(pmres))
          }
        } else {
          ctx.body = {
            weights: []
          }
        }

      } else {
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
      }

    } catch (err) {
      throw new ApiError(ApiErrorNames.TOKEN_EXPIRED_ERROR)
    }
  } else {
    throw new ApiError(ApiErrorNames.USER_NOT_LOGIN)
  }
}

function weightPer(ary) {
  let temp = []
  for (let i in ary) {
    if (i == 0) {
      temp.push({
        date: ary[0].date,
        weight: ary[0].weight,
        AP: ary[0].AP
      })
    } else {
      let flag = true
      for (let j in temp) {
        if (ary[i].date == temp[j].date) {
          flag = false
          temp[j].weight = ((Number(ary[i].weight) + Number(temp[j].weight)) / 2).toFixed(2)
        }
      }
      if (flag) {
        temp.push({
          date: ary[i].date,
          weight: ary[i].weight,
          AP: ary[i].AP
        })
      }
    }
  }
  return temp
}

function weightCon(ary1, ary2) {
  let ary = [...ary1, ...ary2]
  let temp = []
  for (let i in ary) {
    if (i == 0) {
      temp.push({
        date: ary[0].date,
        AM: ary[0].AP == 'AM' ? ary[0].weight : null,
        PM: ary[0].AP == 'PM' ? ary[0].weight : null
      })
    } else {
      let flag = true
      for (let j in temp) {
        if (temp[j].date == ary[i].date) {
          flag = false
          if (ary[i].AP == 'AM') {
            temp[j].AM = ary[i].weight
          }
          if (ary[i].AP == 'PM') {
            temp[j].PM = ary[i].weight
          }
        }
      }

      if (flag) {
        temp.push({
          date: ary[i].date,
          AM: ary[i].AP == 'AM' ? ary[i].weight : null,
          PM: ary[i].AP == 'PM' ? ary[i].weight : null
        })
      }
    }
  }
  // 排序
  temp.sort((a, b) => {
    return (new Date(a.date)).getTime() - (new Date(b.date)).getTime()
  })
  return temp
}