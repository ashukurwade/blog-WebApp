import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/tempDB");
const schema= new mongoose.Schema({
  _id:Number,
  title:String,
  content:String,
  author:String,
  date:Date,
})

const post=new mongoose.model("Post",schema);

const app = express();
const port = 4000;

// In-memory data store

 const post1= new post( {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  })

  const post2= new post({
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  })
  const post3= new post({
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  })
  let lastId = 3;
  // post.insertMany([post1,post2,post3]).then((obj)=>{
  //   console.log(obj);
  // }).catch((err)=>{
  //   console.log(err);
  // })


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//Write your code here//




app.get("/", async(req,res)=>{
  const allposts= await post.find();
  res.render("index.ejs",{posts:allposts})
});
//CHALLENGE 2: GET a specific post by id
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.post("/api/posts", async(req,res)=>{
  const result=new post({
    id:lastId+1,
    title:req.body.title,
    content:req.body.content,
    author:req.body.author,
    date:new Date(),
  })
  lastId=lastId+1;
  await result.save();
  res.redirect("/");

})

app.get("/edit/:id", async (req, res) => {
  const result= await post.findOne({_id:parseInt(req.params.id)})
   //console.log(result);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: result,
    });
});

app.post("/api/posts/:id", async(req,res)=>{
  const existingPost=await post.findOne({_id:parseInt(req.params.id)});
  post.updateOne({_id:parseInt(req.params.id)}, {title:req.body.title || existingPost.title, content:req.body.content || existingPost.content, author:req.body.author || existingPost.author, date:new Date()}).then(()=>{
  console.log("success");}).catch((err)=>{
    console.log(err);
  })
  res.redirect("/")
  
})

app.get("/api/posts/delete/:id", async(req,res)=>{
  post.deleteOne({_id:parseInt(req.params.id)}).then(()=>{
    console.log("Record Deleted");
  }).catch((err)=>{
    console.log(err);
  })
 
  res.redirect("/");
})

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });