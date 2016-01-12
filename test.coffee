setting = require './index-setting.json'
request = require 'request'

#添加数据 api
#postlist =
#  index:"test"
#  type:"test"
#  title : "辅导费"
#  content : "这是测试内容"
#  keyword : "这是关键字"
#request.post {
#  url: "http://192.168.0.132:3000/add"
#  form: postlist
#}, (err, httpResponse, body) ->
#  if err
#    console.log err
#  else
#    console.log body

#搜索api
postlist =
  index:"test"
  type:"test"
  searchvalue : '辅导费'
request.post {
  url: "http://192.168.0.132:3000/search"
  form: postlist
}, (err, httpResponse, body) ->
  if err
    console.log err
  else
    console.log body