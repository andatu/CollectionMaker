import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../stylesheet.css";
import modelInstance from "../data/ColModel";

class RandomCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.generate = this.generate.bind(this);
  }

  generate() {
    let cats = [];
    Array.from(this.categories.options).map(opt => {
      if (opt.selected) cats.push(opt.value); 
    });
    console.log(parseFloat(this.minPrice.value));
    console.log(parseFloat(this.maxPrice.value));
    try {
      for (var i = parseInt(this.quantity.value) - 1; i >= 0; i--) {
        modelInstance.randomItem(cats,
          parseFloat(this.minPrice.value),
          parseFloat(this.maxPrice.value))
        .then(data => {
          modelInstance.addToCol(data.Item);
        });
      }
    }
    catch(e) {
      console.error(e);
    }
  }

  render() {
    let item = (
      <div>
        <div className="rcgHeaderHolder">
          <h2>Random Collection Genereator</h2>
        </div>
        <select ref={(c) => this.categories = c} multiple>
          <option value="animals">Animals</option>
          <option value="vehicles">Vehicles</option>
          <option value="outdoors">Outdoors</option>
          <option value="home">Home</option>
          <option value="electronics">Electronics</option>
          <option value="computer">Computer</option>
          <option value="paintings">Paintings</option>
          <option value="sextoys">Sex Toys</option>
        </select>
        <div>How many items?</div>
        <div>
          <input
            id="rcgItemCount"
            type="number"
            name="quantity"
            placeholder="1"
            min="1"
            max="10"
            style={{marginBottom:'5px'}} 
            ref={(c) => this.quantity = c}
          />
        </div>
        <div>
          Price range
        </div>
        <div>
          <input type="number" name="minPrice" min="0" style={{marginBottom:'5px'}} ref={(c) => this.minPrice = c}/>
          to
          <input type="number" name="maxPrice" min="0" style={{marginBottom:'5px'}} ref={(c) => this.maxPrice = c}/>
        </div>
        <div className="rcgBtnHolder">
          <Link to="/create">
            <button className="buttonRand" onClick={this.generate}>
              Add to your collection!
            </button>
          </Link>
        </div>
      </div>
    );
    return item;
  }
}

export default RandomCollection;
