/**
 * 开发环境的配置内容
 */

const config = {
  // 启动端口
  port: 8000,

  // 数据库配置
  database: {
    env:"development",
    DATABASE: 'tusou',
    USERNAME: 'zjmm',
    PASSWORD: '5.26172mds',
    PORT: '3306',
    HOST: '47.106.200.223'
  }
}

module.exports = config