import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <Router />
  </RecoilRoot>
);


