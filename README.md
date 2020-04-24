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
