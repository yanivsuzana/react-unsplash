import React, { useState , useEffect , useRef } from "react";
import Unsplash, { toJson } from "unsplash-js";
import { useHistory } from "react-router-dom";

let unSplash = new Unsplash({accessKey: ""});
const photoSet = new Set()

 function SearchPhotos(props) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const arrayStatePhotos = () => ((localStorage.getItem('PhotoSetList')!=null) ? localStorage.getItem('PhotoSetList').split(',') : []);
  const [itemsPhotos, setPhotoList] = useState(arrayStatePhotos);
  const searchValue = useRef(null);
  let history = useHistory();

  useEffect(() => {
    let tempItems=(localStorage.getItem('PhotoSetList')!=null) ? localStorage.getItem('PhotoSetList').split(',') : [];
    tempItems.forEach(element => photoSet.add(element))
  });

  if (typeof(props.location.state) != "undefined"){
    unSplash._accessKey=props.location.state.detail;
  }  
  
  function performSearchWithValue(val){
    searchValue.current.value=val;
    performSearch()
  }

  function performSearch(){
    unSplash.search.photos(searchValue.current.value).then(toJson).then((json) => {
        if (typeof(json.errors) != "undefined"){
          if(json.errors[0].indexOf("invalid")>-1) {
            alert('access token invalid : please login')
           }
        }
         else{
            if(photoSet.size<=4){
                photoSet.add(searchValue.current.value)
                localStorage.setItem('PhotoSetList', Array.from(photoSet));
                setPhotoList(localStorage.getItem('PhotoSetList').split(','));
            }
            setResult(json.results);
         }
      });
    }

  function logout(){
    unSplash = new Unsplash({
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
              {(unSplash._accessKey=="") ? 'Log in' : 'Log out'}
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
