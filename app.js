var bodyParser = require('body-parser');

// HTML FORMS only support a GET or POST request
// Therefore, you will have to put up with the method-override
// You have to fake a PUT / DELETE request
var methodOverride = require('method-override');

var mongoose = require('mongoose');

var express = require('express');

var app = express();


// APP CONFIG
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
   extended: true
}));

app.use(methodOverride('_method'));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {
      type: Date,
      default: Date.now
   }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//    title: "Test Blog",
//    image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=660&q=80",
//    body: "Hello this is a blog post!"
// })



// RESTFUL ROUTES

// Customary to be redirected to the index page
app.get('/', function (req, res) {
   // console.log(req.params);
   res.redirect('/blogs');
});

app.get('/blogs', function (req, res) {
   Blog.find({}, function (err, blogs) {
      if (err) {
         console.log("ERROR");
      } else {
         res.render('index', {
            blogs: blogs
         });
      }
   });
});

// NEW ROUTE
app.get('/blogs/new', function (req, res) {
   res.render('new');
});

// CREATE ROUTE
app.post("/blogs", function (req, res) {
   Blog.create(req.body.blog, function (err, newBlog) {
      if (err) {
         res.render('new');
      } else {
         res.redirect('/blogs');
      }
   });
});

// SHOW ROUTE
app.get("/blogs/:id", function (req, res) {

   Blog.findById(req.params.id, function (err, foundBlog) {
      if (err) {
         res.redirect("/blogs");
      } else {
         res.render("show", {
            blog: foundBlog
         });
      }
   });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function (req, res) {
   Blog.findById(req.params.id, function (err, foundBlog) {
      if (err) {
         res.redirect('/blogs');
      } else {
         res.render('edit', {
            blog: foundBlog
         });
      }
   });
});

// UPDATE ROUTE
app.put('/blogs/:id', function (req, res) {
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlo) {
      if (err) {
         res.redirect('/blogs');
      } else {
         // this will redirect you to the show page at the specified id
         // now you can verify your edits were added to the database
         res.redirect('/blogs/' + req.params.id);
      }
   });
});


// DELETE ROUTE
app.delete('/blogs/:id', function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect('/blogs');
      } else {
         res.redirect('/blogs');
      }
   });
});

// console.log(req.params);

//Catch All.  When routes NOT specified above.
app.get('*', function (req, res) {
   res.send('Sorry page not found!  Try going to the home page');
});

app.listen(3000, function () {
   console.log('yelp server has started!');
});