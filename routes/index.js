var express = require('express');
var router = express.Router();
var setting = require('../index-setting.json')
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({                      //elasticsearch服务端
  host: setting.elasticsearch,
  log: 'trace'
});

//mongoose.connect("mongodb://"+setting.mongo+"/clc");
//
//
//var tbalarms = mongoose.model('tbalarms', {
//    title    : String,
//    content     : String,
//    keyword      : String,
//    createtime  : String
//});


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index' )
});

router.post('/search',function(req,res){                //搜索，使用elasticsearch 中文分词器：ik

    if(req.body.searchvalue && req.body.index && req.body.type){
        var searchvalue= req.body.searchvalue;

        client.search({
                index:req.body.index,
                type:req.body.type,
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
                res.json("err")
            });
    }
    else{
        res.json("err")
    }


});

router.post('/add',function(req,res){
    if(req.body.index && req.body.type) {
        client.create({
            index: req.body.index,
            type: req.body.type,
            body: {
                title: req.body.title,
                content: req.body.content,
                keyword: req.body.keyword,
                createtime: new Date()
            }
        }, function (error, response) {
            if (error) {
                res.json("err");
            } else {
                res.json('success');
            }
        })
    }
    else{
        res.json("err")
    }
})
//router.post('/add',function(req,res){
//    var kitty = new tbalarms({
//        title    : req.body.title,
//        content     : req.body.content,
//        keyword      : req.body.keyword,
//        createtime  : new Date()
//    });
//    kitty.save(function (err) {
//        if (err){
//            console.log('err');
//            res.json("1")
//        }
//        else
//            res.json("0")
//
//    });
//})


module.exports = router;
