const express = require('express')
const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const jsonParser = express.json()

articlesRouter
  .route('/')
  // Get returns all articles
  .get((req, res, next) => {
    ArticlesService.getAllArticles(
      req.app.get('db')
    )
      .then(articles => {
        res.json(articles.map(article => ({
          id: article.id,
          title: article.title,
          style: article.style,
          content: article.content,
          date_published: new Date(article.date_published)
        })))
      })
      .catch(next)
  })
  // Posts an article. Checks if article has all required properties
  .post(jsonParser, (req, res, next) => {
    const { title, content, style } = req.body
    const newArticle = { title, content, style }
  
    // if(!title) {
    //   return res.status(400).json({
    //     error: { message: `Missing 'title' in request body`}
    //   })
    // }

    // if(!content) {
    //   return res.status(400).json({
    //     error: { message: `Missing 'content' in request body`}
    //   })
    // }

    // Refactored version of above's !title & !content
    for(const [key, value] of Object.entries(newArticle)) {
      // take note of == 
      if(value == null) {
        return res.status(400).json({
          error: {message: `Missing '${key}' in request body`}
        })
      }
    }
    

    ArticlesService.insertArticle(
      req.app.get('db'),
      newArticle
    )
      .then(article => {
        res
          .status(201)
          .location(`/articles/${article.id}`)
          .json(article)
      })
      .catch(next)
  })

articlesRouter
  // finds a specific article searched for 
  .route('/:article_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getById(knexInstance, req.params.article_id)
      .then(article => {
        if (!article) {
          return res.status(404).json({
            error: { message: `Article doesn't exist` }
          })
        }
        res.json(article)
      })
      .catch(next)
  })

module.exports = articlesRouter