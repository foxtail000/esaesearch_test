var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
//var nodejieba = require("nodejieba");
var client = new elasticsearch.Client({                      //elasticsearch服务端
  host: '192.168.0.100:9200',
  log: 'trace'
});


/* GET home page. */
router.get('/', function(req, res, next) {      //查询所有数据库所有数据
    client.search({
        index:'indextest',
        type:'typetest',
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
          index:'indextest',
          type:'typetest',
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

//router.post('/add',function(req,res){
//    client.create({
//        index: 'testindex',
//        type: 'testtype',
//        body: {
//            title: req.body.title,
//            content: req.body.content
//        }
//    },function(error,response){
//        if(error){
//            console.log(error.message);
//        }else{
//            res.render('success');
//        }
//        //...
//    })
//})


module.exports = router;
