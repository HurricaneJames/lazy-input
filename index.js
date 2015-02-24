var React = require('react');

var LazyInput = React.createClass({

  getInitialState: function() {
    return { value: this.props.value };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ value: nextProps.value });
  },
  onChange: function(event) {
    this.setState({ value: event.target.value });
    this.props.onChange.apply(null, arguments);
  },
  getProps: function() {
    // for the most part, we are just going to pass through whatever comes in
    var props = Object.create(this.props);
    props.value = this.state.value;
    props.onChange = this.onChange;
    return props;
  },
  render: function() {
    return React.createElement(this.props.type === "textarea" ? "textarea" : "input", this.getProps());
  }

});

exports = LazyInput;