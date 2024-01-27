import mongoose from 'mongoose';

export default async function initDb() {
  const db = await mongoose.connect('mongodb://localhost:27017/mestodb');
  return db;
}
