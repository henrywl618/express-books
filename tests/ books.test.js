process.env.NODE_ENV = "test";
const db = require("../db");
const Books = require("../models/book");
const request = require("supertest");
const app = require("../app");

describe("Tests books routes", ()=>{
    beforeEach(async ()=>{
        await db.query("DELETE FROM books");
        let book = await Books.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          });
    });

    describe("GET /books", ()=>{
        test("can get all books", async ()=>{
            const response = await request(app).get("/books");
            expect(response.body).toEqual({books:[{
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              }]})
        });
    });

    describe("GET /books/:isbn", ()=>{
        test("can get one book", async()=>{
            const response = await request(app).get("/books/0691161518");
            expect(response.body).toEqual({book: {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              }})
        });
    });

    describe("POST /books", ()=>{
        test("can add a new book", async()=>{
            const response = await request(app)
                                    .post("/books")
                                    .send({
                                        "isbn": "testisbn",
                                        "amazon_url": "http://a.co/eobPtX2",
                                        "author": "testeauthor",
                                        "language": "japanese",
                                        "pages": 999,
                                        "publisher": "Princeton University Press",
                                        "title": "Test Title",
                                        "year": 9999
                                    });
            expect(response.body).toEqual({book: {
                "isbn": "testisbn",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "testeauthor",
                "language": "japanese",
                "pages": 999,
                "publisher": "Princeton University Press",
                "title": "Test Title",
                "year": 9999
            }})
        });
        test("will throw an error with invalid data", async()=>{
            const response = await request(app)
                                    .post("/books")
                                    .send({
                                        "isbn": "testisbn",
                                        "amazon_url": "http://a.co/eobPtX2",
                                        "author": "testeauthor",
                                        "language": "japanese",
                                        "pages": "fsdfds",
                                        "publisher": "Princeton University Press",
                                        "title": "Test Title",
                                        "year": 9999
                                    });
            expect(response.body.message).toEqual(expect.any(Array));
        });
    });


    describe("PUT /books/:isbn", ()=>{
        test("can add a new book", async()=>{
            const response = await request(app)
                                    .put("/books/0691161518")
                                    .send({
                                        "isbn": "0691161518",
                                        "amazon_url": "http://a.co/eobPtX2",
                                        "author": "testeauthor",
                                        "language": "japanese",
                                        "pages": 1005,
                                        "publisher": "Princeton University Press",
                                        "title": "Test Title",
                                        "year": 9999
                                    });
            expect(response.body).toEqual({book: {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "testeauthor",
                "language": "japanese",
                "pages": 1005,
                "publisher": "Princeton University Press",
                "title": "Test Title",
                "year": 9999
            }})
        });
        test("will throw an error with invalid data", async()=>{
            const response = await request(app)
                                    .put("/books/0691161518")
                                    .send({
                                        "isbn": "testisbn",
                                        "amazon_url": "http://a.co/eobPtX2",
                                        "author": "testeauthor",
                                        "language": "japanese",
                                        "pages": "fsdfds",
                                        "publisher": "Princeton University Press",
                                        "title": "Test Title",
                                        "year": 9999
                                    });
            expect(response.body.message).toEqual(expect.any(Array));
        });
    });


    afterAll(async ()=>{
        await db.end();
    });
});