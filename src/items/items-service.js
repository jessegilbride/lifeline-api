const xss = require('xss');

const ItemsService = {
  getAllItemsForLine(db, line_id) {
    return db.from('line_entries').select('*').where({ line_id });
  },
  getItemById(db, item_id) {
    return ItemsService.getAllItemsForLine(db).where({ item_id }).first();
  },
  insertLine(db, newLine) {
    return db
      .insert(newLine)
      .into('lines')
      .returning('*')
      .then(([line]) => line)
      .then((line) => LinesService.getById(db, line.id));
  },
  deleteLine(db, id) {
    return db('lines')
      .where({'id': id})
      .delete()
  },
  serializeItem(item) {
    // id, line_id, title, content, entry_date
    return {
      id: item.id,
      line_id: item.line_id,
      title: xss(item.title),
      content: xss(item.content),
      entry_date: new Date(item.entry_date)
    };
  }
};

module.exports = ItemsService;
