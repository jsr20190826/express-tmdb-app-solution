require('dotenv').config()
const express = require('express')
const axios = require('axios')
const path = require('path')
const logger = require('morgan')
const exphbs = require('express-handlebars')

// establishing the I/O port
const PORT = process.env.PORT || 3000
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views')) // specify that templates will live in the "views" directory
app.engine('.hbs', exphbs({extname: '.hbs'}))
app.set('view engine', '.hbs') // specify that we are using "handlebars" as our template engine

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => console.log(`App is up and running listening on port ${PORT}`))

// route handler for GET request to home ("/") route
app.get('/', (req, res, next) => {
  const colors = [
    { color: 'red'},
    { color: 'blue'},
    { color: 'purple'},
    { color: 'gold'}
  ]

  // "render" the template named "home" in our views folder
  res.render('home', {
    name: 'Kareem',
    colors: colors
  })
})

app.get('/about', (req, res, next) => {
  // "render" the template named "home" in our views folder
  res.render('about')
})

app.get('/contact-us', (req, res, next) => {
  // "render" the template named "home" in our views folder
  res.render('contact-us')
})

app.get('/popular-movies', async (req, res) => {
  const data = await tmdbApi('movie/popular')
  console.log(data.results)
  const movies = data.results

  res.render('movie-list', {
    movies: movies
  })
})

app.get('/movies/:id', async (req, res) => {
  console.log(req.params)
  const movieId = req.params.id

  const data = await tmdbApi(`movie/${movieId}`)
  console.log(data)

  res.render('movie-detail', {
    movie: data
  })
})

async function tmdbApi (pathParams) {
  try {
    const url = `https://api.themoviedb.org/3/${pathParams}`
    // popular movies: https://api.themoviedb.org/3/movie/popular
    // detail of single movie: https://api.themoviedb.org/3/movie/234234232

    const apiKey = process.env.TMDB_API_KEY

    const response = await axios.get(url, {
      params: {
        api_key: apiKey
      }
    })

    return response.data
  } catch (e) {
    console.log(e)
    throw new Error('API request to TMDb failed')
  }
}
