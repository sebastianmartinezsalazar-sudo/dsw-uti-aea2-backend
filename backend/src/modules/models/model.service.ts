import { Models } from "./model.model.ts";

export class ModelService {

  static async findAll() {
    return Models.findAll({
      order: [["id", "ASC"]],
    });
  }


  static async findById(id: number) {
    return Models.findByPk(id);
  }


  static async create(data: {
    name: string;
  }) {
    return Models.create(data);
  }


  static async update(
    model: Models,
    data: {
      name?: string;
    }
  ) {
    return model.update(data);
  }


  static async delete(model: Models) {
    await model.destroy();
  }
}