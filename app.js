import express from 'express'
import routes from './src/v1/routes/index.js'
import connectDB from './db/connectDB.js'
import { middleware, errorMiddlewareHandler } from './middleware/index.js';

var app = express();

connectDB()

middleware(app)

app.use('/api/v1/', routes);

// error handler
errorMiddlewareHandler(app)

export default app
