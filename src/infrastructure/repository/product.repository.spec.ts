import { Sequelize } from "sequelize-typescript"
import { Product } from "../../domain/entity/product";
import { ProductModel } from "../db/sequelize/model/product.model";
import { ProductRepository } from "./product.repository";

describe("Product Repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1","Product 1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "p1"}});

        expect(productModel.toJSON()).toStrictEqual({
            id: "p1",
            name: "Product 1",
            price: 10,
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1","Product 1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "p1"}});

        expect(productModel.toJSON()).toStrictEqual({
            id: "p1",
            name: "Product 1",
            price: 10,
        });

        product.changeName("Product 2");
        product.changePrice(20);

        await productRepository.update(product)
        const productModel2 = await ProductModel.findOne({ where: { id: "p1"}});

        expect(productModel2.toJSON()).toStrictEqual({
            id: "p1",
            name: "Product 2",
            price: 20,
        });

    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1","Product 1", 10);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "p1"}});
        const foundProduct = await productRepository.find("p1")

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
        });
    });
    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("p1","Product 1", 10);

        await productRepository.create(product);

        const product2 = new Product("p2","Product 2", 20);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll()
        const products = [product, product2];

        expect(products).toEqual(foundProducts)

    });
})