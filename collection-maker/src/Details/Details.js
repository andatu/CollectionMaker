import React, { Component } from "react";
import Star from "./Star";
import CommentSection from "./CommentSection";
import modelInstance from "../data/ColModel";
import "../Details/carousel.min.css";
var Carousel = require("react-responsive-carousel").Carousel;

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      colId: this.props.match.params.id,
      col: [],
      item: 0,
      simItems: []
    };
    this.changeCarousel = this.changeCarousel.bind(this);
  }

  componentDidMount() {
  
        modelInstance.getCollection(this.state.colId).then( data =>{
          this.state.col.push(data)
           this.setState({ status: "LOADED" })
        }
        )
  }
  changeCarousel(e) {
    this.setState({ item: e.target.getAttribute("datak") });
  }

  firstWords(word, index) {
    let w = this.state.col[0].items[index].Title.split(" ");
    return w[0] + " " + w[2] + "...";
  }
  maxDescChar(desc) {
    if (desc.length > 1000) {
      return desc.substring(0, 1000) + "...";
    } else return desc.substring(0, 1000);
  }
  render() {
    
    
    
    let col = null;
    switch (this.state.status) {
      case "LOADING":
        col = <em>Loading...</em>;
        break;
      case "LOADED":
         modelInstance.getSimilarItems(this.state.col[0].items[this.state.item].ItemID)
        .then(r => {
          this.state.simItems= r.getSimilarItemsResponse.itemRecommendations.item;
           console.log('simm', this.state.simItems)})
       
         
      
        col = (
          <div className="Details">
            

            <div className="itImage">
              <Carousel showArrows={true} >
                {this.state.col[0].items[this.state.item].PictureURL.map(
                  (image, index) => (
                    <div key={index} id="detailsCarousel">
                      <img src={image} alt="itemImg"></img>
                    </div>
                  )
                )}
              </Carousel>
            </div>

            <div className="wrapItems">
              {this.state.col[0].items.map((item, index) => (
                <div>
                  <button
                    key={index}
                    datak={index}
                    className="genItem"
                    onClick={this.changeCarousel}
                  >
                    {this.firstWords(
                      this.state.col[0].items[index].Title,
                      index
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="colItemDetails">
              <h2>Item Description:</h2>
              <h3>{this.state.col[0].items[this.state.item].Title}</h3>
              <p>
                {this.state.col[0].items[this.state.item].CurrentPrice.Value}
                {
                  this.state.col[0].items[this.state.item].CurrentPrice
                    .CurrencyID
                }
              </p>
              <p>
                {this.maxDescChar(
                  this.state.col[0].items[this.state.item].Description
                )}
              </p>
            </div>

            <div className="star">
              <Star id={this.state.colId} />
              
            </div>

            <div className="des" style={{marginRight:'10px'}}>
              <h2>Collection Description</h2>
              {this.state.col[0].description === ""
                ? "the creator did not add any description"
                : this.state.col[0].description}
            </div>
            <div className="comments">
              <CommentSection data={this.state} />
            </div>
          </div>
        );
        break;
      default:
        col = <p>error</p>;
    }

    return col;
  }
}

export default Details;
