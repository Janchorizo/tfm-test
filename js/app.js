window.onload = function(){
    console.log('hola')
    ReactDOM.render(
      e(App, null, null),
      document.getElementById('root')
    );
}

const e = React.createElement; 

class App extends React.Component {
  render() {
    const main_container = e('div', {className: 'container'}, 'hi');
    return main_container;
  }
}

class TopMenu extends React.Component {
  render() {
    //return <div>Hello {this.props.toWhat}</div>;
  }
}