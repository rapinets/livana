import express from 'express'
import routes from './routes/index.js'
import connectDB from './db/connectDB.js'
import errorHandler from './middleware/errorHandler.js';
import middleware from './middleware/index.js';

var app = express();

connectDB()

middleware(app)

app.use('/', routes);

// error handler
errorHandler(app)

export default app
