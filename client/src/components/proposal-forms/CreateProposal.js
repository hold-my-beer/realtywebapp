import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createProposal } from '../../actions/proposal';
import { v4 as uuidv4 } from 'uuid';
import { YMaps, Map, GeoObject } from 'react-yandex-maps';

const CreateProposal = ({ createProposal, history }) => {
  const [formData, setFormData] = useState({
    dealType: 'Продажа',
    houseYear: '',
    houseType: 'Панельный',
    floors: '',
    elevator: 'Нет',
    floor: '',
    roomsNumber: '',
    totalArea: '',
    livingArea: '',
    kitchenArea: '',
    balcony: 'Нет',
    windows: 'На улицу',
    cooker: 'Электрическая',
    bathroom: 'Совмещенный',
    price: ''
  });

  const [files, setFiles] = useState([]);

  const [previews, setPreviews] = useState([]);

  const [address, setAddress] = useState({
    coords: [],
    province: '',
    locality: '',
    street: '',
    house: '',
    addressLine: '',
    shortAddressLine: '',
    route: '',
    metro: '',
    metroDuration: null,
    district: ''
  });

  const [mapData, setMapData] = useState({
    coordinates: [55.75, 37.57],
    zoom: 9
  });

  const {
    dealType,
    houseYear,
    houseType,
    floors,
    elevator,
    floor,
    roomsNumber,
    totalArea,
    livingArea,
    kitchenArea,
    balcony,
    windows,
    cooker,
    bathroom,
    price
  } = formData;

  const { coordinates, zoom } = mapData;

  const onLoad = ymaps => {
    const suggestView = new ymaps.SuggestView('addressLine');

    suggestView.events.add('select', e => {
      const selectedAddress = e.get('item').value;

      ymaps.geocode(selectedAddress, { results: 1, json: true }).then(
        res => {
          const geoObject = res.GeoObjectCollection.featureMember[0].GeoObject;
          const resAddress =
            geoObject.metaDataProperty.GeocoderMetaData.Address;

          if (resAddress.country_code !== 'RU') {
            console.log(
              'Приложением не предусмотрена регистрация объектов, находящихся вне территории Российской Федерации'
            );
          } else {
            const address = {};
            const coordinates = geoObject.Point.pos;
            const space = coordinates.indexOf(' ');
            const coords = [
              parseFloat(coordinates.substring(space + 1)),
              parseFloat(coordinates.substring(0, space))
            ];
            address.coords = coords;

            let provinceCounter = 0;
            resAddress.Components.forEach(component => {
              switch (component.kind) {
                case 'province':
                  if (provinceCounter === 0) {
                    provinceCounter++;
                  } else {
                    address.province = component.name;
                  }
                  break;
                case 'locality':
                  address.locality = component.name;
                  break;
                case 'street':
                  address.street = component.name;
                  break;
                case 'house':
                  address.house = component.name;
                  break;
                default:
                  break;
              }
            });

            address.addressLine = selectedAddress;
            address.shortAddressLine =
              address.locality +
              ', ' +
              (address.street ? address.street + ', ' : '') +
              address.house;

            ymaps
              .geocode(coords, {
                results: 1,
                kind: 'metro',
                json: true
              })
              .then(result => {
                const featureMember = result.GeoObjectCollection.featureMember;
                if (featureMember.length > 0) {
                  const metroAddress =
                    featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData
                      .Address;
                  const metroCoordinates = featureMember[0].GeoObject.Point.pos;
                  const space = metroCoordinates.indexOf(' ');
                  const coords = [
                    parseFloat(metroCoordinates.substring(space + 1)),
                    parseFloat(metroCoordinates.substring(0, space))
                  ];
                  const metroCoords = coords;
                  metroAddress.Components.forEach(component => {
                    switch (component.kind) {
                      case 'route':
                        address.route = component.name;
                        break;
                      case 'metro':
                        address.metro = component.name;
                        break;
                      default:
                        break;
                    }
                  });

                  const modes = ['auto', 'masstransit', 'pedestrian'];
                  const metroDuration = {};

                  for (let mode of modes) {
                    const multiRoute = new ymaps.multiRouter.MultiRoute({
                      referencePoints: [address.coords, metroCoords],
                      params: { routingMode: mode }
                    });
                    multiRoute.model.events.add('requestsuccess', () => {
                      metroDuration[
                        mode
                      ] = multiRoute
                        .getActiveRoute()
                        .properties.get('duration');
                    });
                  }

                  address.metroDuration = metroDuration;
                }
              });

            ymaps
              .geocode(coords, {
                results: 1,
                kind: 'district',
                json: true
              })
              .then(result => {
                const featureMember = result.GeoObjectCollection.featureMember;
                if (featureMember.length > 0) {
                  const districtAddress =
                    featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData
                      .Address;
                  let districtSet = false;
                  districtAddress.Components.forEach(component => {
                    switch (component.kind) {
                      case 'district':
                        if (!districtSet) {
                          address.district = component.name;
                          districtSet = true;
                        }
                        break;
                      default:
                        break;
                    }
                  });
                }
              });

            setAddress(address);

            setMapData({
              ...mapData,
              coordinates: address.coords,
              zoom: 17
            });
          }
        },
        err => console.error(err)
      );
    });
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onUploadChange = e => {
    const filesToAdd = Array.from(e.target.files).filter(fileItem => {
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === fileItem.name) {
          return false;
        }
      }

      return true;
    });

    const previewsToAdd = [];
    filesToAdd.forEach(file => {
      const id = uuidv4();
      const url = URL.createObjectURL(file);

      const preview = {
        photoID: id,
        photoURL: url,
        fileName: file.name
      };

      previewsToAdd.push(preview);
    });

    setFiles([...files, ...filesToAdd]);

    setPreviews([...previews, ...previewsToAdd]);
  };

  const onImageLoad = preview => {
    if (preview.photoURL.startsWith('blob')) {
      URL.revokeObjectURL(preview.photoURL);
    }
  };

  const onDeletePhotoClick = previewToDelete => {
    setFiles([...files.filter(file => file.name !== previewToDelete.fileName)]);

    setPreviews([
      ...previews.filter(preview => preview.photoID !== previewToDelete.photoID)
    ]);
  };

  const onAddressChange = e => {
    setAddress({ ...address, addressLine: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    createProposal(formData, address, files, history);
  };

  return (
    <Fragment>
      <button className="btn btn-light" onClick={history.goBack}>
        Назад
      </button>
      <h1 className="text-primary my-1">Создание предложения</h1>
      <p className="lead">Создайте предложение по объекту недвижимости</p>
      <div>
        <div className="form-group deal-type">
          <label htmlFor="dealType">Продаю / Сдаю</label>
          <select
            className="select-css"
            name="dealType"
            id="dealType"
            value={dealType}
            onChange={e => onChange(e)}
          >
            <option value="Продажа">Продажа</option>
            <option value="Аренда">Аренда</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="addressLine">Выберите адрес дома</label>
          <input
            type="text"
            id="addressLine"
            name="addressLine"
            value={address.addressLine}
            placeholder="Начните набирать адрес..."
            onChange={e => onAddressChange(e)}
          />
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
              modules={['SuggestView', 'geocode', 'multiRouter.MultiRoute']}
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
        <div className="appartment-parameters">
          <div className="house-year">
            <label htmlFor="houseYear">Год постройки дома</label>
            <input
              type="number"
              id="houseYear"
              name="houseYear"
              value={houseYear}
              placeholder="Год постройки..."
              min="1900"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="house-type">
            <label htmlFor="house-type">Тип дома</label>
            <select
              className="select-css"
              name="houseType"
              id="houseType"
              value={houseType}
              onChange={e => onChange(e)}
            >
              <option value="Панельный">Панельный</option>
              <option value="Блочный">Блочный</option>
              <option value="Кирпичный">Кирпичный</option>
              <option value="Монолит">Монолит</option>
            </select>
          </div>
          <div className="floors">
            <label htmlFor="floors">Этажность дома</label>
            <input
              type="number"
              id="floors"
              name="floors"
              value={floors}
              placeholder="Этажность дома..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="elevator">
            <label htmlFor="elevator">Лифт</label>
            <select
              name="elevator"
              id="elevator"
              value={elevator}
              onChange={e => onChange(e)}
            >
              <option value="Нет">Нет</option>
              <option value="Пассажирский">Пассажирский</option>
              <option value="Пассажирский и грузовой">
                Пассажирский и грузовой
              </option>
            </select>
          </div>

          <div className="floor">
            <label htmlFor="floor">Этаж</label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={floor}
              placeholder="Введите этаж..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="rooms-number">
            <label htmlFor="roomsNumber">Количество комнат</label>
            <input
              type="number"
              id="roomsNumber"
              name="roomsNumber"
              value={roomsNumber}
              placeholder="Количество комнат..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>

          <div className="total-area">
            <label htmlFor="totalArea">Общая площадь</label>
            <input
              type="number"
              id="totalArea"
              name="totalArea"
              value={totalArea}
              placeholder="Общая площадь..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="living-area">
            <label htmlFor="livingArea">Жилая площадь</label>
            <input
              type="number"
              id="livingArea"
              name="livingArea"
              value={livingArea}
              placeholder="Жилая площадь..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="kitchen-area">
            <label htmlFor="kitchenArea">Площадь кухни</label>
            <input
              type="number"
              id="kitchenArea"
              name="kitchenArea"
              value={kitchenArea}
              placeholder="Площадь кухни..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="balcony">
            <label htmlFor="balcony">Балкон</label>
            <select
              className="select-css"
              name="balcony"
              id="balcony"
              value={balcony}
              onChange={e => onChange(e)}
            >
              <option value="Нет">Нет</option>
              <option value="Один">Один</option>
              <option value="Два и более">Два и более</option>
            </select>
          </div>
          <div className="windows">
            <label htmlFor="windows">Окна выходят</label>
            <select
              className="select-css"
              name="windows"
              id="windows"
              value={windows}
              onChange={e => onChange(e)}
            >
              <option value="На улицу">На улицу</option>
              <option value="Во двор">Во двор</option>
              <option value="На улицу и во двор">На улицу и во двор</option>
            </select>
          </div>
          <div className="cooker">
            <label htmlFor="cooker">Плита</label>
            <select
              className="select-css"
              name="cooker"
              id="cooker"
              value={cooker}
              onChange={e => onChange(e)}
            >
              <option value="Электрическая">Электрическая</option>
              <option value="Газовая">Газовая</option>
            </select>
          </div>
          <div className="bathroom">
            <label htmlFor="bathroom">Санузел</label>
            <select
              className="select-css"
              name="bathroom"
              id="bathroom"
              value={bathroom}
              onChange={e => onChange(e)}
            >
              <option value="Совмещенный">Совмещенный</option>
              <option value="Раздельный">Раздельный</option>
              <option value="Два и более">Два и более</option>
            </select>
          </div>
          <div className="price">
            <label htmlFor="price">Стоимость, руб.</label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              placeholder="Укажите стоимость..."
              min="0"
              onChange={e => onChange(e)}
            />
          </div>
          <div className="empty"></div>
        </div>
        <div className="create-proposal-photos">
          {previews.map(preview => (
            <div key={preview.photoID} className="create-proposal-photo">
              <img
                src={preview.photoURL}
                alt=""
                onLoad={() => onImageLoad(preview)}
              />
              <i
                className="far fa-times-circle fa-2x"
                onClick={() => onDeletePhotoClick(preview)}
              ></i>
            </div>
          ))}
        </div>
        <label
          htmlFor="proposal-photos-upload"
          className="btn btn-light btn-block"
        >
          Загрузить фото
        </label>
        <input
          id="proposal-photos-upload"
          type="file"
          onChange={e => onUploadChange(e)}
          multiple
        />
        <input
          type="submit"
          className="btn btn-primary btn-block"
          value="Создать предложение"
          onClick={e => onSubmit(e)}
        />
      </div>
    </Fragment>
  );
};

CreateProposal.propTypes = {
  createProposal: PropTypes.func.isRequired,
  proposal: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  proposal: state.proposal
});

export default connect(mapStateToProps, {
  createProposal
})(withRouter(CreateProposal));
