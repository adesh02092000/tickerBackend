require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

// mongoose.connect(process.env.DB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

const StockSchema = new mongoose.Schema({
  name: String,
  price: [Number],
})

const Stock = mongoose.model('Stock', StockSchema)

const stocks = ['AAPL', 'GOOGL', 'FB', 'AMZN', 'MSFT']

app.get('/api/price/:name', async (req, res) => {
  const { name } = req.params
  let stock = await Stock.findOne({ name })

  if (stock) {
    stock.price.push(Math.random() * 1000)
    await stock.save()
  } else {
    stock = await Stock.create({
      name,
      price: [Math.random() * 1000],
    })
  }

  res.json({ name, price: stock.price.slice(-5) })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('listening for requests')
  })
})
