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

    var styling = {
      padding: 30,
    };

    return (
      React.createElement("div", {className: "peerList", style: styling}, peerNodes)
    );
  }
});

var Peer = React.createClass({displayName: "Peer",
  render: function() {
    return (
            React.createElement(
        Dropzone, { onDrop: this.onDrop, size: 150}
      ),
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

var Dropzone = React.createClass({displayName: "Dropzone",
  getDefaultProps: function() {
    return {
      supportClick: true,
      multiple: true
    };
  },

  getInitialState: function() {
    return {
      isDragActive: false
    };
  },

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    supportClick: React.PropTypes.bool,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool
  },

  onDragLeave: function(e) {
    this.setState({
      isDragActive: false
    });
  },

  onDragOver: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true
    });
  },

  onDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false
    });

    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    var maxFiles = (this.props.multiple) ? files.length : 1;
    for (var i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }
  },

  onClick: function () {
    if (this.props.supportClick === true) {
      this.open();
    }
  },

  open: function() {
    React.findDOMNode(this.refs.fileInput).click();
  },

  render: function() {

    var className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    }

    var style = this.props.style || {
      width: this.props.size || 100,
      height: this.props.size || 100,
      borderStyle: this.state.isDragActive ? 'solid' : 'dashed'
    };


    return (
        React.createElement('div', {className: className, style: style, onClick: this.onClick, onDragLeave: this.onDragLeave, onDragOver: this.onDragOver, onDrop: this.onDrop},
            React.createElement('input', {style: {display: 'none'}, type: 'file', multiple: this.props.multiple, ref: 'fileInput', onChange: this.onDrop, accept: this.props.accept}),
            this.props.children
        )
    );
  }

});

React.render(React.createElement(PeerList, null), document.body);
