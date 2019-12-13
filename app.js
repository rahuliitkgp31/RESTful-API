const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

/////////////////////////////////Requests Targetting all Article /////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(err){
      res.send(err);
    }
    else{
      res.send(foundArticles);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Successfully added new Article");
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});

/////////////////////////////////Requests Targetting A Specific Article /////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne(
    {title:req.params.articleTitle},
    function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else if(err){
      res.send(err);
    }
    else{
      res.send("No article matching that title was found");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }
      else{
        res.send(err);
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted correponding article");
      }
      else{
        res.send(err);
      }
    }
  );
});

app.listen(3000, function(){
  console.log("server has started on port 3000");
});
