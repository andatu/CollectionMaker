import React, { Component } from "react";


import modelInstance from "../data/ColModel";

export default class CommentForm extends Component {
    constructor(props){
      super(props);
      this.state={
        Name: "",
        Comment: '',
        id: this.props.data.colId,
      }
    }

    addComment(e){
      e.preventDefault();
      modelInstance.addComment(this.state.Name, this.state.Comment, this.state.id)

      
      /* this is for when i figure out how to use the correct name for the socument
      const commentRef = db.doc('doc-name');
      commentRef.set({
        Name: this.state.Name,
        Comment: this.state.Comment
      })
      */
    }

  render() {
      console.log('commentform',this.state.id)
    return (
      <div>
        <form method="post" >
          <div>
            <input
              placeholder="your name please"
              type="text"
              onChange={(e)=>this.setState({Name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <textarea rows="4" cols="50"
              placeholder="so, what do you think of this collection?"
              onChange={(e)=>this.setState({Comment: e.target.value})}
            />
          </div>


          <div >
            <button  onClick={this.addComment.bind(this)}>
              Comment
            </button>
          </div>
        </form>
      </div>
    );
  }
}
