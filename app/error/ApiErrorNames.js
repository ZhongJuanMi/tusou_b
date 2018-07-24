/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";
ApiErrorNames.USER_NOT_EXIST = "userNotExist";
ApiErrorNames.TOKEN_EXPIRED_ERROR = " TokenExpiredError";
ApiErrorNames.USER_NOT_LOGIN = " UserNotLogin";


/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, {
  code: -1,
  message: '未知错误'
});
error_map.set(ApiErrorNames.USER_NOT_EXIST, {
  code: 4001,
  message: '用户不存在'
});
error_map.set(ApiErrorNames.TOKEN_EXPIRED_ERROR, {
  code: 4008,
  message: '登录信息已失效'
});
error_map.set(ApiErrorNames.USER_NOT_LOGIN, {
  code: 4007,
  message: '用户未登录'
});

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

  var error_info;

  if (error_name) {
    error_info = error_map.get(error_name);
  }

  //如果没有对应的错误信息，默认'未知错误'
  if (!error_info) {
    error_name = UNKNOW_ERROR;
    error_info = error_map.get(error_name);
  }

  return error_info;
}

module.exports = ApiErrorNames;