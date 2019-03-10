# Viracocha


A React Redux app to create and show a list of Wikipedia items.

#

Table of contents

* [Command line Redux](#command-line-Redux)
* [Best practices](#best-practices)
* [Middleware](#middleware)
* [Fetch data with Thunk](#fetch-data-with-Thunk)
* [Redux Saga](#redux-Saga)
* [Setting up Redux](#setting-up-Redux)
* [Connecting Redux to React](#connecting-Redux-to-React)
* [The stateful form](#the-stateful-form)
* [Available scripts](#available-scripts)
* [Links](#links)

#

## Command line Redux

Use the command line to observe the store by adding functions to the window object in the src/index.js file like this:
```
import { addEntity } from "../js/actions/index";
window.store = store;
window.addEntity = addEntity;
```

Then in the developer tools console you can do this:
```
store.getState()
```

Of course, the dev-tools provide this and everything you would want in a debugger.


## Best practices

*Avoiding mutations in Redux*:
* Using concat(), slice(), and …spread for arrays
* Using Object.assign() and …spread for objects

*Split a big reducer into separate functions and combine them with combineReducers*.

*The Redux store exposes a simple API for managing the state. The most important methods are*:
* getState for accessing the current state of the application
* dispatch for dispatching an action
* subscribe for listening on state changes


## Middleware

*The reducer is a state producer.*
* check the action payload before the actions is passed to the reducer.
* they will hold the bulk of the application’s logic


## Fetch data with Thunk

Fetch data from an API in a action creator with Thunk.

*Thunk will return functions from action creators.*
*Inside that function we can call APIs, delay the dispatch of an action, and so on.*

Before Thunk:
```JavaScript
export function getData() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(json => {
      return { type: "DATA_LOADED", payload: json };
    });
}
```


After Thunk:
```JavaScript
export function getData() {
  return function(dispatch) {
    return fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(json => {
        dispatch({ type: "DATA_LOADED", payload: json });
      });
  };
}
```


## Redux Saga

Asynchronous actions can be trickier to test and organize.
Redux saga is middleware for managing side effects.
A separate thread in the app for dealing with impure actions: API calls, storage access.
A clear separation between synchronous and asynchronous logic separated from Redux.
It could be a single file containing generator functions like worker and watcher called a *saga*.

A watcher is a generator function “watching” for every action we are interested in.
It will call a worker saga, which is another generator function for doing the remote API with the call method from redux-saga/effects.


### Generators

A generator function can be paused and resumed during its execution.
It must be captured in a var and next() called to continue execution.
```JavaScript
function* generatorLoop() {
    for (var i = 0; i < 15; i++) {
        yield console.log(i)
    }
}
var myGenerator = generatorLoop()
myGenerator.next()
myGenerator.next()
...
```

*Redux saga handles calling next() under the hood.*

The getData() function using Saga:
```JavaScript
export function getData() {
  return { type: "DATA_REQUESTED" };
}
```

The saga is now in src/js/sagas:
```JavaScript
import { takeEvery, call, put } from "redux-saga/effects";
export default function* watcherSaga() {
  yield takeEvery("DATA_REQUESTED", workerSaga);
}
function* workerSaga() {
  try {
    const payload = yield call(getData);
    yield put({ type: "DATA_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}
```



## Setting up Redux

Install Redux:
```
npm i redux --save-dev
```

With these files:
```
mkdir -p src/js/store
mkdir -p src/js/reducers
mkdir -p src/js/actions
mkdir -p src/js/constants
mkdir -p src/js/components
```


## Connecting Redux to React

React-redux’s connect function connects a React component with the Redux store.
```
npm i react-redux --save-dev
```

### mapStateToProps & mapDispatchToProps

mapStateToProps connects a part of the Redux state to the props of a React component.

mapDispatchToProps connects Redux actions to React props.
```
import { connect } from "react-redux";
const List = connect(mapStateToProps)(ConnectedListUnorderedListComponent);
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
```

### the Provider wraps the app and gets the store as a prop.
```
render(
  <Provider store={store}>
    <App />
  </Provider>,
```

In the src/js/components/List.jsx file, the connect function is used like this:
```JavaScript
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { entities: state.entities };
};

const ConnectedList = ({ entities }) => (
  <ul className="list-group list-group-flush">
    {entities.map(el => (
      <li className="list-group-item" key={el.cognitive_bias}>{el.title}</li>
    ))}
  </ul>
);
const List = connect(mapStateToProps)(ConnectedList);
```

The entities array in the Redux state comes from the reducer.  
Can someone please explain this syntax?
```
connect(mapStateToProps)(ConnectedList)
```

It looks like a type casting thing from Java.  
The connect function links a component to the store.  
The API shows four optional parameters:
```
mapStateToProps?: function
mapDispatchToProps?: function | obj
mergeProps?: function
options?: obj
```

Is it some kind of validating props with PropTypes akin to TypeScript?

Maybe it's an iif-ie: *an Immediately-Invoked Function Expression looks like a typical function declaration, except it’s wrapped in parenthesis and has a second set of parenthesis at the end*
```
(function(){
  // ...do something...
})();
```

Isn't that a *function expressions*?  The first part is called that.  Still, why isn't it this:
```
(connect(mapStateToProps))(ConnectedList)
```

The second set of parenthesis in an iif-ie are used to invoke functions. So the function declaration will immediately invoke the function.  That's too many functions in one sentence.

[This article answers](https://codeburst.io/javascript-what-the-heck-is-an-immediately-invoked-function-expression-a0ed32b66c18) the question of *why would we use an IIFE instead of just creating a function and invoking it right afterwards?*

The answer is *privacy*:  *In JavaScript, variables are scoped to their containing function. This means that they can’t be accessed outside of the function.*

The example is:
```
(function(){
  var superSecret = 195;
})()
console.log(superSecret);
//  Uncaught ReferenceError: superSecret is not defined
```

Going deeper into the connect() function, I read [this StackOverflow](https://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux/34458710#34458710) discussion that says connect *usually serves as the boundary between Redux-aware and Redux-unaware components.*

In this case, the Redux-unaware component is React.  There is an example that has the format with the double brackets:
```
export default connect(mapStateToProps, (dispatch) => ({
    ...bindActionCreators({fetchUsers}, dispatch), dispatch
}))(Users);
```

Again in [this answer](https://stackoverflow.com/questions/34446461/updating-a-selected-object-when-user-changes-inputs-in-a-form/34455431#34455431) we see the same format:
```
const SideBarContainer = connect(
  (state, {objectId}) => ({
    currentObject: _.find(state.objects, {id}),
  }),
  (dispatch, {objectId}) => ({
    updateObject: data => dispatch(
      actions.updateObject(objectId, data)
    )
  })
)(SideBar);
```



## The stateful form

The current state of the input is not something that most people care about.  It therefore is not a stateless component, and the field is not added to the store.  However, the page does handle the add function.
```Javascript
handleSubmit(event) {
    event.preventDefault();
    const { title } = this.state;
    const id = uuidv1();
    this.props.addEntity({ title, id }); // Relevant Redux part!!
}
...
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
```

The description of the last line in the strange fn()() syntax says:
 *the component gets exported as Form. Form is the result of connecting ConnectedForm with the Redux store.*

Regarding the null argument it says:
 *the first argument for connect must be null when mapStateToProps is absent like in the Form example. Otherwise you’ll get TypeError: dispatch is not a function.*

I understand a simple variable declaration, which im this case is to assign the variable the result of the connect() function.  I don't quite get why a varaible would be used instead of a class function in this case:
```
const mapStateToProps = state => {
    return { entities: state.entities };
};
```

That looks like an arrow function being used as a variable.  Fair enough, but why not just a junction returning it's value which then sets the variable, like this (in TypeScript):
```
mapStateToProps(state) {
    return { entities: state.entities };
};
```

Why not use a straight variable here?
```
const { title } = this.state;
```

Can't you just do this:
```
const title = this.state;
```

Is this destructuring without the ellipsis?  Is that setting the JSON *property* as the value, a kind of shorthand for this:
```
const title = { title: this.state };

```

It's always worth trying something out to answer your own questions.  Using the basic variable setting from the ```const { title }``` above causes the input field to have an [object Object] as its initial value and this error when choosing submit:
```
Uncaught Invariant Violation: Objects are not valid as a React child (found: object with keys {title}). If you meant to render a collection of children, use an array instead.
    in li (at List.jsx:11)
```

On first read, it seems to be the opposite of the issue here.  If it said *strings* are not valid as a React chile I would understand that it wanted an object.  Still, the message gives us something to search for.  [This StackOverflow question](https://stackoverflow.com/questions/33117449/invariant-violation-objects-are-not-valid-as-a-react-child) seems to be about the same kind of sitch(uation).

The second answer has something like this:  *the correct way to insert the value of count* ```{count}``` *which the compiler presumably turned into {{count: count}}, i.e. trying to insert an Object as a React child.*

Trying out this:
```
const title = { title: this.state.title };
```
gives the same error.  So then it's the opposite:
```
const title = this.state.title;
```

This does work.  So before when ```const title = this.state;``` was tried, it caused the error because that's the entire state, which is an object.  So it is a destructuring shortcut.
const title = this.state.title;
is the same as
const { title } = this.state;

It finds the property with the same name on the object and sets the constant to that.




## Available Scripts

In the project directory, you can run:
```
npm start
npm test
npm run build
```


## Links

[Create React App](https://github.com/facebook/create-react-app).

[Example](https://github.com/reduxjs/redux/tree/master/examples/todos/src)

[Sandbox](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos?from-embed)

[Redux tutorial](https://www.valentinog.com/blog/redux/)


Here are some random sections that haven't been organized so far.


### The server result issue

Using our WikiData API, it returns a response with a single item, list which holds an array of entities.
```
{
    "list": [
        {
            "cognitive_bias": "http://www.wikidata.org/entity/Q18570",
            "cognitive_biasLabel": "Hawthorne effect",
            "cognitive_biasDescription": "social phenomenon",
            "lang": "en"
        },
        ...
```

However, this turns out to be a bit of a problem for the Redux/Saga/Fetch setup.
I'm guessing that this is a bit of a hack to get it to render:
```
let list = [];
if (typeof this.props.entities[0] !== 'undefined') {
  list = this.props.entities[0].list;
}
```

Otherwise there is an error in the template because at first the response is empty, so trying to access the first element property fails.  

The original data source looked like this:
```
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  ...
```

No object, just an array of objects.  Should we make a new API on the server to support that, or find out how in the React world this should be handled?  It works for now so hopefully the best solution will reveal itself in time.


### The plan

The official Redux implementation has some features implemented we want here.

As well as a todo list with an add button, the example has a "Show" component that lets you filter the list by "all", "active", or "complete".

Here is a list of some random things coming up next.
The Post/Posts class needs to be renamed.
Title needs to be the label.


### Atom error
Failed to activate the react package
Cannot read property 'jsxPatch' of undefined
Hide Stack Trace
TypeError: Cannot read property 'jsxPatch' of undefined
    at AtomReact.patchEditorLangModeAutoDecreaseIndentForBufferRow (/Users/tim/.atom/packages/react/lib/atom-react.coffee:41:18)
    at AtomReact.patchEditorLangMode (/Users/tim/.atom/packages/react/lib/atom-react.coffee:105:5)
    at AtomReact.processEditor (/Users/tim/.atom/packages/react/lib/atom-react.coffee:306:6)

[This link](https://github.com/orktes/atom-react/issues/256) describes the issue.


### ImmutableJS two reasons to use
* referential transparency: mutating an object in-place is hard to reason.
* mutable data makes it hard to use math to analyze the program — imagine a math theorem where x
* immutable data we can often use a cheap referential comparison (===) to see if an object has changed rather than a deep comparison.
* helpful is in determining if we need to re-render a React component.

* performance. use persistent data structures to efficiently make immutable updates, returning a new reference without cloning the underlying data.

```
state.set('loading', false).set('user', user)
```
we only care about the end result so instead we can use the withMutations function to batch these updates:
```
state.withMutations(s => s.set('loading', false).set('user', user))
```
