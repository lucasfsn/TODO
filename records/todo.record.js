const { pool } = require('../utils/db.js');
const { v4: uuid } = require('uuid');
const moment = require('moment');

class TodoRecord {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.createdAt = obj.createdAt;

    this._validate();
  }

  _validate() {
    if (this.title.trim().length < 5) {
      throw new Error('Todo title must be at least 5 characters.');
    }

    if (this.title.length > 150) {
      throw new Error('Todo title should be at most 150 characters.');
    }
  }

  async insert() {
    this.id = this.id ?? uuid();

    await pool.execute('INSERT INTO `todos` VALUES(:id, :title, :createdAt)', {
      id: this.id,
      title: this.title,
      createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });

    return this.id;
  }

  async delete() {
    if (!this.id) {
      throw new Error('No id exists.');
    }

    await pool.execute('DELETE FROM `todos` WHERE `id` = :id', {
      id: this.id,
    });
  }

  static async find(id) {
    const [results] = await pool.execute(
      'SELECT * FROM `todos` WHERE `id` = :id',
      {
        id: id,
      }
    );

    return results.length === 1 ? new TodoRecord(results[0]) : null;
  }

  static async findAll() {
    const [results] = await pool.execute(
      'SELECT * FROM `todos` ORDER BY `createdAt` ASC'
    );
    return results;
  }

  async update() {
    if (!this.id) {
      throw new Error('No id exists.');
    }

    this._validate();

    await pool.execute('UPDATE `todos` SET `title` = :title WHERE `id` = :id', {
      title: this.title,
      id: this.id,
    });
  }
}

module.exports = { TodoRecord };
