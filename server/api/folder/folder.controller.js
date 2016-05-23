/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/folders              ->  index
 * POST    /api/folders              ->  create
 * GET     /api/folders/:id          ->  show
 * PUT     /api/folders/:id          ->  update
 * DELETE  /api/folders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import lz from 'lz-string';
import Folder from './folder.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Folders
export function index(req, res) {
  return Folder.find()
    .populate('folders')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Folder from the DB
export function show(req, res) {
  return Folder.findById(req.params.id)
    .populate('folders')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a path from the DB
export function path(req, res) {
  var path = lz.decompressFromBase64(req.params.id);
  path = JSON.parse(path);
  return Folder.find({'_id': { $in: path}})
    .populate('folders')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Folder in the DB
export function create(req, res) {
  return Folder.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Folder in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Folder.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Folder from the DB
export function destroy(req, res) {
  return Folder.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}