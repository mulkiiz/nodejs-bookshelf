const { addBookHandler, deleteBookByIdHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler } = require('./handler');
  
  const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: addBookHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler,
      },
    {
      method: 'GET',
      path: '/books',
      handler: getAllBooksHandler,
    },
    {
      method: 'GET',
      path: '/books/{bookId}',
      handler: getBookByIdHandler,
    },
    {
      method: 'PUT',
      path: '/books/{bookId}',
      handler: editBookByIdHandler,
    },
    {
      method: '*',
      path: '/{any*}',
      handler: () => 'Halaman tidak ditemukan',
    },
  ];
  
  module.exports = routes;