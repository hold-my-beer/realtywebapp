import React from 'react';
import PropTypes from 'prop-types';
import { YMaps, Map, GeoObject } from 'react-yandex-maps';

const ProposalMap = ({ coords }) => {
  // const [mapData, setMapData] = useState({
  //   coordinates: coords,
  //   zoom: 9
  // });

  // const { coordinates, zoom } = mapData;

  // const onLoad = ymaps => {
  //   ymaps.geocode(coords, { results: 1 }).then(res => {
  //     setMapData({
  //       // ...mapData,
  //       // coordinates: res.geoObjects.get(0).geometry._coordinates,
  //       coordinates: coords,
  //       zoom: 16
  //     });
  //   });
  // };

  return (
    <div>
      <YMaps
        query={{
          apikey: 'c5dd7fd1-79ed-417f-898a-81cf2b2a7bc0'
        }}
      >
        <Map
          state={{
            // center: coordinates,
            // zoom: zoom
            center: coords,
            zoom: 16
          }}
          className="map"
          // onLoad={ymaps => onLoad(ymaps)}
          modules={['geocode']}
        >
          <GeoObject
            geometry={{
              type: 'Point',
              // coordinates: coordinates
              coordinates: coords,
              zoom: 16
            }}
            options={{
              preset: 'islands#blueHomeCircleIcon'
            }}
          />
        </Map>
      </YMaps>
    </div>
  );
};

ProposalMap.propTypes = {
  coords: PropTypes.array.isRequired
};

export default ProposalMap;
