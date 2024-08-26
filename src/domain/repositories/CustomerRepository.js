class CustomerRepository {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async getCustomer(customerId) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async createCustomer(customer) {
    await this.customerRepository.save(customer);
  }

  async updateCustomer(customer) {
    await this.customerRepository.update(customer);
  }

  async deleteCustomer(customerId) {
    await this.customerRepository.delete(customerId);
  }

  async listCustomers() {
    return await this.customerRepository.list();
  }
}

module.exports = CustomerRepository;
