import ObservableModel from "./ObservableModel";
import { API_KEY } from "./apiConfig";
import { PROXY } from "./apiConfig";
import "firebase/firestore";
import app from "../Firebase";
class ColModel extends ObservableModel {
  constructor() {
    super();
    this.colCart = [];
    this.avg = null;
    //database: firestore
    this.db = app.firestore();
    this.db.settings({ timestampsInSnapshots: true });
    this.comments=[]
  }

  getSearchResult(keyword, sortBy) {
    let url =
      `${PROXY}http://svcs.ebay.com/services/search/FindingService/v1` +
      `?OPERATION-NAME=findItemsByKeywords` +
      `&SECURITY-APPNAME=${API_KEY}` +
      `&SERVICE-VERSION=1.0.0` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&itemFilter.name=HideDuplicateItems` +
      `&itemFilter.value=true` +
      `&paginationInput.entriesPerPage=24`;
    /* kvar: error om inte category id existerar.. fixar senare
    if (keyword === "") {
      let catId = Math.floor(Math.random() * 9000) + 20;
      url = `${PROXY}http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=${API_KEY}&OPERATION-NAME=findItemsByCategory&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&categoryId=${catId}&paginationInput.entriesPerPage=24`;
    }*/
    if (keyword !== undefined && keyword !== "") {
      url += `&keywords=${keyword}`;
    } else {
      throw "No keywords used";
    }
    let res = fetch(url, {
      method: "GET"
    })
    .then(response => {
      return this.processResponse(response);
    })
    .then(response => {
      if (response.hasOwnProperty("findItemsByKeywordsResponse"))
        return response;
      throw "Invalid result: " + response;
    })
    .catch(error => {
      throw error;
    });
    return res;
  }

  async randomItem(categories, minprice = 0, maxprice = 0) {
    let currency = "USD";
    if (categories.length <= 0)
      throw "No categories specified";
    if (categories[0] === undefined)
      throw "Category is undefined";
    if ((minprice.toFixed(1) > 0 && maxprice.toFixed(1) > 0 && maxprice < minprice)) {
      throw `Price range doesn't make sense: ${minprice}-${maxprice}`;
    }
    if(minprice.toFixed(1) < 0 || maxprice.toFixed(1) < 0) {
      throw "Price range parameters have to be positive or 0";
    }
    let pageNum = Math.floor(Math.random() * 50) + 1;
    let itemNum = Math.floor(Math.random() * 20);
    let url = `${PROXY}http://svcs.ebay.com/services/search/FindingService/v1` +
      `?OPERATION-NAME=findItemsByKeywords` +
      `&SECURITY-APPNAME=${API_KEY}` +
      `&SERVICE-VERSION=1.0.0` +
      `&RESPONSE-DATA-FORMAT=JSON` +
      `&REST-PAYLOAD` +
      `&paginationInput.entriesPerPage=20` +
      `&paginationInput.pageNumber=${pageNum}` +
      `&itemFilter(0).name=HideDuplicateItems` +
      `&itemFilter(0).value=true`;
    let filterIndex = 1;
    if (minprice > 0) {
      url += `&itemFilter(${filterIndex}).name=MinPrice`;
      url += `&itemFilter(${filterIndex}).value=${minprice}`;
      url += `&itemFilter(${filterIndex}).paramName=Currency`;
      url += `&itemFilter(${filterIndex}).paramValue=${currency}`;
      filterIndex++;
    }
    if (maxprice > 0) {
      url += `&itemFilter(${filterIndex}).name=MaxPrice`;
      url += `&itemFilter(${filterIndex}).value=${maxprice}`;
      url += `&itemFilter(${filterIndex}).paramName=Currency`;
      url += `&itemFilter(${filterIndex}).paramValue=${currency}`;
      filterIndex++;
    }
    categories.map((cat) => {
      url += `&keywords=${cat}`;
    });
    console.log(url);
    let res = fetch(url, {
      method: "GET"
    })
    .then(response => {
        return this.processResponse(response);
    })
    .then(response => {
      if (response.hasOwnProperty("findItemsByKeywordsResponse"))
        return response.findItemsByKeywordsResponse[0].searchResult[0].item[itemNum].itemId;
      throw "Invalid result: " + response;
    })
    .then(id => {
      try {
        return this.getItem(id);
      }
      catch(e) {
        console.error(e);
        throw e;
      }
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
    return res;
  }

  getCollectionResult(searchType) {
    return this.collections.filter(
      collection => collection.title === searchType
    );
  }

  getItem(itemId) {
    let url =
      `${PROXY}https://open.api.ebay.com/shopping?callname=GetSingleItem` +
      `&responseencoding=JSON` +
      `&appid=${API_KEY}` +
      `&siteid=0` +
      `&version=967` +
      `&IncludeSelector=Details,Description,TextDescription`;
    if (itemId !== undefined) {
      url += `&ItemID=${itemId}`;
    } else {
      throw "No item id";
    }
    return fetch(url)
    .then(this.processResponse)
    .catch(error => {
      console.error(error);
      throw error;
    });
  }

  getSimilarItems(itemId){
    // this.getItem(itemId).then(r=>console.log('getitem',r))
    let url = `${PROXY}http://svcs.ebay.com/MerchandisingService?` +
    `OPERATION-NAME=getSimilarItems&` +
    `SERVICE-NAME=MerchandisingService&` +
    `SERVICE-VERSION=1.1.0&` +
    `CONSUMER-ID=${API_KEY}` +
    `&RESPONSE-DATA-FORMAT=JSON&` +
    `REST-PAYLOAD&` +
    `itemId=${itemId}` +
    `&maxResults=3`;
    if (itemId == undefined) {
     
      throw "No item id";
    }
    
    
    return fetch(url).then(this.processResponse)
    
    
  }

  getTotalPrice() {
    return this.colCart.reduce(
      (sum, item) => (sum += item.CurrentPrice.Value),
      0
    );
  }

  addToCol(item) {
    this.colCart.push(item);
    this.notifyObservers({ type: "cart", data: this.getColCart() });
    localStorage.setItem("cart", JSON.stringify(this.getColCart()));
    console.log(this.colCart[0].Title);
  }

  removeItemFromCol(itemId) {
    console.log("delete");
    this.colCart.splice(
      this.colCart.findIndex(item => item.ItemID === itemId, 1),
      1
    );
    this.notifyObservers({ type: "cart", data: this.getColCart() });
    localStorage.setItem("cart", JSON.stringify(this.getColCart()));
  }

  clearCol() {
    this.colCart = [];
    this.notifyObservers({ type: "cart", data: this.getColCart() });
    localStorage.setItem("cart", JSON.stringify(this.getColCart()));
  }

  getColCart() {
    return this.colCart;
  }

  //FireBase kod:
  addComment(name, comment, id) {
    this.db.collection("CommentList").add({
      Name: name,
      Comment: comment,
      id: id
    });
  }
  updateRating(id, one, two, three, four, five, count, avg) {
    this.db
      .collection("Rating")
      .doc(id)
      .set({
        one: one,
        two: two,
        three: three,
        four: four,
        five: five,
        count: count,
        avg: avg,
        id: id
      });
  }

   getRating(id){
    const docRef= this.db.collection("Rating").doc(id);
    console.log('data star', docRef);
    let data= docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data())
        return doc.data();
        console.log('data star avg', this.avg.avg); 
      } else {
        // doc.data() will be undefined in this case
        return 'not rated yet';
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
    return data;
  }

  getCollection(id){

    const docRef = this.db
    .collection("collections")
    .doc(id);
  let data = docRef
    .get()
    .then(doc => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        // data = doc.data();
        // this.state.col.push(data);
        // this.setState({ status: "LOADED" });
        return doc.data()
        console.log("data", this.state.col);
      } else {
        console.log("No such document!");
      }
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
    return data;
  }
  gettopCols(){
    const docRef = this.db.collection("collections");
    let cols = docRef.get().then((data)=> {
      data.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          return doc.data
      });
    });
    return cols;
  }

  // subToComments(list){
    

  //   list.onSnapshot((snap) =>  {  
      
  //     let changes=snap.docChanges();
      
  //     changes.map((change)=> {
  //        this.comments.push(change.doc.data()) 
         
  //     })
       
  //   })
     
  //    this.notifyObservers({ type: "comments", data: this.comments});
  // }
 

  addRatingInfo(obj){ this.avg=obj; }


  getColDetails(id) {
    //     const docRef = this.db.collection("collections").doc(id);
    //       let data = null;
    //       docRef.get().then(function(doc) {
    //     if (doc.exists) {
    //         console.log("Document data:", doc.data())
    //         data= doc.data();
    //         console.log('data', data)
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //     }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });
  }

  newCollection(title, description, tags, colId) {
    if(title.length <= 0) {
      throw "Title is missing.";
    }
    if (this.colCart.length <= 0) {
      throw "Collections can't be empty";
    }
    this.db
      .collection("collections")
      .doc(colId)
      .set({
        items: this.colCart,
        title: title,
        description: description,
        tags: tags,
        id: colId
      })
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
      this.clearCol();
  }

  processResponse(response) {
    if (response.ok) {
      return response.json();
    }
    throw response;
  }
}
const modelInstance = new ColModel();
export default modelInstance;
//
// // var a = new ColModel();
// // a.getSearchResult("toy");
// // a.getItem(401988483046).then(item => {
// //   a.addToCol(item.Item);
// //   console.log(item);
// //   console.log("Item added");
// //   console.log(a.colCart);
// //   a.removeItemFromCol("401988483046");
// //   console.log(a.colCart);
// // });
