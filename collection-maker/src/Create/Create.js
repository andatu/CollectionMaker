import React, { Component } from "react";
import modelInstance from "../data/ColModel";
import { Link } from "react-router-dom";
import "../Details/carousel.min.css";
var Carousel = require("react-responsive-carousel").Carousel;

class Create extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { colCart: modelInstance.getColCart() };
    this.render();
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }

  update(model, changeDetails) {
    if (changeDetails.type === "cart") {
      this.setState({ colCart: changeDetails.data });
    }
  }
  //fixa så vi kommer till första sidan eller collection details när man skapat klart sin collection
  onSubmit(e) {
    e.preventDefault();
    
    let title = this.title.value;
    let titleToTag = title.toUpperCase().split(' ');
    let description = this.description.value;
    let tags = this.tags.value.toUpperCase().split(",");
    tags = tags.concat(titleToTag);
    if (tags.length === 0) {
      tags = [];
    }
    let colId = this.makeID();
    try {
      modelInstance.newCollection(title, description, tags, colId.toString());
    } catch (e) {
      console.error(e);
    }
  }

  makeID() {
    console.log("makeID");
    let id = Math.floor(Math.random() * 10000);
    /*return modelInstance.getCollection(id.toString())
    .then(res => {
      if (res !== undefined) {
      	return this.makeID();
      } else {
      	return id;
      }
    });*/
    return id;
  }

  render() {
    let item = (
      <div className="Create">
        <div className="CreateTitle">
          <input
            type="text"
            placeholder="Collection Name"
            defaultValue="New Collection"
            className="CreateName"
            ref={c => (this.title = c)}
          />
        </div>
        <div className="CreateItems">
          <Carousel showArrows={true} className="CreateCarousel">
            {this.state.colCart.map((item, index) => (
              <div className="CarouselImage" key={index}>
                <img src={item.PictureURL[0]} alt="itemImg"></img>
              </div>
            ))}
          </Carousel>
          <div className="CreateList">
            {this.state.colCart.map((item, index) => (
              <div className="CreateListItem" key={index}>
                <div className="CreateListImgWrap">
                  <img src={item.PictureURL} alt="item img"></img>
                </div>
                <div className="CreateListTxtWrap">
                  <p>{item.Title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="CreateDetails">
          <textarea
            placeholder="Description"
            className="CreateDescription"
            ref={c => (this.description = c)}
          />
          <input
            type="text"
            placeholder="Separate tags with ','"
            className="CreateTags"
            ref={c => (this.tags = c)}
          />
        </div>
        <div className="CreateDone">
          <Link to={"/"}>
            <button
              className="button cr"
              id="CreateButton"
              onClick={this.onSubmit}
            >
              {" "}
              Create this Collection
            </button>
          </Link>
        </div>
      </div>
    );
    return <div>{item}</div>;
  }
}
export default Create;
