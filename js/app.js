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
    this.clearTasks = this.clearTasks.bind(this);
    this.exportPipeline = this.exportPipeline.bind(this);
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

  clearTasks(){
    this.setState({tasks:[]});
  }

  exportPipeline(){
    let doc = "contenido";

    //Download the file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
    element.setAttribute('download', 'pipeline.py');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  render() {
    const main_container = e('div', {className: 'container'}, 
        e(TopMenu, {tasks:this.state.tasks, clearTasks:this.clearTasks, exportPipeline:this.exportPipeline}, null),
        e(Workspace, {tasks:this.state.tasks, addTask:this.addTask, removeTask:this.removeTask}, null));
    return main_container;
  }
}

class TopMenu extends React.Component {
  render() {
    const logo = e('a', {className: 'brand-logo center'}, 'Luigi Plumber');
    const control_1 = e('li', null, e('a', {onClick:()=>this.props.exportPipeline()}, 'Export'));
    const control_2 = e('li', null, e('a', {onClick:()=>this.props.clearTasks()}, 'Restart'));
    const controls = e('ul', {id: 'nav-mobile', className: 'left hide-on-med-and-down'}, control_1, control_2);

    return e('nav', null, e('div', {id: 'top-menu', className: 'nav-wrapper teal lighten-2'}, logo, controls));
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
      create_collapsible_element('class', 'Task type', this.props.task.type[0]),
      create_collapsible_element('list', 'Parameters', 'Parameters specific definition'),
      create_collapsible_element('file_upload', 'Outputs', 'Outputs specific definition'),
      create_collapsible_element('done_all', 'Dependencies', 'Dependencies specific definition'),
      create_collapsible_element('link', 'Event hooks', this.props.task.events.map(x=>x[0]).join(' ,')),
      create_collapsible_element('code', 'Body', this.props.task.body)
    ]

    const body = e('ul', {className: 'collapsible'}, ...task_elements);
    const card_content = e('div', {className:'card-content'}, 
        e('span', {className: 'card-title'}, this.props.task.name),
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
  constructor(props){
    super(props);

    this.state = {
      name: '',
      type : '',
      params : '',
      output : '',
      events: [],
      body : ''
    }

    this.updateType = this.updateType.bind(this);
  }

  componentDidMount(){
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems, null);

    elems = document.querySelectorAll('select');
    instances = M.FormSelect.init(elems, null);
  }

  updateType(newclass){
    alert('here')
    this.setState({type:newclass});
  }

  addTask(){
    const type_node = document.getElementById('type-select').selectedOptions[0];
    const type = [type_node.label, type_node.value]
    const events = Array.from(document.getElementById('event-select').selectedOptions).map(opt=>[opt.label, opt.value]);
    
    const task = this.state;
    task['type'] = type;
    task['events'] = events;

    this.props.addTask(this.props.list_index, task)
  }

  render() {
    // Name input
    const name_input = e('div', {className: 'input-field col s6'},
        e('input', {placeholder:"Task name", id:"name", type:"text", className:"validate", onChange:(a)=>this.setState({name:a.target.value})}),
        e('label', {htmlFor: 'name'}, 'Task name'));

    // Task type select
    const type_options = [];

    [['Python Luigi Task', 'luigi.Task'], 
     ['External Luigi Task', 'luigi.contrib.ExternalProgramTask'], 
     ['Docker Luigi Task', 'luigi.contrib.DockerTask']].forEach(option=>{
        type_options.push(e('option', {value: option[1], key:option[0]}, option[0]));
     });

    const type_input = e('div', 
        {className: "input-field col s6"}, 
        e('select', {id: 'type-select'}, ...type_options), 
        e('label', null, 'Task type'))

    // Event hooks input
    const event_options = [e('option', {value:'', 'disabled':true, 'selected':true}, 'Event hooks to be added : ')];

    [['Dpendency discovered', 'luigi.Event.DEPENDENCY_DISCOVERED '], 
     ['Dependency missing', 'luigi.Event.DEPENDENCY_MISSING'], 
     ['Dependency present', 'luigi.Event.DEPENDENCY_PRESENT '],
     ['Broken task', 'luigi.Event.BROKEN_TASK '],
     ['Start', 'luigi.Event.START'],
     ['Progress', 'luigi.Event.PROGRESS '],
     ['Failure', 'luigi.Event.FAILURE'],
     ['Success', 'luigi.Event.SUCCESS'],
     ['Processing time', 'luigi.Event.PROCESSING_TIME'],
     ['Timeout', 'luigi.Event.TIMEOUT'],
     ['Process failure', 'luigi.Event.PROCESS_FAILURE ']

     ].forEach(option=>{
        event_options.push(e('option', {value: option[1], key:option[0]}, option[0]));
     });

    const event_input = e('div', 
        {className: "input-field col s12"}, 
        e('select', {id: 'event-select', multiple:true}, ...event_options), 
        e('label', null, 'Event hooks'))

    // Body input
    const body_input = e('div', {className: 'input-field col s6'},
        e('input', {placeholder:"Task body", id:"body", type:"text", className:"validate", onChange:(a)=>this.setState({body:a.target.value})}),
        e('label', {htmlFor: 'body'}, 'Task body'));

    const body = e('div', {className: 'modal-content'}, 
        e('h4', null, this.state.class),
        name_input,
        type_input,
        event_input,
        body_input
    );

    const footer = e('div', {className: 'modal-footer'}, 
        e('a', 
          {className: 'modal-close waves-effect waves-green btn-flat', href: '#!'}, 
          'Cancel'),
        e('a', 
          {className: 'modal-close waves-effect waves-green btn-flat', href: '#!',
           onClick:()=>this.addTask()}, 
          'Add')
    );

    return e('div', {className: 'modal modal-fixed-footer', id:"task-menu-"+this.props.list_index}, body, footer)
  }
}

