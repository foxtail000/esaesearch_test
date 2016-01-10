var express = require('express');
var router = express.Router();
var setting = require('../index-setting.json')
var elasticsearch = require('elasticsearch');
var mongoose = require('mongoose');
//var nodejieba = require("nodejieba");
var client = new elasticsearch.Client({                      //elasticsearch服务端
  host: setting.elasticsearch,
  log: 'trace'
});

mongoose.connect("mongodb://"+setting.mongo+"/clc");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var alarm = new Schema({
    titile    : String,
    content     : String,
    keyword      : String
});

/* GET home page. */
router.get('/', function(req, res, next) {      //查询所有数据库所有数据
    client.search({
        index:'alarms',
        type:'tbAlarms',
        body:{
            query:{
                "match_all": {}
            }
        }
    }).then(function(body){
        var hits=body.hits.hits;
            res.render('index',{ all:hits} )
    }, function (error) {
        console.log(error.message);
    });

});

router.post('/search',function(req,res){                //搜索，使用elasticsearch 中文分词器：ik
  var searchvalue= req.body.searchvalue;
  client.search({
          index:'alarms',
          type:'tbAlarms',
          analyzer:"ik",
          body:{
              query:{
                  bool: {
                      should: [
                          {match: {
                              title: searchvalue
                          }},
                          {match: {
                              content: searchvalue
                          }}
                      ]
                  }
              }
          }
      }
  ).then(function(body){
        var hits=body.hits.hits;
        if(hits.length!=0){
          res.render('resultview',{ result:hits} )
        }
        else{
          res.render('resultview',{ result:"未找到相关"} )
        }

      }, function (error) {
      console.log(error.message);
  });

});

router.post('/add',function(req,res){
    //client.create({
    //    index: 'alarms',
    //    type: 'tbAlarms',
    //    body: {
    //        title: req.body.title,
    //        content: req.body.content
    //    }
    //},function(error,response){
    //    if(error){
    //        console.log(error.message);
    //    }else{
    //        res.render('success');
    //    }
    //    //...
    //})

})


module.exports = router;
