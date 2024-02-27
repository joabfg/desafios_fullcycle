import ProductFactory from "../../../domain/product/factory/product.factory";
import { Sequelize } from "sequelize-typescript";

import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
const product1 = ProductFactory.create(
  "a","prod 1",5
);

const product2 = ProductFactory.create(
  "a","prod 2",5
);

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
describe("Unit test for listing product use case", () => {
  it("should list a product", async () => {
    const repository =  new ProductRepository();
    const useCase = new ListProductUseCase(repository);
    const newproduct1 = new Product(product1.id,product1.name,product1.price)
    const newproduct2 = new Product(product2.id,product2.name,product2.price)
    await repository.create(  newproduct1);
    await repository.create(  newproduct2);


    const output = await useCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe(product1.name);
    expect(output.products[0].price).toBe(product1.price);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe(product2.name);
    expect(output.products[1].price).toBe(product2.price);
  });
});
