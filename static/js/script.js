var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      degree: 1
    };
  },

  render: function render() {
    return (
      React.createElement("div", null,
        React.createElement("img", {id: "logo", src: "/static/img/logo.png"}),
        React.createElement("div", {id: "graph"}),
        React.createElement(FileList, null)
      )
    );
  }
})

var FileList = React.createClass({displayName: "FileList",
  getInitialState: function getInitialState() {
    return {
      files: []
    };
  },

  componentDidMount: function() {
    $.get("/posts", function(result) {
      if (this.isMounted()) {
        this.setState({
          files: result
        });
      }
    }.bind(this));
  },

  render: function() {
    var files = this.state.files.map(function(file, index) {
        return React.createElement(PhotoPost, {
          author: 'oliver54321',
          src: '/post/asdf' + index + '.jpg',
          title: 'Boba Fett',
          caption: 'Source: http://imgur.com/a/Cx6ob',
          key: index}); // Size, icon, what else?
    });

    return (
      React.createElement("div", {className: "fileList"}, files)
    );
  }
})

// Make a general post class then embed the specific post inside

var PhotoPost = React.createClass({displayName: "PhotoPost",
  render: function() {
    return (

      React.createElement("div", {className: "post"},

        // React.createElement("div", {className: "avatar"},
          // React.createElement("SVGComponent", {id: "avatar", height: "33", width: "33"},
          //   React.createElement(Rectangle, {
          //   height: "33", width: "33", x: "0", y: "0",
          //   fill: "white"})
          // ),
        // ),

        React.createElement("img", {id: "avatar", src: '/post/avatar.jpg'}),

        React.createElement("div", {className: "content"},
          React.createElement("div", {className: "header"},
            React.createElement("span", null, this.props.author)
          ),
          React.createElement("img", {src: this.props.src}),
          React.createElement("div", {className: "footer"},
            React.createElement("span", null, this.props.caption)
          )
        )
      )
    )
  }

})

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

var Rectangle = React.createClass({displayName: "Rectangle",
    render: function() {
        return React.createElement("rect", React.__spread({},  this.props), this.props.children);
    }
});

React.render(React.createElement(App, null), document.body);
