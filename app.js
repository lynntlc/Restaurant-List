const express = require('express')
const mongoose = require('mongoose')
const Restaurant = require('../restaurant')// 載入model

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI)

const port = 3000
// const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keywords = req.query.keyword
  const keyword = req.query.keyword.toLowerCase().trim()
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) ||
      restaurant.category.toLowerCase().includes(keyword)
  })

  if (!restaurants.length) {
    res.render('cannot_found', { restaurant: restaurantList, keywords })
  } else {
    res.render('index', { restaurants: restaurants, keyword: keyword })
  }
})

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`)
})