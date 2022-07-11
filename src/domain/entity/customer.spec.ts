import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should throw an error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John")
        }).toThrowError("Id is required");
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            let customer = new Customer("01", "")
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        let customer = new Customer("01", "joão")
        customer.changeName("Maria")
        expect(customer.name).toBe("Maria");
    });

    it("should activate customer", () => {
        let customer = new Customer("01", "Customer 1")
        const address = new Address('Stret One', 123, "12123123", "São Paulo")
        customer.changeAddress(address)
        customer.activate()
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        let customer = new Customer("01", "Customer 1")

        customer.deactivate()
        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when error is undefined when you activate a customer", () => {
        let customer = new Customer("01", "Customer 1");
        expect(
            () => customer.activate()
        ).toThrowError("Address is mandatory to activate a customer");
    });

    it("should add reward points", () => {
        const customer = new Customer("01", "Customer 01");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});