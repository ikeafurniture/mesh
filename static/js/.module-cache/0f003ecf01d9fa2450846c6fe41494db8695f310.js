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

  render: function render() {
    var peerNodes = this.state.peers.map(function(peer, index) {
        return React.createElement(Peer, {publicKey: peer.PublicKey, state: peer.State, key: index});
    });

    return (
      React.createElement("div", {className: "peerList"}, peerNodes)
    );
  }
});

var Peer = React.createClass({displayName: "Peer",
  render: function() {
    return (
      React.createElement("div", {className: "peer"}, 
        React.createElement("h3", {className: "peerIP"}, 
          this.props.publicKey
        ), 
        React.createElement("h2", {className: "peerState"}, 
          this.props.state
        )
      )
    );
  }
})

React.render(React.createElement(PeerList, null), document.body);
