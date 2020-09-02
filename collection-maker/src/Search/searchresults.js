import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../stylesheet.css";
import modelInstance from "../data/ColModel";

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "NOSEARCH"
    };
  }

  componentDidMount() {
    //modelInstance.addObserver(this);
  }

  componentWillUnmount() {
    this.setState({
      status: "NOSEARCH"
    })
    //modelInstance.removeObserver(this);
  }

  update(model, changeDetails) {
    if (changeDetails.type === "collections") {
      this.setState({ collections: changeDetails.data });
    }
  }

  render() {
    let results = null;
    // const {
    //   //destructuring
    //   item
    // } = this.props.navResult.searchData.findItemsByKeywordsResponse[0].searchResult[0];
    let { item } = 0;
    if (this.props.navResult.collection === "FALSE") {
      if (
        this.props.navResult.searchData.findItemsByKeywordsResponse !==
        undefined
      ) {
        item = this.props.navResult.searchData.findItemsByKeywordsResponse[0]
          .searchResult[0].item;
      } else if (
        this.props.navResult.searchData.findItemsByCategoryResponse !==
        undefined
      ) {
        item = this.props.navResult.searchData.findItemsByCategoryResponse[0]
          .searchResult[0].item;
      }
    }
    if (
      this.props.navResult.status === "LOADED" &&
      this.props.navResult.collection === "FALSE"
    ) {
      if (item.length <= 0) {
        results = <em>No results</em>;
      } else {
        results = item.map(items => (
          <Link
            to={"/ItemDetails/" + items.itemId[0]}
            key={items.itemId[0]}
            onClick={this.props.nul}
          >
            <img
              className="searchImg"
              src={items.galleryURL[0]}
              alt="item img"
            ></img>
            <p>{items.title[0]}</p>
          </Link>
        ));
      }} else if (
        this.props.navResult.status === "LOADED" &&
        this.props.navResult.collection === "TRUE"
      ) {
        if ( this.props.navResult.searchDataCol.length <= 0 ) {
          results = <em>No results</em>;
        } else {
          results = this.props.navResult.searchDataCol.map(c => (
            <Link to={"/details/" + c.id} onClick={this.props.nul}>
              <h2>{c.title}</h2>
            </Link>
          ));
        }
    }
    return (
      <div className="SearchResults">
        <ul className="resultContainer">{results}</ul>
      </div>
    );
  }
}

export default SearchResults;
