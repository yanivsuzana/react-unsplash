import React, { useState , useRef } from "react";
import Unsplash, { toJson } from "unsplash-js";
import { useHistory } from "react-router-dom";

let unsplash = new Unsplash({accessKey: ""});
const PhotoSet = new Set()

 function SearchPhotos(props) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [itemsPhotos, setPhotoList] = useState([]);
  const searchValue = useRef(null);
  let history = useHistory();

   if (typeof(props.location.state) != "undefined"){
            unsplash._accessKey=props.location.state.detail;
  }  
  
  function performSearchWithValue(val){
    searchValue.current.value=val;
    performSearch()
  }

  function performSearch(){
    unsplash.search.photos(searchValue.current.value).then(toJson).then((json) => {
        if (typeof(json.errors) != "undefined"){
          if(json.errors[0].indexOf("invalid")>-1) {
            alert('access token invalid : please login')
           }
        }
         else{
            if(PhotoSet.size<=4){
                PhotoSet.add(searchValue.current.value)
                console.log(Array.from(PhotoSet))
                localStorage.setItem('PhotoSetList', Array.from(PhotoSet));
                let temp=localStorage.getItem('PhotoSetList');
                temp=temp.split(',')
                setPhotoList(temp);
            }
            setResult(json.results);
         }
      });
    }

  function logout(){
    unsplash = new Unsplash({
      accessKey: "",
    });
    history.push({pathname: "/" })
  }

  return ( 
    <>
    <div className="photoscreen">
      <h1>Search for photos on any topic</h1>
      <div className="toright">
              <button  className="button" onClick={() => logout()}>
              {(unsplash._accessKey=="") ? 'Log in' : 'Log out'}
            </button>
      </div>
      <form onSubmit={e => {e.preventDefault();setQuery(search);}}>
        <input type="text" className="input" placeholder="Please type any topic" ref={searchValue} />
        <input type="submit" value="search" className="button left10" onClick={() => performSearch()}/>
      </form>
      <div className="photolist">
          <ul> 
             {itemsPhotos.map((itm) => (
                 <li key={itm} onClick={() => performSearchWithValue(itm)} >
                     {itm}
                 </li>
             ))}
        </ul>
        </div>
      <div className="card-list">
        {result.map((result) => (
          <div className="card" key={result.id} >
            <img className="card--image" alt={result.alt_description} src={result.urls.small}></img>
          </div>
        ))}
      </div>
    </div>
  );
    </>
  );
}

export default SearchPhotos