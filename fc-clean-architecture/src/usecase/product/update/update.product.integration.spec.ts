import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import { Sequelize } from "sequelize-typescript";

const product = ProductFactory.create(
  "a","John",5
);

const input = {
  id: product.id,
  name: "John Updated",
  price: 5,
};



describe("Unit test for product update use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
    const productnew = new Product(product.id,product.name,product.price);
    await productRepository.create(  productnew);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
