# lazy-input
A lazy React.js input field that only updates when it is told to re-render (fixes issues with Flux backed field data) 

About
=====
Using input elements with Flux can be a pain because actions are asynchronous. Triggering an action in the `onChange` handler will cause React's default `input` component to re-render the original value miliseconds before the new value arrives from the store.

LazyInput solves this problem by keeping an internal state for `value` and only updates that state when given new props, and then only after a `lazyLevel` has lapsed (default 1s). Otherwise, it works exactly like `input`. Well, almost. . .

LazyInput expands the `type` prop slightly to accept `textarea` in addition to the normal `input` types. We chose to do it this way because it seemed better than maintaining two packages (LazyInput and LazyTextarea), having `lazy-input/input` and `lazy-input/textarea` require statements, or having `LazyInput.input` and `LazyInput.textarea`.

    var LazyInput = require('lazy-input');
    // ...
    render: function() {
      return (
        <div>
          // an input element
          <LazyInput type="text" value="some value" onChange={this.onChange} />

          // a test area element
          <LazyInput type="textarea" value="some value" onChange={this.onTextAreaChange} />
        </div>
      );
    }