const express = require('express');   // to import express library
const app = express();               // to create express app which will be main server 
const path = require('path');        // to import path module for file handling
const port = 8000;
const { v4: uuidv4 } = require('uuid');   // to import uuid library for generating unique ids for posts
const methodOverride = require('method-override');   // to import method-override library to use HTTP verbs like PATCH and DELETE in HTML forms

// Middleware to read from data sent from HTML form
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));   // to use method-override library with query parameter _method to override HTTP methods in forms

app.set('view engine', 'ejs');      // to set ejs as template / view engine
app.set('views', path.join(__dirname, 'views'));      // tells express where ejs files are stored

app.use(express.static(path.join(__dirname, 'public')));   // to serve static files like css, js, images from public folder

let posts = [
    {
        id: uuidv4(),     // generates unique id for each post
        username: "adi",
        content: "This is my first post on Quora!"
    },
    {
        id: uuidv4(),
        username: "john",
        content: "Hello everyone, excited to be here!"
    },
    {
        id: uuidv4(),
        username: "sara",
        content: "Looking forward to sharing my thoughts on Quora!"
    },

];

// Api 1: to show all posts on home page
app.get("/posts", (req, res) => {        // route for GET request (home page)
    res.render("index", { posts });         // we are passing posts array to index.ejs file to render posts on home page
});

// Api 2a: to create new form for creating new post
app.get("/posts/new", (req, res) => {
    res.render("new");        // renders new.ejs file which contains form to create new post
});
// Api 2b: to handle form submission and create new post
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();    // generates unique id for new post
    posts.push({ id, username, content });
    res.redirect("/posts");   // redirecting to home page after submitting the post
})
// Api 3: to show single post 
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    let post = posts.find((p) => id === p.id);    // to find post using id
    res.render("show.ejs", { post });   // redirecting to home page after submitting the post
})
// Api 4: to Update a post using PATCH 
app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;   // updating content of the post
    console.log(post);
    res.redirect("/posts");   // redirecting to home page after updating the post
})
// to update post using method-override library to use PATCH method in HTML form
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });   // renders edit.ejs file which contains form to edit the post
})
// Api 5: to delete a post using DELETE method
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
})

app.listen(port, () => {            // starts server and listens on specified port
    console.log(`listening to port : ${port}`);
});