import React, {Component} from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

class CommentSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: []
    };
  }

  render() {
    return (
      <div className="Comments">
          <h2>
             Comment Section:
          </h2>
        <div>
          <div>
            <h6>what do you think of this collection? discuss below!</h6>
            <CommentForm data={this.props.data}/>
          </div>
          <div>
             comments posted by others:
            <CommentList data={this.props.data}/>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentSection;
