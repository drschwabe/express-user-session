# Express Memory User Session

Simple memory session tek; wrapper/convenience library around [express-session]

Creates a `.user` apart of the usual session object containing a unique `_id` property.

### install/usage: 

```bash
npm install express-memory-user-session
```

```js
const memorySession = require('express-memory-user-session') 
memorySession.init(state, app) 
memorySession.serve(app) 
```
.serve() extends Express app object with 2 routes:

```
/memory-user-session/start 
/memory-user-session/destroy 
```

The session-memory/start establishes an object on req.session.user with a unique id as follows: 

```js
req.session.user = {
  _id : startupTimestamp + '_' + _.uniqueId()
}
```
The session will expire in 48 hours unless deleted*
*TODO: change from 1 minute to 48 hours or make a param in the route to accommodate dif value

### usage


```js
require('priority-express-session')(app)
```


[express-session]:https://github.com/expressjs/session