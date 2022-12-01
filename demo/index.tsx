import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom/client';

import Demo from './ui';

const App = () => {
  return <Demo />;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
