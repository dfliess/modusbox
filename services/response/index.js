module.exports = {
  success: (res, status) => (entity) => {
    if (entity) {
      res.status(status || 200).json(entity)
    }
    return null
  },
  notFound: (res) => (entity) => {
    if (entity) {
      return entity
    }
    res.status(404).end()
    return Promise.reject()
  }
}
