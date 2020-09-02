import React, { Component } from "react";
import app from '../Firebase';
import modelInstance from '../data/ColModel';



class CommentList extends Component{
  constructor(props){
    super(props);
    this.state={
      comments:[],
      status: 'LOADING',
      id :this.props.data.colId,
    }
  }

  componentDidMount(){
    // modelInstance.addObserver(this);
    
    // const db = app.firestore();
  //  db.collection('CommentList').get().then((snapshot) =>{
  //     snapshot.docs.forEach((doc) => (
  //       this.state.comments.push(doc)
  //     ))
  //     this.setState({status: 'LOADED'})
  //   });
  //     console.log('comments',this.state.comments)
  //real-time listener:

      
      
      modelInstance.db.collection('CommentList').where("id",'==',this.state.id)
      .onSnapshot((snap) =>  {
        console.log('detailsid',this.state.id )
        let changes=snap.docChanges();
        changes.map((change)=> {
           this.state.comments.push(change.doc) 
           this.setState({status: 'LOADED'})
        })
      })
      console.log('comms',this.state.comments)
     
     
      
      console.log('modelsatete',this.state.comments)
     
    
  }

  // update(model, changeDetails) {
  //   console.log('updating')
  //   if (changeDetails.type == "comments") {
  //     this.setState({ comments: changeDetails.data });
  //     this.setState({status: 'LOADED'})
  //   }
  // }

  render(){


    let list=null;
    switch (this.state.status) {
      case 'LOADING':
        list = <em>be the first to comment!</em>;
        break;
        case 'LOADED':
          console.log('loadedcomments',this.state.comments)
        list =(
          this.state.comments.map((com)=>(
          
          <div style={{borderLeft:'solid black'}} data-id={com.id} >
            <p style={{background: 'white', maxWidth:'390px'}}>{com.data().Name}</p>
          <textarea  rows="4" cols="50" readOnly>{com.data().Comment}</textarea>
          </div>
        )));
        break;
      default:

    list=  <em>Error</em>;
    break;

    }

  return list;
  }

}

export default CommentList;
