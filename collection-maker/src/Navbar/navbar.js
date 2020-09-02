import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../stylesheet.css";
import modelInstance from "../data/ColModel";
import SearchResults from "../Search/searchresults";
import Sidebar from "../Sidebar/Sidebar";


class Navbar extends Component {
  //add onEnter to the input: so when you hit enter key => search

  constructor(props) {
    super(props);
    this.state = {
      status: "LISTENING",
      searchDataCol: []
    };
    this.initSearch = this.initSearch.bind(this);
    this.getSearchedItem = this.getSearchedItem.bind(this);
    this.nullifyState = this.nullifyState.bind(this);
  }
  

  initSearch(e) {
    if (this.keyword.value.length <= 0)
      throw "No search value"
    this.setState({
      status: 'LOADING'
    });
    let searchType = this.searchType
      .options[this.searchType.selectedIndex].value;
    if (searchType === "item") {
      this.getSearchedItem();
    } else {
      this.getSearchedCollection();
    }
  }

  getSearchedItem() {
    try {
      modelInstance.getSearchResult(this.keyword.value)
      .then(data => {
        console.log(data);
        this.setState({ searchData: data });
        this.setState({ status: "LOADED" });
        this.setState({ collection: "FALSE" });
        console.log(this.state);
      });
    } catch (e) {
      console.error(e);
    }
  }
 
  getSearchedCollection() {
    console.log('searchdata', this.state.searchDataCol)
    this.setState({searchDataCol:[]})
    // let data = modelInstance.getCollectionResult(searchType);
    // console.log("collection" + data);
    // this.setState({ searchDataCol: data });
    // this.setState({ status: "LOADED" });
    // this.setState({ collection: "TRUE" });
    modelInstance.db
      .collection("collections")
      .where("tags", "array-contains", this.keyword.value.toUpperCase())
      .get()
      .then(snap => {
        snap.forEach(doc => {
          console.log(doc.data());
          this.state.searchDataCol.push(doc.data());
          this.setState({ status: "LOADED" });
          this.setState({ collection: "TRUE" });
        });
      })
      .catch(error =>
        console.log("navbar-getsearchedcollection:", error)
      );
  }

  nullifyState() {
    this.setState({ searchData: "", status: "LISTENING" });
  }
  

  render() {
    console.log(this.state.status);
    console.log("getsearchedcol", this.state.searchDataCol);
    let searchList = null;
    switch (this.state.status) {
      case "LOADING":
        //show loader
        searchList = <em>Loading...</em>;
        break;
      case "LOADED":
        searchList = (
          <div>
            <SearchResults
              nul={this.nullifyState}
              navResult={this.state}
            ></SearchResults>
          </div>
        );
        break;
      case "LISTENING":
      default:
        //searchList = <b>Failure...</b>;
        break;
    }
    return (
      <div>
        <div className="Navbar">
          <div className="Navbar-header">
            <div id="navbarAlign">
              <Link to={"/"} onClick={this.nullifyState}>
                <div className="two">GreatCrate</div>
              </Link>
            </div>
            <form>
            <input
              
              ref={(c) => this.keyword = c}
              type="text"
              placeholder="Search"
              id="sInput"
              size="60"
            />
           

            <span>
              <Link to={"/searchResults"}
              onClick={() => 
                {
                  try { this.initSearch(); }
                  catch(e) {alert(e); throw(e);}
                }}>
                <button
                  className="button sr"
                  id="goToDetails"
                >
                  Search
                </button>
              </Link>
              
            </span>            
            </form>
            <span className='cartHolder'>
            <select ref={(c) => this.searchType = c}>
              <option value="item">Item</option>
              <option value="collection">Collection</option>
            </select>
            
              <label id="cart" htmlFor="toggle">
                <div>&#x1F6D2;</div>
              </label>
            
            <input type="checkbox" id="toggle"></input>
            
            <span className="innerCont">
              <Sidebar nul={this.nullifyState} />
            </span>
            </span>
          </div>
        </div>
        <div className="searchRes">{searchList}</div>
      </div>
    );
  }
}
export default Navbar;
