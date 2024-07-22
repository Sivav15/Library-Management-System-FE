import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './app/store.js';
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>

        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
)
