const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const routes = require('./controllers');
const authRoutes = require('./routes/authRoutes'); // Include auth routes
const postRoutes = require('./routes/postRoutes'); // Include post routes
const dashboardRoutes = require('./routes/dashboardRoutes'); // Include dashboard routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Configure sessions
const sess = {
  secret: 'your_secret_key',
  cookie: { maxAge: 3600000 }, // 1 hour
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: db.sequelize }),
};

app.use(session(sess));

// Set up Handlebars
app.engine('handlebars', require('express-handlebars')({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use routes
app.use(authRoutes); // Include authentication routes
app.use(postRoutes); // Include post routes
app.use(dashboardRoutes); // Include dashboard routes
app.use(routes);

// Sync database and start server
db.sequelize.sync({ force: false }).then(async () => {
  // This line ensures that associations are applied
  await db.sequelize.models.User.sync();
  await db.sequelize.models.Post.sync();
  await db.sequelize.models.Comment.sync();
  
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
