const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
// Must load model before we can use the model in services
require('./models/User');

require('./services/passport');

const { mongoURI, cookieKey } = require('./config/keys');

mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });
const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    //30 days
    maxAge: 30 * 24 * 60 * 60 * 1000,
    //sign/encrypt cookie
    keys: [cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // Like main.js and main.css
  const path = require('path');
  //app.use(express.static('client/build'));
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Express will serve up the index.html file
  // if it doesn't recognize the route

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
