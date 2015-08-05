var PeerList = React.createClass({
  displayName: 'PeerList',

  getInitialState: function getInitialState() {
    return {
      files: [],
      peers: []
    };
  },

  componentDidMount: function() {
    console.log(this.props.source);
     $.get("/peers", function(result) {
      console.log(result)
      if (this.isMounted()) {
        this.setState({
          peers: result
        });
        console.log(this.state.peers)
      }
    }.bind(this));
  },

  onDrop: function (files) {
    console.log('Received files: ', files);
    this.setState({
      files: files
    });
  },

  render: function render() {
    var peerNodes = this.state.peers.map(function(peer, index) {
        return React.createElement(Peer, {publicKey: peer.PublicKey, state: peer.State, key: index});
    });

    return (
      React.createElement(Dropzone, { onDrop: this.onDrop, size: 150 },
      React.createElement("div", {className: "peerList"}, peerNodes))
    );
  }
});

var Peer = React.createClass({displayName: "Peer",
  render: function() {
    return (
      React.createElement("div", {className: "peer"}, 
        React.createElement("h5", {className: "peerIP"}, 
          this.props.publicKey
        ), 
        React.createElement("h5", {className: "peerState"}, 
          this.props.state
        )
      )
    );
  }
})

React.render(React.createElement(PeerList, null), document.body);
