import Customer from "../entity/customer";
import OrderItem from "../entity/ordem_item";
import Order from "../entity/order";
import { OrderService } from "./order.service";

describe("Order service unit tests", () => {

    it("should place an order", () => {
        const customer = new Customer("c1", "Customer 1");
        const orderItem1 = new OrderItem("i1", "p1", "Item 1", 500, 1)
        const orderItem2 = new OrderItem("i2", "p2", "Item 2", 200, 5)

        const order = OrderService.placeOrder(customer, [orderItem1, orderItem2])
        
        expect(customer.rewardPoints).toBe(150);
        expect(order.total()).toBe(1500);

    })

    it("should get total of all orders", () => {
        const orderItem1 = new OrderItem("i1", "p1", "Item 1", 100, 1)
        const orderItem2 = new OrderItem("i2", "p2", "Item 2", 200, 5)
        const orderItem3 = new OrderItem("i3", "p3", "Item 3", 300, 3)
        
        const order1 = new Order("o1", "c1", [orderItem1])
        const order2 = new Order("o2", "c2", [orderItem2, orderItem3])

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(2000);
    });

})