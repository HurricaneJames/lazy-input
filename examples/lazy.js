var React = require('react')
  , ReactDOM = require('react-dom')
  , LazyInput = require('../src/LazyInput');

var LazyInputExample = React.createClass({
  displayName: 'LazyInputExample',
  getInitialState: function() {
    return {
      value: '',
    };
  },
  onChange: function(e) {
    this.setState({ value: e.target.value });
  },
  onTextAreaChange: function(e) {
    this.setState({ value: e.target.value });
  },
  render: function() {
    return (
      <div>
        <h2>Component</h2>
        <LazyInput value={this.state.value} onChange={this.onChange} type="textarea" cols={80} rows={10} lazyLevel={5000} />
        <hr />
        <h2>Parent State</h2>
        <textarea value={this.state.value} onChange={this.onTextAreaChange} cols={80} rows={10} />
        <hr />
        <h2>Output (using Dangerously Set Inner...)</h2>
        <div dangerouslySetInnerHTML={{ __html: this.state.value }} />
      </div>
    );
  }
});

ReactDOM.render(<LazyInputExample />, document.getElementById('root'));

