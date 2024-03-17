import { Model } from 'mongoose';

export async function firstOrCreate<T>(
  model: Model<T>,
  query: object,
  createData: object,
): Promise<T> {
  let document = await model.findOne(query);
  if (!document) {
    document = new model(createData);
    await document.save();
  }
  return document;
}
