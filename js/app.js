window.onload = function(){
    console.log('hola')
    ReactDOM.render(
      e(App, null, null),
      document.getElementById('root')
    );
}

const e = React.createElement; 

class App extends React.Component {
  constructor(params){
    super(params);
    this.state = {
      tasks : []
    };

    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }

  addTask(list_index, task){
    this.setState(prevState=>{
      if(prevState.tasks.length == list_index)
        prevState.tasks.push([task])
      else
        prevState.tasks[list_index].push(task)

      return prevState;
    })
  }

  removeTask(list_index, task_index){
    this.setState(prevState=>{
      if(task_index == 0)
        prevState.tasks[list_index].splice(task_index, task_index+1);
      else
        prevState.tasks[list_index].splice(task_index, task_index);
      if(prevState.tasks[list_index].length == 0)
        prevState.tasks.splice(list_index, list_index);

      return prevState;
    })
  }

  render() {
    const main_container = e('div', {className: 'container'}, 
        e(TopMenu, {tasks:this.state.tasks}, null),
        e(Workspace, {tasks:this.state.tasks, addTask:this.addTask, removeTask:this.removeTask}, null));
    return main_container;
  }
}

class TopMenu extends React.Component {
  render() {
    const top_bar = e('div', {className: 'col s12'}, 'TopMenu');
    const control_1 = e('div', {className: 'col s4'}, 'c1');
    const control_2 = e('div', {className: 'col s4'}, 'c2');
    const control_3 = e('div', {className: 'col s4'}, 'c3');

    return e('div', {id: 'top-menu', className: 'row teal lighten-2'}, 
        top_bar, control_1, control_2, control_3)
  }
}

class Workspace extends React.Component {
  componentDidUpdate(){
    const tasks = document.getElementsByClassName('task');
    if(tasks.length > 0){
      Array.from(document.getElementsByClassName('new-column-button'))
        .forEach(btn=>btn.style['margin-top'] = tasks[0].clientHeight/2 + 'px');
    }
  }

  render() {
    const lists = this.props.tasks.map((list, i)=>e(TaskList, {list:list, list_index:i, addTask:this.props.addTask, removeTask:this.props.removeTask}, null));

    const task_menu_opener = e('a', 
      { className: 'new-column-button waves-effect waves-light btn-floating modal-trigger', 
        "href":"#task-menu-"+this.props.tasks.length}, 
        e('i', {className: 'material-icons'}, 'add'));

    const task_menu = e(TaskMenu, {list_index: this.props.tasks.length, addTask:this.props.addTask}, null);

    return e('div', {id: 'workspace'}, 
        e('div', {id: 'lists', className: 'row row-full'}, ...lists, task_menu_opener, task_menu));
  }
}

class TaskList extends React.Component {
  render() {
    const tasks = this.props.list.map((task, i)=>e(Task, 
        {task:task, list_index: this.props.list_index, task_index: i, removeTask: this.props.removeTask}, 
        null));

    const task_menu = e(TaskMenu, {list_index: this.props.list_index, addTask:this.props.addTask}, null);

    const task_menu_opener = e('a', 
      { className: 'waves-effect waves-light btn-floating modal-trigger', 
        "href":"#task-menu-"+this.props.list_index}, 
        e('i', {className: 'material-icons'}, 'add'));

    return e('div', {className: 'col s3 list'}, ...tasks, task_menu, task_menu_opener)
  }
}

class Task extends React.Component {
  componentDidMount(){
    const elems = document.querySelectorAll('.collapsible');
    const instances = M.Collapsible.init(elems, null);
  }

  render() {
    const create_collapsible_element = (icon, title, text) => e('li', null, 
        e('div', {className: 'collapsible-header'}, e('i', {className:"material-icons"}, icon), title),
        e('div', {className: 'collapsible-body'}, e('span', null, text))
      )

    const task_elements = [
      create_collapsible_element('class', 'Task type', 'Task type specific definition'),
      create_collapsible_element('list', 'Parameters', 'Parameters specific definition'),
      create_collapsible_element('file_upload', 'Outputs', 'Outputs specific definition'),
      create_collapsible_element('done_all', 'Dependencies', 'Dependencies specific definition'),
      create_collapsible_element('link', 'Event hooks', 'Event hooks specific definition'),
      create_collapsible_element('code', 'Body', 'Body specific definition')
    ]

    const body = e('ul', {className: 'collapsible'}, ...task_elements);
    const card_content = e('div', {className:'card-content'}, 
        e('span', {className: 'card-title'}, 'Task'),
        body)
    const card_action = e('div', 
        {className: 'card-action'},
        e('a', 
            {onClick:()=>this.props.removeTask(this.props.list_index, this.props.task_index),
              href:'#'},
            'Delete Task'));

    return e('div', {className: 'card task'}, card_content, card_action)
  }
}

class TaskMenu extends React.Component {
  componentDidMount(){
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, null);
  }

  render() {
    const body = e('div', {className: 'modal-content'}, 
        e('h4', null, 'Header'),
        e('p', null, 'bodyyyyyy')
    );

    const footer = e('div', {className: 'modal-footer'}, 
        e('a', 
          {className: 'modal-close waves-effect waves-green btn-flat', href: '#!'}, 
          'Cancel'),
        e('a', 
          {className: 'modal-close waves-effect waves-green btn-flat', href: '#!',
           onClick:()=>this.props.addTask(this.props.list_index, {a:'a'})}, 
          'Add')
    );

    return e('div', {className: 'modal modal-fixed-footer', id:"task-menu-"+this.props.list_index}, body, footer)
  }
}