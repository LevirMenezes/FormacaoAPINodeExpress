import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/teste");


let db = mongoose.connection;

export default db;
