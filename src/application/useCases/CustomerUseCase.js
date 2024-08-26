const Customer = require("../../domain/entities/Customer");

class CustomerUseCase {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async getCustomer(req, res) {
    try {
      const customer = await this.customerRepository.getCustomer(req.params.customerId);
      res.json(customer);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createCustomer(req, res) {
    const { customerId, name, email, credit } = req.body;

    if (typeof customerId !== "string" || typeof name !== "string" || typeof email !== "string" || typeof credit !== "number") {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const customer = new Customer(customerId, name, email, credit);
      await this.customerRepository.createCustomer(customer);
      res.status(201).json(customer);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not create customer" });
    }
  }

  async updateCustomer(req, res) {
    const { customerId, name, email, credit } = req.body;

    if (typeof customerId !== "string" || typeof name !== "string" || typeof email !== "string" || typeof credit !== "number") {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const customer = new Customer(customerId, name, email, credit);
      await this.customerRepository.updateCustomer(customer);
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Could not update customer" });
    }
  }

  async deleteCustomer(req, res) {
    try {
      await this.customerRepository.deleteCustomer(req.params.customerId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Could not delete customer" });
    }
  }

  async listCustomers(req, res) {
    try {
      const customers = await this.customerRepository.listCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Could not list customers" });
    }
  }
}

module.exports = CustomerUseCase;
