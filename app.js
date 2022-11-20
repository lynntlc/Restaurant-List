const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Restaurant = require('./models/Restaurant')// 載入model

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI)

const port = 3000
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

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// 路由設定
// 瀏覽全部餐廳
app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// 新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

// 搜尋餐廳
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