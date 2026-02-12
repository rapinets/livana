export default function setActiveMenu(req, res, next) {

  res.locals.isActive = (route) => {
    if (route === '/') {
      return req.path === '/' ? 'active' : ''
    }
    return req.path.startsWith(route) ? 'active' : ''
  }


  next()
}
