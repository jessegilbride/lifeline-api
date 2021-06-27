const xss = require('xss');

const ItemsService = {
  getAllItemsForLine(db, line_id) {
    return db.from('line_entries').select('*').where({ line_id });
  },
  getItemById(db, id) {
    return db.from('line_entries').where({ id }).first();
  },
  insertItem(db, newItem) {
    return db
      .insert(newItem)
      .into('line_entries')
      .returning('*')
      .then(([item]) => item)
      .then((item) => ItemsService.getItemById(db, item.id));
  },
  deleteItem(db, id) {
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
      entry_date: item.entry_date
    };
  }
};

module.exports = ItemsService;
