const { Blog, BlogTags } = require('./database')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
var formatDateTime = function(date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
// 存储或更新博客、草稿
// 无到博客 新建
// 草稿到博客 更新
// 博客到博客 更新
// 无到草稿 新建
// 草稿到草稿 更新
// 博客到草稿 新建

exports.addorsetBlog = async (ctx, next) => {

  try {
    let { title, content, tags, is_draft, id } = ctx.request.body
    await Blog.findOrCreate({
      where: {
        id
      },
      defaults: {
        title,
        content,
        tags,
        is_draft
      }
    }).spread(async function(blog, created) {
      if (created === false) {
        if ((!blog.is_draft)&&is_draft) {
          await Blog.create({
            title,
            content,
            tags,
            is_draft
          }).then(blog=>{
            ctx.body=blog.id
          })
        } else {
          blog.update({ title, content, tags, is_draft })
        }
      }
    })
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 删除博客、草稿
exports.delBlog = async (ctx, next) => {
  try {
    let { id } = ctx.request.body
    
    await Blog.destroy({
      where: {
        id
      }
    })
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 获取博客分类
exports.getBlogTags = async (ctx, next) => {
  try {
    let result = await BlogTags.findAll()
    ctx.body = result
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 获取博客分类组合
exports.getBlogTagsCom = async (ctx, next) => {
  try {
    let list = await BlogTags.findAll()
    let result = list
      .filter(item => item.classification == 1)
      .map(item => {
        return {
          label: item.name,
          value: item.id,
          children: []
        }
      })
    result.forEach(i => {
      list.forEach(j => {
        if (j.parentid == i.value) {
          i.children.push({
            label: j.name,
            value: j.id
          })
        }
      })
    })
    result.forEach(i => {
      if (i.children.length) {
        i.children.forEach(k => {
          list.forEach(v => {
            if (v.parentid == k.value) {
              if (!k.children) {
                k.children = []
              }
              k.children.push({
                label: v.name,
                value: v.id
              })
            }
          })
        })
      }
    })
    ctx.body = result
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 通过分页，条件查询获取博客列表
exports.getBlogList = async (ctx, next) => {
  try {
    let {
      page,
      pageSize,
      sort,
      keywords,
      tags,
      year,
      mouth,
      is_draft
    } = ctx.query
    if (!page) {
      page = 1
    }
    if (!pageSize) {
      pageSize = 10
    }
    if (!sort) {
      sort = 0
    }
    if (!keywords) {
      keywords = ''
    }
    if (!tags) {
      tags = ''
    }
    let result = await Blog.findAndCountAll({
      order: [['createdAt', sort * 1 ? 'ASC' : 'DESC']],
      offset: (page - 1) * pageSize, //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize, //每页限制返回的数据条数
      where: {
        $or: [
          {
            title: {
              $like: '%' + keywords + '%'
            }
          },
          {
            content: {
              $like: '%' + keywords + '%'
            }
          }
        ],
        tags: {
          $regexp: `(,)?${tags}(,)?`
        },
        is_draft: 0
      }
    })
    let _tags = await BlogTags.findAll({})
    let temp=[]
    result.rows.forEach(el => {
      let _time = formatDateTime(el.createdAt)
      let _tag = el.tags.split(',')
      let str = ''
      let _pic=''
      _tag.forEach((i, index) => {
        _tags.forEach(j => {
          if (i == j.id) {
            str += j.name
            _pic=j.image
          }
        })
        if (index < _tag.length - 1) {
          str += '-'
        }
      })
      
      let _content = el.content.replace(/<\/?.+?>/g, '').substring(0, 100)
      if (_content.length >= 100) {
        _content += '...'
      }
      temp.push({
        id:el.id,
        time:_time,
        tags:str,
        title:el.title,
        content:_content,
        pic:_pic
      })
    })
    ctx.body = {
      list: temp,
      pageSize: pageSize * 1,
      page: page * 1,
      count: result.count * 1
    }
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 获取草稿列表
exports.getDraftList = async (ctx, next) => {
  try {
    let result = await Blog.findAll({
      attributes: ['id', 'title'],
      where: {
        is_draft: 1
      }
    })
    ctx.body = result
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 获取博客列表时间组合
exports.getBlogListCom = async (ctx, next) => {
  try {
    let time = await Blog.findAll({
      attributes: ['createdAt'],
      where: {
        is_draft: 0
      }
    })
    let temp = []
    time.forEach(el => {
      temp.push(
        formatDateTime(el.createdAt)
          .substr(0, 7)
          .split('-')
      )
    })
    let result = []
    for (let i in temp) {
      if (i * 1) {
        for (let j in result) {
          if (temp[i][0] == result[j].year) {
            let is_find = false
            for (let k of result[j].mouth) {
              if (k == temp[i][1]) {
                is_find = true
              }
            }
            if (!is_find) {
              result[j].mouth.push(temp[i][1])
            }
          } else {
            result.push({
              year: temp[i][0],
              mouth: []
            })
          }
        }
      } else {
        result.push({ year: temp[0][0], mouth: [] })
      }
    }
    ctx.body = result
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
// 获取博客详情
exports.getBlogDetail = async (ctx, next) => {
  try {
    let temp = await Blog.findOne({
      where: {
        id: ctx.query.id
      }
    })
    let result = {}
    result.create_time = formatDateTime(temp.createdAt)
    result.update_time = formatDateTime(temp.updatedAt)
    result.title = temp.title
    result.content = temp.content
    result.tags = temp.tags
    ctx.body = result
  } catch (err) {
    throw new ApiError(ApiErrorNames.UNKNOW_ERROR)
  }
}
