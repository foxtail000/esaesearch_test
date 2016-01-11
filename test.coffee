setting = require './index-setting.json'
request = require 'request'

#添加数据 api
#postlist =
#  title : "测试"
#  content : "测试内容"
#  keyword : "测试"
#request.post {
#  url: "http://localhost:3000/add"
#  form: postlist
#}, (err, httpResponse, body) ->
#  if err
#    console.log err
#  else
#    console.log body

#搜索api
postlist =
  searchvalue : '公司'
request.post {
  url: "http://localhost:3000/search"
  form: postlist
}, (err, httpResponse, body) ->
  if err
    console.log err
  else
    console.log body