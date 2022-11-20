const restaurantList = require('../../restaurant.json').results
// 載入model
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

require('dotenv').config()

db.once('open', () => {
  console.log('running restaurantSeeder script...')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close()
    })
    .catch(err => console.log(err))
})
