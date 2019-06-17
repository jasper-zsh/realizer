import React from 'react';
import Layout from '@icedesign/layout';
import { Tab } from '@alifd/next';
import logo from './logo.svg';
import '@alifd/next/index.scss';
import '@icedesign/layout/lib/index.scss';
import '@icedesign/notification/lib/index.scss';
import './App.css';

import Aside from './components/aside/Aside';
import LaserTab from './tabs/LaserTab/LaserTab';

function App() {
  return (
      <Layout>
          <Layout.Section>
              <Layout.Aside>
                  <Aside/>
              </Layout.Aside>
              <Layout.Main>
                  <Tab>
                      <Tab.Item title="激光雕刻">
                        <LaserTab/>
                      </Tab.Item>
                  </Tab>
              </Layout.Main>
          </Layout.Section>
      </Layout>
  );
}

export default App;
