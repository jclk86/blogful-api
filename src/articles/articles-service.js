
// This services file helps organize code. That's it. 
// the Knex instance is in the main file, blogful.js. This file needs it, but if you require it from the blogful file, it creates a loop, because both files would be requiring each other in a dependency cycle. Avoid this. 
// Solution: (keep knex inside controller -- the file that starts up the server. The connection to KNEX would be explicit there, and easier to find).
// Inject the knex instance into the service.  Make knex instance a parameter for each of the ArticlesService Methods. Similar to when you do it in react, where this.setState({}) function is run on the file with the state, but function itself is passed down to diff files. 

const ArticlesService = {

  // this is a method
  // the knex addition here is the injection mentioned above. 
  getAllArticles(knex) {
    // return Promise.resolve('all the articles!!');
    // below is a promise object from knex
    return knex.select('*').from('blogful_articles')
  },
  insertArticle(knex, newArticle) {
    return knex //query object
      .insert(newArticle) // selects new item
      .into('blogful_articles') // table
      .returning('*') //specifies which column to return
      .then(rows => { // need to do this because it selects an array with the object, you need only the object for comparison
        return rows[0];
      })
  },
  getById(knex,id) {
    return knex.from('blogful_articles').select('*').where('id', id).first()
  },
  deleteArticle(knex,id) {
    return knex('blogful_articles')
      .where({id})
      .delete()
  },
  updateArticle(knex, id, newArticleFields) {
    return knex('blogful_articles')
    .where({id})
    .update(newArticleFields)
  }
};
module.exports = ArticlesService;

// build the query object with knex, then decide what you want from table and then return something and then chain a then() 