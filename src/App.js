import { useState, useEffect } from 'react'
import Loader from './components/loader';
import './App.css'

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [userLocation, setUserLocation] = useState({});

  const getProducts = () => {
    fetch('https://fakestoreapi.com/products', { method: 'GET' })
      .then((val) => val.json())
      .then((response) => {
        setProducts(response);
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    getProducts();
    const wathcId = navigator.geolocation.watchPosition((positions) => {
      setUserLocation({
        latitude: positions.coords.latitude,
        longitude: positions.coords.longitude,
      })
    })

    return () => {
      navigator.geolocation.clearWatch(wathcId);
    }
  }, []);

  const handleNavigate = (values) => {
    console.log(values);
    setShowModel(true);
    setProductDetails(values);
  }

  const handleClose = () => {
    setShowModel(false)
    setProductDetails({})
  }

  return (
    <div className='app-container'>
      {loading && <Loader />}
      <div className='app-wrapper'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className='header-wrapper'>
          <h2>Products</h2>
          {Object.keys(userLocation).length ? (
            <div>
              <p> <span style={{ fontWeight: 'bolder' }}>Latitude:</span> {userLocation.latitude}</p>
              <p><span style={{ fontWeight: 'bolder' }}>Longitude:</span> {userLocation.longitude}</p>
            </div>
          ) : null}
        </div>
        <div className='product-wrapper'>
          {
            !loading && products.length ? products.map((val) => {
              return (
                <div key={val.id} className='card' onClick={() => handleNavigate(val)}>
                  <div className='image-container'>
                    <img src={val.image} className='image' />
                  </div>
                  <div style={{ lineHeight: '1.5' }}>
                    <p><span style={{ fontWeight: 'bolder' }}>Title:</span> {val.title}</p>
                    <p><span style={{ fontWeight: 'bolder' }}>Category:</span> {val.category}</p>
                    <p><span style={{ fontWeight: 'bolder' }}>Price:</span> {val.price}</p>
                  </div>
                </div>
              )
            }) : null
          }
        </div>
      </div>
      {
        showModel && (
          <div className='model-wrapper'>
            <div className='model-container'>
              <div className='model-header'>
                <p style={{ fontWeight: 'bolder' }}>{productDetails.title}</p>
                <button className='btn' onClick={handleClose}>X</button>
              </div>
              <div className='product-details-wrapper'>
                <div className='prod-details-image'>
                  <div className='image-wrapper'>
                    <img src={productDetails.image} className='prod-image' />
                  </div>
                </div>
                <div className='prod-details-model'>
                  <p><span style={{ fontWeight: 'bolder' }}>Title:</span>{productDetails.title}</p>
                  <p><span style={{ fontWeight: 'bolder' }}>Category:</span>{productDetails.category}</p>
                  <p><span style={{ fontWeight: 'bolder' }}>Price:</span>${productDetails.price}</p>
                  <p><span style={{ fontWeight: 'bolder' }}>Description:</span>{productDetails.description}</p>
                  <p><span style={{ fontWeight: 'bolder' }}>Rating:</span>{productDetails.rating.rate}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default App
