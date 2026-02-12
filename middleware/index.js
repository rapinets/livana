import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import loggerConfig from '../config/logger.js'
import { fileURLToPath } from 'url'
import sessionConfig from '../config/session.js'
import passport from '../config/passport.js'
import setActiveMenu from './setActiveMenu.js'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const middleware = (app) => {
  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  app.use(loggerConfig);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../uploads')))

  app.use(sessionConfig)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(setActiveMenu)

}

export default middleware