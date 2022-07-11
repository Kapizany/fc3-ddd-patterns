import { Product } from "./product";

describe("Product unit tests", () => {
    it("should throw an error when id is empty", () => {
        expect(
            () => {
                let product = new Product("", "Product 1", 100)
            }
        ).toThrowError("Id is required");
    })

    it("should throw an error when name is empty", () => {
        expect(
            () => {
                let product = new Product("p1", "", 100)
            }
        ).toThrowError("Name is required");
    })

    it("should throw an error when price is less than zero", () => {
        expect(
            () => {
                let product = new Product("p1", "Product 1", -100)
            }
        ).toThrowError("Price must be greater or equal to zero");
    })

    it("should change name", () => {
        const product = new Product("p1", "Product 1", 100)
        product.changeName("Product 2")
        expect(product.name).toBe("Product 2")
    })

    it("should change Price", () => {
        const product = new Product("p1", "Product 1", 100)
        product.changePrice(200.99)
        expect(product.price).toBe(200.99)
    })

});