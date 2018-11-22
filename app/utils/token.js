const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'tuzatuza0713'
// 生成token
exports.createToken=(id)=>{
  let userToken = {
    id
  }
  const token = jwt.sign(userToken, secret, {
    expiresIn: '168h'
  }) //token签名 有效期为7天
  return token
}
// 解密token
exports.verifyID=async (token)=>{
  let res=await verify(token.split(' ')[1], secret)
  return res.id
}