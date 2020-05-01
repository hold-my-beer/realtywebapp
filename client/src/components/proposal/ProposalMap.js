import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { YMaps, Map, GeoObject } from 'react-yandex-maps';

const ProposalMap = ({ address }) => {
  const [mapData, setMapData] = useState({
    coordinates: [55.75, 37.57],
    zoom: 9
  });

  const { coordinates, zoom } = mapData;

  const onLoad = ymaps => {
    ymaps.geocode(address, { results: 1 }).then(res => {
      setMapData({
        ...mapData,
        coordinates: res.geoObjects.get(0).geometry._coordinates,
        zoom: 16
      });
    });
  };

  return (
    <div>
      <YMaps
        query={{
          apikey: 'c5dd7fd1-79ed-417f-898a-81cf2b2a7bc0'
        }}
      >
        <Map
          state={{
            center: coordinates,
            zoom: zoom
          }}
          className="map"
          onLoad={ymaps => onLoad(ymaps)}
          modules={['geocode']}
        >
          <GeoObject
            geometry={{
              type: 'Point',
              coordinates: coordinates
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
  address: PropTypes.string.isRequired
};

export default ProposalMap;
