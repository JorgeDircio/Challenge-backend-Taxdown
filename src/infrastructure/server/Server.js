const express = require("express");
const serverless = require("serverless-http");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const CustomerRepository = require("../../domain/repositories/CustomerRepository");
const CustomerRepositoryDynamoDB = require("../repository/CustomerRepositoryDynamoDB");
const CustomerUseCase = require("../../application/useCases/CustomerUseCase");

class Server {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  configureMiddleware() {
    this.app.use(express.json());
  }

  configureRoutes() {
    const TABLE_NAME = process.env.CUSTOMERS_TABLE;
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const customerRepositoryDynamo = new CustomerRepositoryDynamoDB(docClient, TABLE_NAME);
    const customerRepository = new CustomerRepository(customerRepositoryDynamo);
    const customerUseCase = new CustomerUseCase(customerRepository);

    this.app.get("/customers/:customerId", (req, res) => customerUseCase.getCustomer(req, res));
    this.app.post("/customers", (req, res) => customerUseCase.createCustomer(req, res));
    this.app.patch("/customers", (req, res) => customerUseCase.updateCustomer(req, res));
    this.app.delete("/customers/:customerId", (req, res) => customerUseCase.deleteCustomer(req, res));
    this.app.get("/customers", (req, res) => customerUseCase.listCustomers(req, res));
  }

  configureErrorHandling() {
    this.app.use((req, res) => {
      res.status(404).json({ error: "Not Found" });
    });
  }

  getHandler() {
    return serverless(this.app);
  }
}

module.exports = Server;
