import React, { PureComponent } from 'react';
import './notepad.css';
import './assets/semantic/dist/semantic.css';
import { Grid, Menu, TextArea, Button, Icon , Segment} from 'semantic-ui-react';
import axios from 'axios';

class Notepad extends PureComponent {

    constructor(props){
        super(props);
        this.state = { activeItem: 1,
                       itemList: [],
                       isLoaded: false}
    }

  componentDidMount(){ 
      axios.get(`http://localhost:4000/notes`).then(res => {
        const data = res.data;     
        this.setState({...this.state, itemList: data, isLoaded: true});
      }).catch(error => {
        console.log(error);
      });  
      
  }  

  handleItemClick = (e, { index }) => {    
    this.setState({...this.state, activeItem: index})    
  }

  handleOnChange = (event) => {
    var list = this.getUpdatedList(event.target.value, this.state.itemList);
    this.setState({...this.state, itemList: list})
    
  }

  getUpdatedList = (text, list) => {
    var tempList = Object.assign([], list);
    tempList[this.state.activeItem -1].context = text;

    return tempList;
  }

  saveOnClick = () => {
    const headers = {
      'Content-Type': 'application/json'
    }    
    const data = this.state.itemList.find(element => {return element.id === this.state.activeItem });
    var context = data.context;
    var noteId = data.id;

    axios.get(`http://localhost:4000/notes/`+noteId).then(res => {
      const data = res.data;
        axios.put('http://localhost:4000/notes/'+noteId, {context}, {headers: headers})
        .catch(error => {
          console.log(error);
        });
    
    }).catch(error => {
      axios.post('http://localhost:4000/notes', {context});
    }); 

    
  }

  addNewNote = () => {
    var size = this.state.itemList.length;
    var newNote = { "id": size+1, "context": ""};
    var list = this.addtoNoteList(newNote, this.state.itemList);
    this.setState({...this.state, itemList: list, activeItem: size+1});
  }

  addtoNoteList = (element, list) => {
    var tempList = Object.assign([], list);
    tempList.push(element);

    return tempList;
  }

  render() {
    const { activeItem } = this.state
    const data = this.state.itemList.find(element => {return element.id === activeItem })      
      

    return (
      <div className="page">
      <Segment textAlign='center' color='blue'>My Notes</Segment>      
      
      <Grid>
        <Grid.Column width={4}>
          <Menu fluid vertical tabular>

            {this.state.itemList.map((element, index) => 
             <Menu.Item
             name={element.context.substr(0,15)}
             index={element.id}
             active={this.state.activeItem === element.id}
             onClick={this.handleItemClick}
           />)}
          </Menu>
          <Button icon onClick={this.addNewNote}>
             <Icon name='plus' />
          </Button>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <TextArea 
            value = { this.state.isLoaded ? data.context : ""}
            onChange = {event => this.handleOnChange(event)}
          />         
        </Grid.Column>        
      </Grid>
      <div className="save-button">
      <Button icon labelPosition='left' onClick= {this.saveOnClick}>
          <Icon name='save' />
            Save
      </Button>
      </div>
      </div>      

    )
  }
}

export default Notepad;
