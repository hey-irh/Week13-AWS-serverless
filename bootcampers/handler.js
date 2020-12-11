"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2019.11.21" });
const { v4: uuidv4 } = require("uuid");

const bootcampersTable = process.env.TABLE;

function response(statusCode, message) {
  return {
    statusCode: statusCode,

    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT, DELETE",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  };
}

module.exports.getAllItems = (event, context, callback) => {
  return db
    .scan({
      TableName: bootcampersTable,
    })
    .promise()
    .then((res) => callback(null, response(200, res.Items)))

    .catch((err) => callback(null, response(err.statusCode, err)));
};

module.exports.getItemById = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id,
    },
    TableName: bootcampersTable,
  };

  return db
    .get(params)
    .promise()
    .then((res) => {
      if (res.Item) callback(null, response(200, res.Item));
      else
        callback(
          null,
          response(404, { error: "No item with that name found" })
        );
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

module.exports.addItem = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const item = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    name: reqBody.name,
    desiredRole: reqBody.desiredRole,
    industry: reqBody.idustry,
  };

  return db
    .put({
      TableName: bootcampersTable,
      Item: item,
    })
    .promise()
    .then(() => {
      callback(null, response(200, item));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

module.exports.updateItem = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);

  const item = {
    id: id,
    createdAt: new Date().toISOString(),
    name: reqBody.name,
    desiredRole: reqBody.desiredRole,
    industry: reqBody.idustry,
  };

  return db
    .put({
      TableName: bootcampersTable,
      Item: item,
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

module.exports.deleteItem = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id,
    },
    TableName: bootcampersTable,
  };

  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: `${id} deleted successfully` }))
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};
