import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [products, setProducts] = useState([]);

  const key = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

  const endpoint = `${domain}/api/2025-01/graphql.json`
  console.log('Endpoint:', endpoint);
  console.log('Access token:', key);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': key
          },
          body: JSON.stringify({
            query: `#graphql
                    query products {
                      products(first: 9, after: "eyJsYXN0X2lkIjo5MzU0NDAzMTg0OTY3LCJsYXN0X3ZhbHVlIjo5MzU0NDAzMTg0OTY3fQ==") {
                        edges {
                          cursor
                          node {
                            id
                            title
                            description
                            tags
                            images(first: 10) {
                              edges {
                                node {
                                  id
                                  url
                                }
                              }
                            }
                          }
                        }
                      }
                    }`
          })
        });
        const data = await response.json();
        console.log('Data:', data.data.products.edges);

        setProducts(data.data.products.edges);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className='list'>
        {
          products && products.map((product: any) => (
            <div key={product.node.id} className="card">
              <img className='image' src={product.node.images.edges[0]?.node.url} alt={product.node.title} />
              <h2>{product.node.title}</h2>
              <p>{product.node.description}</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
