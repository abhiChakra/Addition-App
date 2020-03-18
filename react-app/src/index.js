import React from 'react';
import ReactDOM from 'react-dom';
import AdditionApp from './App';
import * as serviceWorker from './serviceWorker';

// Rendering our AdditionApp at the index.html <div> section of id 'root'.
// Hosted via Nginx Web server.
ReactDOM.render(<AdditionApp />, document.getElementById('root'));

serviceWorker.unregister();
