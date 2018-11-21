const {
  sequelize,
  User
} = require('./database')
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'tuzatuza0713'
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

// 校验用户是否已经注册
exports.ifUser = async (ctx, next) => {
  let name = ctx.query.name
  let result = await User.findOne({
    where: {
      name
    }
  })
  ctx.body = result ? 1 : 0
}
// 生成token
function createToken(name, id) {
  let userToken = {
    name,
    id
  }
  const token = jwt.sign(userToken, secret, {
    expiresIn: '168h'
  }) //token签名 有效期为7天

  return token
}
//用户登录,返回token及用户信息
exports.logUser = async (ctx, next) => {
  let {
    name,
    password
  } = ctx.request.body
  let result = await User.findOne({
    where: {
      name,
      password
    }
  })
  // 生成token
  if (result) {
    const token = createToken(result.name, result.id)
    ctx.body = {
      userInfo: {
        name: result.name,
        height: result.height,
        gender: result.gender,
        idealWeight: result.idealWeight,
        is_tz:result.is_tz,
        user_pic:result.user_pic
      },
      token
    }
  } else {
    throw new ApiError(ApiErrorNames.USER_NOT_LOGIN)
  }
}

//用户注册,返回token及用户名
exports.registerUser = async (ctx, next) => {
  let {
    name,
    password
  } = ctx.request.body
  await User.create({
    name,
    password
  })
  let user = await User.findOne({
    where: {
      name,
      password
    }
  })
  const token = createToken(user.name, user.id)
  ctx.body = {
    userInfo: {
      name: user.name,
      height: user.height,
      gender: user.gender,
      idealWeight: user.idealWeight,
      is_tz:user.is_tz
    },
    token
  }
}

// 获取用户信息
exports.getUser = async (ctx, next) => {
  let token = ctx.query.token || ctx.header.authorization
  if (token) {
    try {
      let {
        id
      } = await verify(token.split(' ')[1], secret)
      let user = await User.findOne({
        where: {
          id
        }
      })
      if (user) {
        let {
          name,
          height,
          gender,
          idealWeight,
          is_tz,user_pic
        } = user
        ctx.body = {
          userInfo: {
            name,
            height,
            gender,
            idealWeight,
            is_tz,
            user_pic
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

// 设置用户信息
exports.setInfo = async (ctx, next) => {
  let {
    height,
    idealWeight,
    gender,
    name,
    user_pic
  } = ctx.request.body
  let token = ctx.header.authorization
  if (token) {
    try {
      let {
        id
      } = await verify(token.split(' ')[1], secret)
      let user = await User.findOne({
        where: {
          id
        }
      })
      if (user) {
        await user.update({
          height,
          idealWeight,
          gender,
          name,
          user_pic
        }, {
          where: {
            id
          }
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