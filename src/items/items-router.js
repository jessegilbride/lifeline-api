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
    const { line_name, description } = req.body;
    const newLine = { line_name, description };

    newLine.user_id = req.user.id; // set user_id in newLine object

    ItemsService.insertLine(req.app.get('db'), newLine)
      .then((line) => {
        res.status(201).json(ItemsService.serializeLine(line));
      })
      .catch(next);
  });

itemsRouter
  .route('/:item_id')
  // .all(requireAuth) // remove authentication for MVP
  .all(checkItemExistsAndGetIt)
  .get((req, res) => {
    res.json(ItemsService.serializeLine(res.line));
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
    
    console.log(item);

    res.item = item;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = itemsRouter;
