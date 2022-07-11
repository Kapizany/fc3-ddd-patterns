import OrderItem from "./ordem_item";
import Order from "./order";


describe("Order unit tests", () => {
    it("should throw an error when id is empty", () => {
        expect(
            () => {
                let order = new Order("", "123", [])
            }
        ).toThrowError("Id is required");
    })

    it("should throw an error when customerId is empty", () => {
        expect(
            () => {
                let order = new Order("123", "", [])
            }
        ).toThrowError("Customer id is required");
    })

    it("should throw an error when no item was provided", () => {
        expect(
            () => {
                let order = new Order("123", "123", [])
            }
        ).toThrowError("At least one item is required");
    })

    it("should calculate total", () => {
        const item1 = new OrderItem("1", "p1", "Item 1", 100.0, 2);
        let order1 = new Order("1", "Order 1", [item1]);
        expect(order1.total()).toBe(200);

        const item2 = new OrderItem("2", "p2", "Item 2", 99.9, 10);
        let order2 = new Order("2", "Order 2", [item1, item2]);
        expect(order2.total()).toBe(1199.0);
    })

    it("should throw errot if the item quantity is less or equal to zero", () => {
        expect(() => {
            const item1 = new OrderItem("1", "p1", "Item 1", 100.0, -1);
            const order = new Order("1", "Order 1", [item1]);

        }).toThrowError("Item quantity must be greater than 0");

    }) 
});