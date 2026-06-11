const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(isValid(username) && username && password) {
    users.push({
        "username": username,
        "password": password
    })
    return res.status(200).json({message: "User successfully registered!"})
  } else {
    return res.status(400).json({message: "Username is invalid or exists already"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const output = Object.values(books)
    .map(book => JSON.stringify(book))
    .join("\n");
  return res.status(200).send(output);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    if (!isbn) {
      return res.status(400).json({ message: "Enter isbn to check" });
    }
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    }
  
    return res.status(404).json({ message: "Book not found" });
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    if(!author) {
        return res.status(400).json({message: "Enter author to check"});
    }
    let filteredBooks = Object.values(books).filter((book) => book.author.includes(author))

    return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if(!title) {
        return res.status(400).json({message: "Enter title to check"});
    }
    let filteredBooks = Object.values(books).filter((book) => book.title.includes(title))

    return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn) {
    return res.status(400).json({message: "Enter valid isbn"})
  }
  const book = books[isbn];
  const reviews = book.reviews

    if(!book || reviews.length === 0) {
        return res.status(400).json({message: "No reviews found"});
    } else {
        return res.status(200).json(reviews)
    }
});

module.exports.general = public_users;
