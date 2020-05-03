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

### **Section 6: Moving to the Client Side**

**Completed:** 04/26/2020

**Lessons Learned / Notes:**

- Create react app with `npx create-react-app [name of app]`
- We will have a separate server for our front end (React server)(Dev only!)
- Our Express server is needed to handle HTTP requests and query the database. _Only_ concerned with generating JSON data
- Our React server bundles up our component files (using babel and webpack), provides bundled js file that is loaded into the browser
- We could use a single Express server to handle everything
- However, we will be using two servers to take advantage of create-react-app, very easy way to set up frontend project, comes with a lot of built-in configuration
- Instead of opening two terminal windows to start each server, we will use a package called Concurrently
- Lecture 62 (mind update in Lecture 61) - setting up proxy server default so that relative re-directs work - Our client-server now works nicely with our backend server
- Proxy is included and built into our create-react-app, forwards requests from the browser to our node/express API
- Everything, though, is different when the app is in Production
  - create-react-app creates an optimized production build (`npm run build`)
  - Then, our Express server can easily serve up everything from build folder
  - Proxy set-up is really only for dev environment because create-react-app server doesn't even exist inside of production
- Optional Lecture 64: Why this Architecture?
  - Cookies remain included when the browser reads from port 3000, but the browser will prevent cookies when the browser tries to load requests to port 5000, the magic of our proxy!
  - No CORS issues!
    - Cross-Origin Resource Sharing
    - Browser security feature to prevent requests to a different domain, the browser assumes malice

### **Section 7: Developing the Client Side**

**Completed:** 04/28/2020

**Lessons Learned / Notes:**

- Advice - When possible, ONLY work on any given side of the app at a time (front end, back end), working on both at the same time can cause messy code
- Main index.js file - Data layer control (Redux)
- App.js - React Router / rendering layer
- Redux:
  - Provider (from react-redux) is a component that makes the store accessible to every component in the app
  - One Reducer per "piece of state"
  - React component call an --> Action Creator, which returns an --> Action, sent to --> Reducers, updates state in --> Store
  - _REMINDER:_ When initializing store, pass in 'dummy reducer' as the first argument, else the app will crash E.g., `() => []`
  - NOTE: Names of keys in `combineReducers` are names of states, so be thoughtful and mindful of naming state `auth: authReducer`
- More on why we care of authentication:
  - Header will change when the user is logged in
  - Auth user gains access to member's only components
- NOTE: BroswerRouter can accept _one_ child component at most (initial set up, Routes are all contained within one `<div>`
- 3rd part library used for basic styling [Materialize CSS](https://materializecss.com/) - NOTE: Partial compatibility with React
  - What not use Material U.I.?
    - It might be a 'better' library, but it is harder to override default stylings. It used JavaScript-based styling instead of CSS based styling
- Webpack
  - Create-react-app came with Webpack, a module loader, splits out (typically) one output file from many different files
  - Handles more than just JavaScript
  - Sometimes requires loaders for other types of files
- Materialize assumes that there is a root div with class 'container' (this fixes spacing issue)
- Redux-thunk allows us to break the rule that Action Creators must immediately return an action (allows async code), gives us access to the behind-the-scenes dispatch function
  - redux-thunk inspects every value returned from an action-creator - if action creator returns a function, then redux-thunk envokes function and passes dispatch in as an argument
- Connect function from react-redux allows react to call action creators
- Best practice - set up three different return cases for authReducer, provides a better user experience, ONLY accurate content shown:
  - null, if auth still pending
  - Not logged in
  - Logged in
- authRoutes.js: GET request to `'/auth/google/callback'` needs additional handling directive after authentication, disposition req/res
- Redirect on logout: We will do a full page refresh. Also, we need to update cookie session/token, as redirect user to the landing page
- React router Link tags - navigate to a different route, different components rendered
- Anchor tag - traditional reroute, refreshes the whole page, gets different HTML document

### **Section 8: Handling Payments**

**Completed:** 04/29/2020

**Lessons Learned / Notes:**

- Rules of Billing
  - We are bad at security:
    - Never accept raw credit card numbers
    - Never store credit card numbers
    - Always use an outside payment processor
  - Billing is hard!
    - Possible to avoid monthly payments/multiple plans? Monthly billing is really difficult, our app will function with credits. Plenty of third-party apps help with monthly payments, but none have a free tier
    - Fraud and chargebacks are a pain.
- We will use [Stripe](https://stripe.com/) to process payments
- Initial setup of account with Stripe contains 'test' setup, where you can provide fake credit card detail for your app's development
- Stripe API publishable key will be handled differently, as we will use it within the front end, won't be stored in the same place as our other keys
- [react-stripe-checkout](https://github.com/azmenak/react-stripe-checkout) works nicely with React, as plain checkout.js is not optimized for React
- Front-end key only wants Stripe publishable key, Backend wants the publishable and secret key
- Lecture 100 - deep dive on using config keys differently on the front end:
  - The backend uses common JS modules (require statements), can be used with logic to determine which get exported.
  - The frontend uses ES2015 modules (export, import), which cannot have a layer of logic to determine what gets exported
  - Also, the client (front end) files must be visible as they are served up to browser, thus we cannot simply use the same config file from the backend
- Create-react-app has great build-in support for using API keys on frontend - build in env variable setup
- REMINDER - Mac sees files beginning with `.` as invisible, thus in finder, you won’t see our .env files
- StripeCheckout defaults to USA dollar
- Fake credit card:
  - 4242 4242 4242 4242
  - any future expiry, any CVC
- We will use [Stripe Node library](https://www.npmjs.com/package/stripe) on our Express server to help with handling token in billingRoutes.js
- BIG 'gotcha' - when you make post requests to an Express server, Express does not auto-parse the request payload - we'll need `body-parser` middleware
- LECTURE 112/113: NOTE - Regarding billingRoutes.js, passport.js auto-assigns `req.user` a value, it is a reference to our user model. This is _not_ due to Express or body-parser:
  - `req.user` is { credits: 0, \_id: 5ea48363d75a124f288ec01e, googleId: '108841067892690222239',\_\_v: 0 }
  - Passport looks at cookie, sees user id, assigns user model to request
- Pull auth requirement into a single location, so we can validate auth in specific routes
- You can pass in any number of middlewares as arguments to Express API request, the only rule is that res must be handled

### **Section 9: Back-End to Front-Ent Routing in Production**

**Completed:** 04/29/2020

**Lessons Learned / Notes:**

- In Production, our Express server needs to respond with all relevant assets (client bundle) as create-react-app layer does not exist in Production
- `npm run build` builds optimized Production version of assets inside the client side of our project
- Note that some of our routes are specifically handled in routes folder on the server, and other routes are handled by react-router-dom on front-end
- The Express server needs to know when to pass along route request to assets (I.e., js bundle, HTML main file)
  - BIG different between:
    - Serving up main assets (index.html file, js bundle file on the client), and
    - react-router routes for page rendering
- By convention, we don't commit our builds. Note that create-react-app's .gitignore file ignores build folder
  - Use Heroku to build client assets?
    - Software engineers want to avoid installing ALL (I.e., all dev) dependencies in production env
    - We will go with this option
  - Push to CI (continuous integration), third party server
    - Run tests, then build, commit, deploy!
    - Outside scope of this course, recommend circle.ci to start
    - Most common in the real world env
- [Heroku Node.js support](https://devcenter.heroku.com/articles/nodejs-support) - Heroku will build assets, then proceed to deploy everything
- REMINDER:
  - To check for Heroku errors, enter terminal command `heroku logs`
  - To open the app on Heroku, enter terminal command `heroku open`
- Only once a user is inside an HTML document, with js docs loaded up, do any react-router rules take effect

### **Section 10: Mongoose for Survey Creation**

**Completed:** 04/30/2020

**Lessons Learned / Notes:**

- Record user response to email survey with webhooks
- Surveys will need their own Mongoose model, which will also contain some reference to the user who created the survey
- In recipients property of the survey model, we are going to embed a _sub-document collection_, to not only record the recipient but also whether or not they voted (this will prevent duplicate votes)
  - Every recipient object will have two properties: 1) email, 2) clicked
- Mongo record has a 4MB limit, thus we don't want to store survey detail under User record. This is also why we are setting up a sub-document collection for recipients, else we put space limits on a survey's recipients (200k is a lot, but still, it is a limitation)
- Recipient schema - rather than registering schema with mongoose, we will export it, and import it into Survey.js
- In survey route check for:
  - User is logged in (we already made middleware for this)
  - User has credits (we'll make new middleware for this)
- Lecture 132
  - Wisdom of starting on the backend before designing frontend, setting up routes before writing how to handle frontend user input
  - REMINDER - In our survey route, be careful not to require in mongoose model as this can cause testing errors
- Survey route handler will also send emails
- We don't want one HTTP request w/ mailer object per recipient, this won't scale well. We want to do a batch operation w/ one mailer object/network request
- We cannot put any identifying token in the emails because all recipients will receive the same email, but we'll need some mechanism to uniquely identify users
- We'll be using [Sendgrid](https://sendgrid.com/)
  - For each recipient email, Sengrid replaces links inside the email with customizable links
  - This process is a _webhook_, where an outside API is facilitating some process, then gives the app a callback with notice that action has been performed
- So...much...Sendgrid configuration...
- How to test email sending - can't use Postman as our app requires authentication
  - Lecture 146: Access Axios from the global window object, manually make POST requests from within the console
    const survey = { title: 'my title', subject: 'Give us Feedback!', recipients: 'bonfilio.tony@gmail.com', body: 'We would love to hear if you enjoyed our services'}
    axios.post('/api/surveys', survey);

### **Section 11: Back to the Client!**

**Completed:** 05/01/2020

**Lessons Learned / Notes:**

- [Materialize CSS](https://materializecss.com/) - more frontend work
  - Icons with Materialize: We need to add a link tag to index.html
- Redux-form - comes built-in with action creators and reducers to handle storing data to redux store. NOTE: react-final-form is now recommended instead of redux-form [react-final-form](https://github.com/final-form/react-final-form#-react-final-form)
- reduxForm component nearly identical to react-redux connect component, used to connect with redux store
- Field component - used wherever a traditional HTML form tag would be used (Text, text area, checkboxes, etc.), a 'swiss army knife'
- reduxForm hands over many helpful props to forms (E.g., handleSubmit)
- validate argument in reduxForm config - additional functionality from redux-form, all values of form auto-passed in
- Validation - errors appear in meta object
- Validate emails - function lives in util folder
  - [Email Regex](https://emailregex.com/) for email validation
- Toggling visibility - How to determine whether to show SurveyForm or SurveyFormReview?
  - Separate route?
    - easy setup, clear for other engineers
    - downside - what if somehow the user goes straight to the /new route? We'd need extra code to kick off user
  - Redux?
    - update state in Redux store, serves as a flag (action creator, reducer, all that just to decide whether the user should progress)
    - very valid solution...but a lot of extra code to get it to work
  - Component State w/ React?
    - we will do this, add state to SurveyNew component, piece of state will determine which component to show
    - we can def use Redux state and React state in the same app
- Redux for state or React Component for the state, when to use one or the other?
  - Any reason to think that other features or components will need access to a certain state? In our case, only SurveyNew component really cares whether or not the user is ready to progress, no other feature really needs this piece of state
  - If the state needs to be shared amongst many features, then Redux makes more sense
- Reminder: create-react-app has babel plugin that allows simplified state declaration in class components: `state = { formReview: false };`
- We will need to persist the form data - FormReview needs it, and it is better to store in Redux for easy retrieval
- Lecture 176 - Dumping form values when the user directs away from the route and another component is mounted
  - in SurveyNew - add redux-form helper, pass in name of the form in the config, then `destroyOnUnmount` is auto-invoked when the form is unmounted, but toggling between SurveyFormReview and SurveyForm is still fine because SurveyNew is not being unmounted
- After submitting, we want to do a programmatic re-direct (auto-directs after sending email)
  - It's from within our action-creator that we want to handle our navigation
  - We will teach our Component SurveyFormReview about react-router, which can then pass on a directive to the action-creator
  - `withRouter` helper is provided by the react-router-dom library
  - we can access the `history` object thanks to `withRouter`

### **Section 12: Handling Webhook Data**

**Completed:** 05/03/2020

**Lessons Learned / Notes:**

- Webhook in our application:
  - User clicks on the link
  - Sendgrid records click
  - Sendgrid waits a bit
  - Sendgrid makes a POST request to our server with data about all the clicks in the last 30 seconds or so
- Sendgrid doesn't immediately make requests to our API, these come in batches
- Webhooks will work differently in production vs. dev environment
  - In Production:
    - Sendgrid makes a POST request to our server with data about all of the clicks in the last 30 seconds or so
    - POST [domain]/surveys/webhooks
    - We process a list of clicks on the API
    - What makes this easy in prod is that requests are sent to the deployed server - no issues with making POST requests to a deployed server
  - In Development:
    - Can't go to our localhost:5000 - Sendgrid cannot reach out to our laptop
    - We will use a package called Ngrok
    - run code `npx ngrok http 5000` in the terminal, produces an eight-hour forwarding address. Keep the terminal window open, re-run script and get a new address after 8 hours
    - webhook full address: `https://171c9dbe.ngrok.io/api/surveys/webhooks`
    - Post-deployment - we'll need to update the webhook address, we can only have one!
- Since response object from email survey (via webhook) contains a lot of data that we don't necessarily want (E.g., duplicate yes/no responses, non-click events, click events to different routes), we'll need to sift through response object
- Lodash - compact - removes elements that are undefined
- Lecture 195 - Bad Mongoose query
  - Requesting, updating, and persisting everything in the survey model - what if the survey has thousands of recipients - do we really want to received and send off an object with all recipients?
  - We always want to minimize the amount of data that we are pulling out from our database
  - Write a clever query that finds and updates the record in the same query, all within Mongo, without sending, returning, sending, returning to/from all our Express server - everything is handled within Mongo
  - Mongo operator `$inc`:
    - logic inside of a query
    - `$inc: { [choice]: 1}` - choice evaluates to yes or no, and gets incremented by 1
    - `$set: { 'recipients.$.responded:' : true}` - \$ refers to the found recipient record in initial query
- Mongoose query tips:
  - Google search exactly what you want to do:
    - 'mongoose js update document in subdocument collection' takes you straight to good StackOverflow thread
  - run mongoose queries from node interface in terminal:
    - enter 'node' in terminal to open node CLI
    - kill server
    - Copy code from server/index.js from top of file through mongo connection, and paste into the Node CLI
    - Now, you can write queries and test them out!
