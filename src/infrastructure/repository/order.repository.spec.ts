import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import OrderItem from "../../domain/entity/ordem_item";
import Order from "../../domain/entity/order";
import { Product } from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import { ProductModel } from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import { ProductRepository } from "./product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("a1", 123, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      5
    )
    const order = new Order(
      "o1",
      customer.id,
      [orderItem]
    );

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {id : order.id}, 
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customer_id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          product_id: orderItem.product_id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
        }
      ]
    })
  });

  it("should find an order by id", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("a1", 123, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      5
    )
    const order = new Order(
      "o1",
      customer.id,
      [orderItem]
    );
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const retrievedOrder = await orderRepository.find(order.id)
    expect(order).toEqual(retrievedOrder);
  });

  it("should throw an error when order Id was not found", async () => {
    const orderRepository = new OrderRepository();
    expect(async () => {
      await orderRepository.find("456ABC");
    }).rejects.toThrow("Order not found!");
  });

  it("should return all orders", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("a1", 123, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    const product2 = new Product("p2", "Product 2", 200);

    await productRepository.create(product);
    await productRepository.create(product2);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      5
    )
    const orderItem2 = new OrderItem(
      "oi2",
      product2.id,
      product2.name,
      product2.price,
      10
    )
    const order = new Order(
      "o1",
      customer.id,
      [orderItem]
    );
    const order2 = new Order(
      "o2",
      customer.id,
      [orderItem2]
    );
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order2);

    const allOrders = await orderRepository.findAll();
    const orders = [order, order2];
    expect(orders).toEqual(allOrders)
  });

  it("should return a empty array when no order was not found", async () => {
    const orderRepository = new OrderRepository();
    const orderList = await orderRepository.findAll()
    expect(orderList).toEqual([]);
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("a1", 123, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    const product2 = new Product("p2", "Product 2", 200);
    await productRepository.create(product);
    await productRepository.create(product2);

    const orderItem = new OrderItem(
      "oi1",
      product.id,
      product.name,
      product.price,
      5
    )
    const orderItem2 = new OrderItem(
      "oi2",
      product2.id,
      product2.name,
      product2.price,
      10
    )
    const order = new Order(
      "o1",
      customer.id,
      [orderItem]
    );
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    order.items = [ orderItem, orderItem2] 
    await orderRepository.update(order);

    const retrievedOrder = await orderRepository.find(order.id)
    expect(retrievedOrder).toEqual(order)
  });

});