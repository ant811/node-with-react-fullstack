# node-with-react-fullstack

> This JavaScript course was created by [Stephen Grider](https://github.com/StephenGrider) for Udemy.  
> Sign up at [Node with React: Fullstack Web Development](https://www.udemy.com/course/node-with-react-fullstack-web-development/).

<h1 align="center">
  <img src="https://img-a.udemycdn.com/course/750x422/1254420_f6cb_4.jpg" style="max-width:100%" alt="nodeReactFullstack" />
</h1>

Greetings!

This repository tracks my progress and lessons learned on the Udemy course Node with React: Fullstack Web Developmen by Stephen Grider.

## **Section Logs**

### **Section 1: Course Overview - Start Here!**

**Completed:** 04/23/2020

**Lessons Learned / Notes:**

- [Course Resources](https://www.udemy.com/course/node-with-react-fullstack-web-development/learn/lecture/7593796#questions/8948480)
- [Blog Posts on React and other neat stuff](https://rallycoding.com/)
- [Course Diagrams](https://github.com/StephenGrider/FullstackReactCode/tree/master/diagrams)
- This course will build a single app - Email feedback application
- | How our User will navigate our application                   | Tech Used                                 |
  | ------------------------------------------------------------ | ----------------------------------------- |
  | User signs in via Google OAuth                               | Express Server, MongoDB, PassportJS       |
  | User pays for email credits via Stripe                       | Stripe, MongoDB                           |
  | User creates a new 'campaign'                                | React, Redux                              |
  | User enters a list of emails to send surveys to              | React, Redux, Redux Form                  |
  | We send mail to list of surveyees                            | Email provider                            |
  | Surveyees click on the link in the email to provide feedback | Email provider, Express, MongoDB          |
  | We tabulate feedback                                         | Mongo? (this is our assumption right now) |
  | User can see the report of all survey responses              | Mongo, React, Redux                       |

### **Section 2: Server Side Architecture**

**Completed:** 04/23/2020

**Lessons Learned / Notes:**

- Express API is between our React app and our MongoDB.
- React App and Express server will communicate exclusively through HTTP (ajax) requests
- Difference between using Express and Node:
  - Node:
    - JavaScript runtime used to execute code outside of the browser
    - Traditionally, JavaScript has always been executed inside of the browser
  - Express:
    - A library that runs in the Node runtime.
    - Has helpers to make dealing with HTTP traffic easier
    - Everything in this library, we could, though won't, write from scratch using Node
- Node.js does not support ES2015 modules (thus, must import modules into a file via `require` instead of `import`). Must use these _common JS modules_ on server
- In route handler callbacks, `req` represents incoming request, `res` represents the outgoing response
- Deployment via Heroku
- | Deployment checklist     |                                                                                                                   |
  | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
  | Dynamic port binding     | Heroku tells us which port our app will use, so we need to make sure that we listen to the port that they provide |
  | Specify node environment | We want to use a specific version of node.js, so we need to tell Heroku which version we want                     |
  | Specify start script     | Instruct Heroku what command to run to start our server running                                                   |
  | Create `.gitignore` file | We don't want to include dependencies, Heroku will do that for us                                                 |
- Heroku auto-injects environmental variables
- Lecture 15 - Heroku deployment (NOTE: I am pushing code to my ow repo and my Heroku app's remote)
- Command to push code to Heroku repo - `git push heroku master`
- Troubleshoot with `heroku logs` terminal command
- Open app inside the browser with `heroku open` terminal command

### **Section 3: Authentication with Google OAuth**

**Completed:** 04/24/2020

**Lessons Learned / Notes:**

- OAuth very common, standalone email/password account logins are becoming legacy
- Google auth response comes with parameter `code=145`, which we will use to request identifying info on the user, and set userId in a cookie
- We will use Passport.js library to help with Google OAuth flow
- Two common complaints about Passport:
  - Automates some, but _not all_, of the OAuth flow
  - Confusion around how the library is structured
- Passport makes use of two separate libraries:
  - passport - General helpers for handling auth in Express apps
  - passport strategy - Helpers for authenticating with one very specific method (E.g., email/password, Google, Facebook, etc.) Need one per auth method.
- clientId - public token, fine to share with the public
- client secret - do _NOT_ share!
- Our GoogleStrategy instance requires three key/values in the first argument object:
  - Both Google auth keys, and
  - The name of the route that the user will be sent to after they grant permission to our application, the value of `callbackURL`
- Lesson 27 - Resolved common Google OAuth error: `Error 400: redirect_uri_mismatch`
- Routes:
  - `app.get('/auth/google, ...'` - authenticates
  - `app.get('/auth/google/callback, ...'` - exchange code for user profile info
- Access token - when confirmed, can be used to take action in the user's profile (E.g., updating info), although we won't be doing that with our app
- `profile` argument contains the identifying info that we care about

### **Section 4: Adding MongoDB**

**Completed:** 04/25/2020

**Lessons Learned / Notes:**

- How we are organizing our Express server:
  - config folder
    - Protected API keys and settings
  - routes folder
    - All route handlers, grouped by purpose
    - One general file for each general set or group of routes
  - services folder
    - Helper modules and business logic
    - Helps configure our server to work the way we expect
    - Where we will put our Passport configuration (as Passport is a _service_ to our application)
  - index.js file
    - Helper modules and business logic
- Since we don't need to pull any code out of our passport.js file, we only need to `require` it in index.js with `require('./services/passport')`, and nothing needs to be exported from passport.js - We just want to make sure that the code is executed.
- Lecture 32 - Why/How authenticate?
  - We communicate between the browser and our Express server by HTTP requests
  - HTTP is stateless - between any two given requests that we make, HTTP inherently has no way to identify or share info between two separate requests. Follow-up requests are _not_ accepted without validation
  - Cookie/token (more on this later) contains unique, identifying information to streamline follow-up, post-authentication HTTP requests
  - After authentication, the server returns token, validating login, unique to user. Follow-up requests will include token to prove that the user is the same
  - We cannot rely on raw HTTP to handle this authentication
  - We will use cookie-based authentication
    - The server will send a request with a set-cookie property inside the header, stripped off and then stored by the browser
  - Additional requests from the browser will include this property
- In OAuth flow, after user signs in, we will pick some very consistent piece of information to uniquely identify the user between logins (in vanilla password/email flow, the email/password are those unique identifiers)
  - We will use the user's id (since email addresses can change, or people may forget password/lose access to email, the email address is not necessarily the safest unique identifier)
- MongoDB basics:
  - We will use mongoose.js library to make Mongo easier to work with
  - Mongo internally stores records into collections
  - Each record in a collection is essential JSON (plain JavaScript object)
  - The defining characteristic of Mongos is that it is schema-less, meaning that inside a collection, the records can all have a different set of properties
  - With Mongoose, we use a Model class, which represents an entire MongoDB collection
  - With Mongoose, we also use Model instances, which are JavaScript objects that represent a single record inside of a collection
- Lecture 40 - Sometimes, in a testing environment, Mongoose throws errors due to multoi[le use of `require` statement, when Model files get 'required' into other files multiple times
- Error `MissingSchemaError: Schema hasn't been registered for model "users".` appears due to the order of the require statements in index.js, we need to load user our model from User.js _before_ we try to use it services/passport.js
- Note - Database queries are asynchronous. Mongo queries return a promise
- Invoke `done` callback in passport after querying the database
- Create a token/cookie with function `serializedUser`
- For a user that has already visited, and thus already has a token, we will take uniquely identifying info from token/cookie and pass into function `deserializedUser` to turn back into a user model
- In `serializedUser`, we will use the MongoDB record's unique id, NOT the Google user id - this is better practice, consider that users can sign using something other than Google
- `req.logout()` - Passport automatically attaches this method to the req object
- Optional Deep Dive (Lecture 49) notes:
  - All `app.use` calls in index.js are wiring up some kind of middleware
  - Middleware - small functions that can be used to modify incoming requests to our app before they are sent off to the route handlers
  - You can wire up middleware to only be used for certain route handlers
  - How is cookieSession middleware working, and how is it relates to passport:
    - `req.session` contains data that passport is attempting to store inside of the cookie
    - Express.js docs recommend using both `cookie-session` and `express-session`
    - Difference between two different session libraries is how unique id'ing data is stored inside of the cookie
    - With `express-session`, a _reference_ to the session is stored
    - With `cookie-session`, the cookie _is_ the session
    - A cookie has limited storage capacity - 4 kilobytes, for our app, we are only storing user's id in the cookie, so this is fine
    - When using `express-session`, additional config. is required, such as setting us session store

### **Section 5: Dev vs Prod Environments**

**Completed:** 04/25/2020

**Lessons Learned / Notes:**

- We will have two different sets of keys, one for Dev, another for Production
- We can store Prod keys remotely on Heroku servers
- Also, having two sets us keys allows us to have two different Mongo databases
- Heroku is already able to access prod env library
- [Heroku env docs](https://devcenter.heroku.com/articles/config-vars)
- Lecture 56 - Heroku proxy issues:
  - Re-directing to http://...../auth/google/callback instead of https://...../auth/google/callback
  - Our GoogleStrategy is causing this error b/c we provided a relative path
  - The issue is that requests pass through Heroku proxy, which by default, shouldn't be trusted (thus https becomes http)
    - To fix, add `proxy: true` to GoogleStrategy config object
