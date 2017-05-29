import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-12" style={{textAlign: "center"}}>
        <h1 style={{margin: "0 0 2rem", padding: "0"}}>Page Not Found</h1>
        <img src="img/404.png" style={{minWidth: "240px", width: "50%", maxWidth: "480px"}} />
      </div>
    </div>
  );
};

export default NotFoundPage;
