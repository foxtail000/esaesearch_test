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


var tbalarms = mongoose.model('tbalarms', {
    title    : String,
    content     : String,
    keyword      : String,
    createtime  : String
});


/* GET home page. */
router.get('/', function(req, res, next) {
    client.search({
        index:'alarms',
        type:'tbalarms',
        body:{
            query:{
                "match_all": {}
            }
        }
    }).then(function(body){
        var hits=body.hits.hits;
            console.log(hits)
            res.render('index',{ all:hits} )
    }, function (error) {
        console.log(error.message);
    });
    //res.render('index' )
});

router.post('/search',function(req,res){                //搜索，使用elasticsearch 中文分词器：ik
  var searchvalue= req.body.searchvalue;
  client.search({
          index:'alarms',
          type:'tbalarms',
          analyzer:"ik",
          body:{
              query:{
                  bool: {
                      should: [
                          {match: {
                              keyword:{
                                  query:searchvalue,
                                  boost:3
                              }
                          }},
                          {match: {
                              title:{
                                  query:searchvalue,
                                  boost:1
                              }
                          }},
                          {match: {
                              content:{
                                  query:searchvalue,
                                  boost:1
                              }
                          }}
                      ]
                  }
              }
          }
      }
  ).then(function(body){
        var hits=body.hits.hits;
        if(hits.length!=0){
          res.json(hits)
        }
        else{
          res.json("")
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
    console.log(req.body);
    var kitty = new tbalarms({
        title    : req.body.title,
        content     : req.body.content,
        keyword      : req.body.keyword,
        createtime  : new Date()
    });
    kitty.save(function (err) {
        if (err){
            console.log('meow');
            res.json("err")
        }
        else
            res.json("seccuse")

    });
})


module.exports = router;
