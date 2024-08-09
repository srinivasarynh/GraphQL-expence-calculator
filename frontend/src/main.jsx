import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import GridBackground from './components/GridBackground.jsx'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import App from './App.jsx'
import './index.css'


const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
  credentials: "include"
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>,
      </GridBackground>
    </BrowserRouter>
  </StrictMode>,
)
