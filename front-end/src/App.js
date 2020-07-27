import React from 'react';
import DocumentTitle from 'react-document-title';

import Routes from './Routes';

function App() {
  return (
    <DocumentTitle title='Budgeter'>
      <Routes />
    </DocumentTitle>
  );
}

export default App;