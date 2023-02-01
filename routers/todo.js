const express = require('express');
const { TodoRecord } = require('../records/todo.record.js');

const todoRouter = express.Router();

todoRouter
  .get('/', async (req, res) => {
    res.render('todo/list-all', {
      todos: await TodoRecord.findAll(),
    });
  })
  .post('/', async (req, res) => {
    const todoItem = new TodoRecord({
      title: req.body.title,
    });
    const newId = await todoItem.insert();

    console.log(`New Todo has been added: ${newId}`);

    res.status(201).render('todo/added', {
      title: req.body.title,
    });
  })
  .get('/form/add', (req, res) => {
    res.render('todo/form/add');
  })
  .delete('/:id', async (req, res) => {
    const todoId = req.params.id;

    if (!todoId) {
      throw new Error('There is no Todo with such id!');
    }

    const foundTodo = await TodoRecord.find(todoId);

    foundTodo.delete();

    res.render('todo/deleted');
  });

module.exports = {
  todoRouter,
};
