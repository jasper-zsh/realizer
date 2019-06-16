import React from 'react';
import Layout from '@icedesign/layout';
import Aside from './components/aside/Aside';
import logo from './logo.svg';
import '@alifd/next/index.scss';
import '@icedesign/layout/lib/index.scss';
import '@icedesign/notification/lib/index.scss';
import './App.css';

function App() {
  return (
      <Layout>
          <Layout.Section>
              <Layout.Aside>
                  <Aside/>
              </Layout.Aside>
              <Layout.Main>
                  <h1>Main</h1>
              </Layout.Main>
          </Layout.Section>
      </Layout>
  );
}

export default App;
