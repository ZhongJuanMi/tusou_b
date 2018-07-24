/**
 * 测试环境的配置内容
 */

const config = {
    // 启动端口
    port: 8000,

    // 数据库配置
    database: {
        env: "test",
        DATABASE: 'tusou',
        USERNAME: 'zj',
        PASSWORD: '5261728911',
        PORT: '3306',
        HOST: 'localhost'
    }
}

module.exports = config