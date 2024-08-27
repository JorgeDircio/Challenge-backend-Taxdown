const { PutCommand, UpdateCommand, GetCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");


class CustomerRepositoryDynamoDB {
  constructor(docClient, tableName) {
    this.docClient = docClient;
    this.tableName = tableName;
  }

  async findById(customerId) {
    const params = {
      TableName: this.tableName,
      Key: { customerId },
    };
    const command = new GetCommand(params);
    const { Item } = await this.docClient.send(command);
    return Item ? { customerId: Item.customerId, name: Item.name, email: Item.email, credit: Item.credit } : null;
  }

  async save(customer) {
    const params = {
      TableName: this.tableName,
      Item: customer,
    };
    const command = new PutCommand(params);
    await this.docClient.send(command);
  }

  async update(customer) {
    const params = {
      TableName: this.tableName,
      Key: { customerId: customer.customerId },
      UpdateExpression: "set #name = :name, #email = :email, #credit = :credit",
      ExpressionAttributeNames: {
        "#name": "name",
        "#email": "email",
        "#credit": "credit",
      },
      ExpressionAttributeValues: {
        ":name": customer.name,
        ":email": customer.email,
        ":credit": customer.credit,
      },
    };
    const command = new UpdateCommand(params);
    await this.docClient.send(command);
  }

  async delete(customerId) {
    console.log('customer ID ', customerId);
    console.log('this.tableName', this.tableName);
    const params = {
      TableName: this.tableName,
      Key: { customerId },
    };
    const command = new DeleteCommand(params);
    await this.docClient.send(command);
  }

  async list() {
    const params = {
      TableName: this.tableName,
    };
    const command = new ScanCommand(params);
    const { Items } = await this.docClient.send(command);
    return Items.map(item => ({
      customerId: item.customerId,
      name: item.name,
      email: item.email,
      credit: item.credit,
    }));
  }
}

module.exports = CustomerRepositoryDynamoDB;
