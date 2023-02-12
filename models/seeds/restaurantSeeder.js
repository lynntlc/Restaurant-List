const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results
const SEED_USER = [{
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    index: [0, 1, 2]
  }, {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    index: [3, 4, 5]
  }]

db.once('open', () => {
  Promise.all(
    SEED_USER.map(user => {
    const { name, email, password, index } = user
    return User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    })
      .then(user => {
        const userId = user._id
        const restaurants = index.map(index => {
          return { ...restaurantList[index], userId }
        })
        return Restaurant.create(restaurants)
      })
      .catch(err => console.log(err))
  })
  )
  .then(() => {
    console.log('done.')
    process.exit()
  })
})