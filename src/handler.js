const books = require('./books');
const db = require('./dbConfig');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {
    const id = nanoid(16);
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        console.log("Mohon isi nama buku");
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        console.log("readPage tidak boleh lebih besar dari pageCount");
        response.code(400);
        return response;
    }

    const newBook = { name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt };
    books.push(newBook);

    const isSuccess = books.filter((buku) => buku.id === id).length > 0;
    if (isSuccess) {
        const response = h
        .response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
            bookId: id,
            },
        })

        db.connect(function(err) {            
            let sql = `INSERT INTO tb_book () VALUES ('${id}', '${name}', '${year}', '${author}', '${summary}', '${publisher}', '${pageCount}', '${readPage}', '${finished}', '${reading}', '${insertedAt}', '${updatedAt}')`;
        
            db.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });

        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((note) => note.id === bookId);
  
    if (index !== -1) {
        books.splice(index, 1);
        
        db.connect(function(err) {
            let sql = `DELETE FROM tb_book where id='${bookId}'`;
        
            db.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record deleted");
            });
        });
  
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
        console.log("can't deleted, invalid id");
        response.code(404);
        return response;
};

const getAllBooksHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        data: {
          books: books.map((buku) => ({
            id: buku.id,
            name: buku.name,
            publisher: buku.publisher,
            author: buku.author,
          })),
        },
    })
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((n) => n.id === bookId)[0];

    if (book) {
        db.connect(function(err) {
            let sql = `SELECT * FROM tb_book where id='${bookId}'`;
        
            db.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        });

        const response = h.response({
            status: 'success',
            data: {
            book,
            },
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt };

    db.connect(function(err) {
        let sql = `UPDATE tb_book SET name='${name}', year='${year}', author='${author}' where id='${bookId}'`;
    
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record deleted");
        });
    });

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
    response.code(200);
    return response;
  }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    response.code(404);
    return response;
};

module.exports = { addBookHandler, deleteBookByIdHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler };