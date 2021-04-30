import React, { useRef } from "react";
import Unsplash, { toJson } from "unsplash-js";
import { useHistory } from "react-router-dom";

let unsplash = new Unsplash({accessKey: ""});

const UserLogin = () => {
  const token = useRef(null);
  let history = useHistory();

  function checkLogin(e){
    e.preventDefault();
    unsplash = new Unsplash({accessKey: token.current.value});
    unsplash.search.photos(token.current.value).then(toJson).then((json) => { 
      if (typeof(json.errors) != "undefined"){
        if(json.errors[0].indexOf("invalid")>-1) {
          alert('access token invalid : try again')
         }
      }
       else{
        history.push({pathname: "/SearchPhotos",state: { detail: token.current.value }})
       }
    });

}

return (
  <>
  <form className="form" onSubmit={checkLogin}>
      <div>
        <h1>Login with accessKey</h1>
        <div>
            <input type="text" className={'input wt100'} ref={token} />
            <button className={`button fixtop`}>login</button>
        </div>
      </div>
  </form>
  </>
  )
}

export default UserLogin;

