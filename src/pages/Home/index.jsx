import React from 'react';

function Home() {
  return (
      <div className="govuk-body">
        <h1>Home</h1>
      <p>I am the Home page. Please feel free to check out <a id="create-record" className="govuk-link" href="/create-record">Record creation</a>.</p>
      </div>
  );
}

export default Home;
