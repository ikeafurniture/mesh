var App = React.createClass({
  displayName: 'App',

  render: function render() {
    return (
      React.createElement("div", null, 
      React.createElement(PeerList, null),
      React.createElement(FileList, null)
      )
    );
  }
})

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
        return React.createElement(Peer, {IPV6: peer.IPV6, state: peer.State, key: index});
    });

    var styling = {
      marginLeft: "47%",
      marginTop: 200,
      align: "center"
    };

    return (
      React.createElement("div", {className: "peerList", style: styling}, peerNodes)
    );
  }
});

var Peer = React.createClass({displayName: "Peer",
  render: function() {
    var url = '/peer/' + this.props.IPV6

    // Do this better
    var color;
    if (this.props.state == "ESTABLISHED")
      color = "#00c800"
    else
      color = "#b3b3b3"
          // <Dropzone>
      // </Dropzone>

    return (
      React.createElement("div", {className: "peer"}, 

      React.createElement(SVGComponent, {height: "14", width: "15"}, 
          React.createElement(Circle, {
          cx: "6", cy: "9", r: "5", 
          fill: color})
      ), 
      React.createElement("a", {className: "peerIP", href: url}, 
        this.props.IPV6
      )
      )
    );
  }
})

var FileList = React.createClass({displayName: "FileList",
  getInitialState: function getInitialState() {
    return {
      files: [{"Name":".DS_Store","Size":6148,"Mode":420,"ModTime":"2015-07-20T17:39:47+08:00","IsDir":false},{"Name":".git","Size":442,"Mode":2147484141,"ModTime":"2015-07-05T21:43:20+08:00","IsDir":true},{"Name":"mesh","Size":6962476,"Mode":493,"ModTime":"2015-07-05T15:19:36+08:00","IsDir":false},{"Name":"server.go","Size":1761,"Mode":420,"ModTime":"2015-07-20T17:38:30+08:00","IsDir":false},{"Name":"static","Size":136,"Mode":2147484141,"ModTime":"2015-07-20T17:40:43+08:00","IsDir":true}]
    };
  },

  render: function() {
    var files = this.state.files.map(function(file, index) {
        return React.createElement(File, {name: file.Name, key: index}); // Size, icon, what else?
    });

    var styling = {
      marginLeft: "40%",
      marginTop: 00,
      align: "center"
    };

    return (
      React.createElement("div", {className: "fileList", style: styling}, files)
    );
  }
})

var File = React.createClass({displayName: "File",
  render: function() {

    return (
      React.createElement("div", {className: "file"}, 
        React.createElement(SVGComponent, {height: "50", width: "50"}, 
            React.createElement(Square, {
            cx: "6", cy: "9", r: "5", 
            fill: "black"})
        ), 
        React.createElement("h2", null, this.props.name)
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

var SVGComponent = React.createClass({displayName: "SVGComponent",
    render: function() {
        return React.createElement("svg", React.__spread({},  this.props), this.props.children);
    }
});

var Circle = React.createClass({displayName: "Circle",
    render: function() {
        return React.createElement("circle", React.__spread({},  this.props), this.props.children);
    }
});

React.render(React.createElement(App, null), document.body);



// Main App
  // Degree slider
  // Peer graph
    // Peer
    // Self



