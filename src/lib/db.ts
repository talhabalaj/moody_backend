import mongoose from 'mongoose';
import { mongoUrl } from '../config';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Database connection error:'));

db.once('open', () => {
    console.log("Connection to database succesfull");
});

export { db };