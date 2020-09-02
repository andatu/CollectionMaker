import React, {Component} from 'react';
import StarRatingComponent from 'react-star-rating-component';
import modelInstance from '../data/ColModel';

class Star extends Component{
  constructor(props){
    super(props);

    this.state={
      rating: 1,
      count: 0,
      oneS:0,
      twoS:0,
      threeS:0,
      fourS:0,
      fiveS:0,
      id: this.props.id
      
    };
  }
  componentDidMount(){
     let data=modelInstance.getRating(this.state.id);
     data.then(doc =>{
       if (doc == 'not rated yet'){
     this.setState({rating: 0})
     this.setState({oneS: 0})
     this.setState({twoS: 0})
     this.setState({threeS: 0})
     this.setState({fourS: 0})
     this.setState({fiveS: 0})
     this.setState({count: 0})
       }else{
        this.setState({rating: doc.avg})
        this.setState({oneS: doc.one})
        this.setState({twoS: doc.two})
        this.setState({threeS: doc.three})
        this.setState({fourS: doc.four})
        this.setState({fiveS: doc.five})
        this.setState({count: doc.count})
       }
     }
     )
     
    
    
  }
 
//   getRating(id){
//    const docRef= modelInstance.db.collection("Rating").doc(id);
//    console.log('data star', docRef);
//      docRef.get().then((doc) => {
//    if (doc.exists) {
//       //  console.log("Document data:", doc.data())

//       //  console.log('data star avg', this.state.rating);
      
//    } else {
//        // doc.data() will be undefined in this case
//        console.log("No such document!");
//    }
// }).catch((error) => {
//    console.log("Error getting document:", error);
// });
  
// console.log('data star after', docRef);

//  }

  onStarClick(newVal, lastVal, name){
    
    if(newVal == 1){  this.setState({rate: this.state.oneS ++})}else 
    if(newVal == 2){  this.setState({rate: this.state.twoS ++})} else 
    if(newVal == 3){  this.setState({rate: this.state.threeS ++})} else 
    if(newVal == 4){  this.setState({rate: this.state.fourS ++})} else 
    if(newVal == 5){  this.setState({rate: this.state.fiveS ++}) }
    this.setState({rating: newVal})
    this.setState({count: ++this.state.count})
    this.calcStar()
  }
  calcStar(){
    let sum= (this.state.oneS *1) + (this.state.twoS *2) + (this.state.threeS * 3) + (this.state.fourS *4)
              + (this.state.fiveS * 5);
    let avg = sum/this.state.count;
    console.log('avg',avg)
    modelInstance.updateRating(this.state.id, this.state.oneS, this.state.twoS, this.state.threeS, 
      this.state.fourS, this.state.fiveS, this.state.count, avg )
  }
  render(){
    const {rating} = this.state;
    console.log('startest', this.state.oneS, this.state.twoS, this.state.threeS, 
    this.state.fourS, this.state.fiveS, this.state.count);
    return(
      <div>
        <h3>Rating of this Collection:</h3>
        <StarRatingComponent
          name='rating'
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        />
  <p >average rating: {this.state.rating.toFixed(2)} stars, rated {this.state.count} times</p>
      </div>
    );
  }
}

export default Star;
