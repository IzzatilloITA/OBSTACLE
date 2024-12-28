import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Helmet } from 'react-helmet';
import Ilogo from './img/Group-16.png'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Helmet>
      <title>OBSTACLE by ZIM</title>
      {/* Убедитесь, что путь правильный */}
      <link rel="icon" href={Ilogo} type="image/png" />
      <meta name="description" content="ZIM Ziyadullayev Izzatillo Murodillayevich здесь всё обо мне и о моих разработках" />
      <meta name="keywords" content="React, Html, разработка, сайт, Css" />
    </Helmet>
    <App />
  </StrictMode>
);
