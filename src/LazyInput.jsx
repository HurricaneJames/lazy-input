var React = require('react');

var LazyInput = React.createClass({
  displayName: "LazyInput",
  propTypes: {                                  // ['text'] or [CustomInput] type of rendered input
    type: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    lazyLevel: React.PropTypes.number           // [1000]   number of ms to wait before responding to changes in prop.value
    // note: passes through everything but lazyLevel
  },
  getDefaultProps: function() {
    return {
      type: 'text',
      lazyLevel: 1000
    };
  },
  getInitialState: function() {
    return { value: this.props.value };
  },
  componentWillReceiveProps: function(nextProps) {
    this.updateIfNotLazy(nextProps.value);
  },
  componentWillUnmount: function() {
    if(this.procrastinationTimer) {
      clearTimeout(this.procrastinationTimer);
      this.procrastinating = false;
    }
  },
  updateIfNotLazy: function(newValue) {
    if(!this.procrastinating) {
      if(this.state.value !== newValue) {
        this.setState({ value: newValue, requestedValue: undefined });
      }
    }else {
      this.setState({ requestedValue: newValue });
    }
  },
  procrastinate: function() {
    this.procrastinating = true;
    if(this.procrastinationTimer) { clearTimeout(this.procrastinationTimer); }
    this.procrastinationTimer = setTimeout(this.ohAlrightAlready, this.props.lazyLevel);
  },
  ohAlrightAlready: function() {
    this.procrastinating = false;
    this.updateIfNotLazy(this.state.requestedValue);
  },
  onChange: function(event) {
    this.procrastinate();
    this.setState({ value: event.target.value });
    this.props.onChange.apply(null, arguments);
  },
  getProps: function() {
    var props = {};
    for(var key in this.props) { if(key !== 'lazyLevel') { props[key] = this.props[key]; } }
    props.value = this.state.value;
    if(props.onChange) { props.onChange = this.onChange; }
    return props;
  },
  render: function() {
    var type = this.props.type;
    if(!type || type === "text") {
      type = "input";
    }

    return React.createElement(type, this.getProps());
  }

});

module.exports = LazyInput;
