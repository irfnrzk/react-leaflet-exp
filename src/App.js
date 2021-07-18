import './App.css';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Rectangle } from 'react-leaflet'
// import MarkerClusterGroup from 'react-leaflet-markercluster'
import axios from 'axios';

function App() {

  const [pin, setPin] = useState([])
  const [bounds, setBounds] = useState([])
  const fetchData = async () => await axios.get('data.json').then(res => res.data)

  const MapComponent = () => {
    const map = useMapEvents({
      load: () => {
        alert(map.getBounds())
      },
      click: () => {
        map.locate()
      },
      zoomend: () => {
        setBounds([
          [map.getBounds()._northEast.lat, map.getBounds()._northEast.lng],
          [map.getBounds()._southWest.lat, map.getBounds()._southWest.lng]
        ])
        setData([
          [map.getBounds()._northEast.lat, map.getBounds()._northEast.lng],
          [map.getBounds()._southWest.lat, map.getBounds()._southWest.lng]
        ])
      },
      dragend: () => {
        setBounds([
          [map.getBounds()._northEast.lat, map.getBounds()._northEast.lng],
          [map.getBounds()._southWest.lat, map.getBounds()._southWest.lng]
        ])
        setData([
          [map.getBounds()._northEast.lat, map.getBounds()._northEast.lng],
          [map.getBounds()._southWest.lat, map.getBounds()._southWest.lng]
        ])
      }
    })

    return (
      // <MarkerClusterGroup>
      <>
        {pin.map(p => (
          <Marker
            key={p.id}
            position={[p.position.lat, p.position.lng]}
          />
        ))}
      </>
      // </MarkerClusterGroup>
    )
  }

  const redColor = {
    stroke: true,
    weight: 10,
    fillColor: false,
    fillOpacity: 0
  }

  const SetBoundsRectangles = () => {
    return (
      <>
        <Rectangle
          bounds={bounds}
          pathOptions={redColor}
        />
        {bounds.map(p => (
          <Marker
            key={p}
            position={[p[0], p[1]]}
          />
        ))}
      </>
    )
  }

  const setData = async (Arr) => {

    const data = await fetchData()

    const localizedData = data.results
      .filter(x =>
        x.position.lat > Arr[1][0]
        && x.position.lat < Arr[0][0]
        && x.position.lng > Arr[1][1]
        && x.position.lng < Arr[0][1]
      )

    console.log(localizedData.slice(0, 50))
    setPin(localizedData.slice(0, 50))

  }

  return (
    <div className="App">
      <MapContainer
        center={
          [
            3.2402139262093717,
            101.69857092648792
          ]
        }
        zoom={10}
        scrollWheelZoom={true}
        whenReady={({ target }) => {

          target.locate().on('locationfound', (e) => {
            console.log(e.latlng)
            target.flyTo(e.latlng, 13);
          })

          setBounds([
            [target.getBounds()._northEast.lat, target.getBounds()._northEast.lng],
            [target.getBounds()._southWest.lat, target.getBounds()._southWest.lng]
          ])

          setData([
            [target.getBounds()._northEast.lat, target.getBounds()._northEast.lng],
            [target.getBounds()._southWest.lat, target.getBounds()._southWest.lng]
          ])

        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapComponent />
        <SetBoundsRectangles />
      </MapContainer>
    </div >
  )
}

export default App
