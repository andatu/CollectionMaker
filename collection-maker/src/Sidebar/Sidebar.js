import React, { Component } from "react";
import { Link } from "react-router-dom";
//import '../stylesheet.css';
import modelInstance from "../data/ColModel";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      colCart: modelInstance.getColCart()
    };
  }

  componentDidMount() {
    // modelInstance
    //   .getItem(163902821127)
    //   .then(response => modelInstance.addToCol(response.Item))
    //   .then(items => {
    //     this.setState({ status: "LOADED" });
    //   })
    //   .catch(
    //     this.setState({
    //       status: "ERROR"
    //     })
    //   );
    modelInstance.addObserver(this);
    this.setState({ status: "LOADED" });
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }

  update(model, changeDetails) {
    if (changeDetails.type === "cart") {
      this.setState({ colCart: changeDetails.data });
    }
  }

  removeFromCol(itemID) {
    modelInstance.removeItemFromCol(itemID);
  }

  render() {
    let sidebar = null;
    switch (this.state.status) {
      case "LOADING":
        sidebar = (
          <div>
            <em>The cart is empty</em>
          </div>
        );
        break;
      case "LOADED":
      default:
        sidebar = (
          <div className="Sidebar">
            <div>
              {" "}
              <span>Items to add to collection:</span>
              <br />
              {this.state.colCart.map((item, index) => (
                <div className="sbar" key={index}>
                  <Link to={"/ItemDetails/" + item.ItemID}>
                    <button
                      onClick={this.props.nul}
                      className="sButtons"
                      id="left"
                    >
                      {item.Title}
                    </button>
                  </Link>
                  <output id="right">
                    <p>{item.CurrentPrice.Value}</p>
                    <button
                      className="delBtn"
                      onClick={() => this.removeFromCol(item.ItemID)}
                    >
                      x
                    </button>
                  </output>
                </div>
              ))}
            </div>
            <div>Total cost: {Math.round(modelInstance.getTotalPrice())}</div>
            <Link to="/create">
              <button className="sButtons" onClick={this.props.nul}>
                Review and create collection
              </button>
            </Link>
          </div>
        );
        break;
    }
    return sidebar;
  }
}
export default Sidebar;
