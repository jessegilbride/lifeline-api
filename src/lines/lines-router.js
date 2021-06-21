const express = require('express');
const LinesService = require('./lines-service');
const { requireAuth } = require('../middleware/jwt-auth');

const linesRouter = express.Router();
const jsonBodyParser = express.json();

linesRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id
    LinesService.getAllLines(req.app.get('db'), user_id)
      .then((lines) => {
        return res.json(lines.map(LinesService.serializeLine));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { line_name, description } = req.body;
    const newLine = { line_name, description };

    newLine.user_id = req.user.id; // set user_id in newLine object

    LinesService.insertLine(req.app.get('db'), newLine)
      .then((line) => {
        res.status(201).json(LinesService.serializeLine(line));
      })
      .catch(next);
  });

linesRouter
  .route('/:line_id')
  // .all(requireAuth) // remove authentication for MVP ... to be reinstated on a different route (TBD)
  .all(checkLineExists)
  .get((req, res) => {
    res.json(LinesService.serializeLine(res.line));
  })
  /* .delete((req, res, next) => {
    LinesService.deleteLine(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  }); */

/* async/await syntax for promises */
async function checkLineExists(req, res, next) {
  try {
    const line = await LinesService.getLineById(req.app.get('db'), req.params.line_id);

    if (!line) {
      return res.status(404).json({
        error: `Line does not exist.` // needs to match front end conditional to be seen
      });
    }
    
    console.log(line);

    res.line = line;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = linesRouter;
