const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const db = require('./dbConfig');

db.connect(function(err) {            
  let sql = `TRUNCATE tb_book`;

  db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("empty table: tb_book");
  });
});

const init = async () => {

    const server = Hapi.server({
      port: 8181,
      host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });
 
    server.route(routes);

    await server.start();
    console.log(`Hapi Web Server berjalan pada ${server.info.uri}`);
};

init();