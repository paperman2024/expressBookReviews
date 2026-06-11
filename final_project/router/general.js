const express = require('express');
const axios = require('axios');
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
public_users.get('/', async (req, res) => {
    try {
        const output = Object.values(books)
            .map(book => JSON.stringify(book))
            .join("\n");
        return res.status(200).send(output);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const book = books[req.params.isbn];
        if (!book) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json(book);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

public_users.get('/author/:author', async (req, res) => {
    try {
        const filteredBooks = Object.values(books)
            .filter(book => book.author.includes(req.params.author));
        return res.status(200).json(filteredBooks);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

public_users.get('/title/:title', async (req, res) => {
    try {
        const filteredBooks = Object.values(books)
            .filter(book => book.title.includes(req.params.title));
        return res.status(200).json(filteredBooks);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
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
