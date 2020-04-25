const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
// Must load model before we can use the model in services
require('./models/User');

require('./services/passport');

const { mongoURI, cookieKey } = require('./config/keys');

mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });
const app = express();

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
