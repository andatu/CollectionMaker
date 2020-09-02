import React, { Component } from "react";
import { Link } from "react-router-dom";
import modelInstance from "../data/ColModel";

class Home extends Component {
  constructor(props){
    super(props);
    this.state={
      data:[]
    }
  }
  componentDidMount(){
    modelInstance.db.collection("collections").get().then((querySnapshot)=> {
      querySnapshot.forEach((doc)=> {
          // doc.data() is never undefined for query doc snapshots
          this.state.data.push(doc.data())
          console.log('collectionsdata', this.state.data)
      });
  });
  }
  getCollections(){
   
  }

sendData=()=>{this.props.browse('TRUE')}
  
  render() {
    
    return (
      <div className="Home">
        <div className="gc" >
          <h2>Welcome to GreatCrate! </h2>
          <p>This webapp is for those of you who like to group items together for 
            others to see, rate comment maybe even buy? An example of a collection you could Make
            would be maybe a winter outfit, a toolbox, your favorite staples or just random items.
            All the items you can find here are from ebay. </p>
          <p>Here you can: </p>
            <ul>
            <li>Search for items.</li>
            <li>Make your very own collection consisting of items.</li>
            <li>Browse existing collections.</li>
            </ul>
         
        </div>
        <div className="try">
          <Link to={"/random-generator"}>
            <button className="home-button">
              Try our random collection generator
            </button>
          </Link>
        </div>
        <div className="browse">
        
        <button className="home-button" onClick={()=>this.sendData()} >Browse collections</button>
        
          
        </div>

        <div className="topcollections">
        <h2>some of our collections, generated with our random generator:</h2>
          {
            this.state.data.map((col)=>
            <Link to={'/details/'+ col.id}>
          <button className="top-button">{col.title}</button>
            </Link>
            )
          }
        </div>
      </div>
    );
  }
}
export default Home;
/*
   
          <button className="top-button">Col 1</button>
          <button className="top-button">Col 2</button>
          <button className="top-button">Col 3</button>
          <button className="top-button">Col 4</button>
*/