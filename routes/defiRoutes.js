'use strict';

module.exports = function(app) {
  var todoList = require('../controllers/Controllers');

  // todoList Routes
  //app.route('/tasks')
  //  .get(todoList.get_fx_rate)
  //  .post(todoList.create_a_task);


  app.route('/tasks')
    .get(todoList.list_Eth_wallets)
    //.put(todoList.update_a_task)
    //.delete(todoList.delete_a_task);
};
