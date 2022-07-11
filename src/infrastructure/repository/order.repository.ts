
import OrderItem from "../../domain/entity/ordem_item";
import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order.repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    try{
      await OrderModel.create({
        id: entity.id,
        customer_id: entity.customer_id,
        total: entity.total(),
        items: entity.items.map( item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      },
      {
        include: [{model: OrderItemModel}],
      }
      );
    }
    catch (err) {
      throw new Error("Order could not be created: " + err);
    }
  }

  async update(entity: Order): Promise<void> {
    try{
      await entity.items.forEach( async orderItem => await this.updateOrderItem(orderItem, entity.id))
      await OrderModel.update({
        customer_id: entity.customer_id,
        total: entity.total(),
      },
      {
        where:{
          id: entity.id,
        }
      }
      );
    }
    catch (err) {
      throw new Error("Order could not be updated: " + err);
    }
  }

  async find(id: string): Promise<Order> {
    try{
      const orderModelSelected = await OrderModel.findOne({
        where: {id: id},
        include: [{ model: OrderItemModel ,  as: 'items' }],
        rejectOnEmpty: true,
      });
      return this.parseOrder(orderModelSelected)
    } catch (err) {
      throw new Error("Order not found!");
    }
  }

  async findAll(): Promise<Order[]> {
    const orderModelList = await OrderModel.findAll({include: [{ model: OrderItemModel ,  as: 'items' }],});
    return orderModelList? orderModelList.map(orderModel => this.parseOrder(orderModel)) : []
  }

  private async updateOrderItem(entity: OrderItem, order_id: string): Promise<void>{
    try{
      const order_item = await OrderItemModel.findOne({
        where: {id: entity.id},
        rejectOnEmpty: true,
      });
      order_item.update({
        product_id: entity.product_id,
        order_id: order_id,
        name: entity.name,
        price: entity.price,
        quantity: entity.quantity,
      });
      await order_item.save();
    } catch (err) {
      OrderItemModel.create ({
        id: entity.id,
        name: entity.name,
        price: entity.price,
        product_id: entity.product_id,
        quantity: entity.quantity,
        order_id : order_id
      })
    }
    
  }

  private parseOrder(order: OrderModel): Order{
    return new Order(
      order.id,
      order.customer_id,
      this.parseOrderItems(order.items),
    )
  }
  private parseOrderItems(order_items: OrderItemModel[]): OrderItem[]{
    return order_items.map(order_item => new OrderItem(
      order_item.id,
      order_item.product_id,
      order_item.name,
      Math.round(order_item.price/order_item.quantity),
      order_item.quantity
    ))
  }
}