const xss = require('xss');

const LinesService = {
  getAllLines(db, user_id) {
    return db.from('lines').select('*').where('user_id', user_id);
  },

  getLineById(db, id) {
    return db.from('lines').where('lines.id', id).first();
  },

  insertLine(db, newLine) {
    return db
      .insert(newLine)
      .into('lines')
      .returning('*')
      .then(([line]) => line)
      .then((line) => LinesService.getLineById(db, line.id));
  },

  deleteLine(db, id) {
    return db('lines')
      .where({'id': id})
      .delete()
  },

  serializeLine(line) {
    return {
      id: line.id,
      line_name: xss(line.line_name),
      description: xss(line.description),
      date_created: new Date(line.date_created)
    };
  }
};

module.exports = LinesService;
