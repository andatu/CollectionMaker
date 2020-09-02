import React, { Component } from "react";
//import { Link } from 'react-router-dom';
import "../stylesheet.css";
import modelInstance from "../data/ColModel";
import { withRouter } from "react-router";
var Carousel = require("react-responsive-carousel").Carousel;

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      id: this.props.match.params.itemId
    };
    this.mounted = undefined;
    console.log("item constr");
  }

  getItemDetails() {
    modelInstance.getItem(this.props.match.params.itemId)
    .then(response => {
      if (this.mounted) {
        console.log(response);
        this.setState({
          item: response.Item,
          itemDes: response.Item.Description,
          status: "LOADED"
        });
      }
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.getItemDetails();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    console.log("item render");
    let item = null;

    switch (this.state.status) {
      case "LOADING":
        item = <em>Loading...</em>;
        break;
      case "LOADED":
        item = (
          <div className="Item">
            <div className="itempic">
              <Carousel showArrows={true}>
                {this.state.item.PictureURL.map((image, index) => (
                  <div className="" key={index}>
                    <img src={image} alt="itemImg"></img>
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="itemdesc">
              <h2>{this.state.item.Title}</h2>
              <p>{this.state.item.Description}</p>
            </div>

            <div className="price">
              <div>
                <h2>
                  {this.state.item.CurrentPrice.Value}{" "}
                  {this.state.item.CurrentPrice.CurrencyID}
                </h2>
              </div>

              <button
                className="genItem"
                onClick={() => modelInstance.addToCol(this.state.item)}
              >
                Add to collection
              </button>
              {
                // <button onClick={()=>modelInstance.addToCol(this.state.item)}>add to collection!</button>
              }
            </div>
          </div>
        );
        break;
      default:
        item = <p>Error occured</p>;
    }
    return item;
  }
}
export default withRouter(Item);
