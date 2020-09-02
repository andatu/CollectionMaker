import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { useParams } from "react-router";
import Home from "./Home/home";
import SearchResults from "./Search/searchresults";
import Navbar from "./Navbar/navbar";
import Item from "./Item/Item";
import Details from "./Details/Details";
import Create from "./Create/Create";
import modelInstance from "./data/ColModel";
import Sidebar from "./Sidebar/Sidebar";
import RandomCollection from "./RandomCollection/randomCollection";


class App extends Component {
  constructor(props) {
    super(props);

    // modelInstance
    //   .getItem(372850351323)
    //   .then(response => modelInstance.addToCol(response.Item));
    // modelInstance
    //   .getItem(401790251050)
    //   .then(response => modelInstance.addToCol(response.Item));
    let colCart = JSON.parse(localStorage.getItem("cart"));
    modelInstance.colCart = colCart ? colCart : [];
    this.state={browse:'FALSE'};
  }

  browsing(msg){
    this.setState({browse: msg})
    console.log(this.state.browse)
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
        <Navbar 
        />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <Home browse={this.browsing.bind(this)}/>
                </div>
              )}
            ></Route>
            <Route exact path="/random-generator" render={()=> <RandomCollection/>}></Route>

            <Route exact path="/searchResults"></Route>
            <Route
              exact
              path="/ItemDetails/:itemId"
              render={() => (
                <div>
                  <Item />
                </div>
              )}
            ></Route>

            <Route
              exact
              path="/create"
              render={() => (
                <div>
                  <Create />
                </div>
              )}
            ></Route>
            <Route exact path="/details/:id" render={(props)=> <Details {...props}/>}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
