const express = require('express');
const ItemsService = require('./items-service');
const { requireAuth } = require('../middleware/jwt-auth');

const itemsRouter = express.Router();
const jsonBodyParser = express.json();

itemsRouter
  .route('/forLine/:line_id')
  .get((req, res, next) => {
    ItemsService.getAllItemsForLine(req.app.get('db'), req.params.line_id)
      .then((items) => {
        return res.json(items.map(ItemsService.serializeItem)); // make JSON to send back
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    // id, line_id, title, content, entry_date
    const { line_id, title, content, entry_date } = req.body;
    const newItem = { line_id, title, content, entry_date };

    // newItem.user_id = req.user.id; // set user_id in newLine object

    ItemsService.insertItem(req.app.get('db'), newItem)
      /* .then(res => {
        console.log('response from insertItem() ... ', res);
        return res;
      }) */
      .then((item) => ItemsService.serializeItem(item))
      .then((item) => {
        // res.status(201).json(ItemsService.serializeItem(item));
        res.status(201).json(item);
      })
      .catch(next);
  });

itemsRouter
  .route('/:item_id')
  // .all(requireAuth) // remove authentication for MVP
  .all(checkItemExistsAndGetIt)
  .get((req, res) => {
    // console.log('req ... ', req);
    // console.log('res ... ', res);
    res.json(ItemsService.serializeItem(res.item));
  })
  /* .delete((req, res, next) => {
    ItemsService.deleteItem(req.app.get('db'), req.params.item_id)
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  }); */

async function checkItemExistsAndGetIt(req, res, next) {
  try {
    const item = await ItemsService.getItemById(req.app.get('db'), req.params.item_id);

    if (!item) {
      return res.status(404).json({
        error: `Item does not exist.` // needs to match front end conditional to be seen
      });
    }
    
    // console.log('getItemById(db, item_id) ... ', item);

    res.item = item;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = itemsRouter;
