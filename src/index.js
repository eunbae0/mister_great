import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import { RecoilRoot } from 'recoil';
import './index.css';

import PageContainer from './components/common/pageContainer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <PageContainer>
      <Router />
    </PageContainer>
  </RecoilRoot>
);


