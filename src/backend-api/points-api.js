import {createPoint, getRequest, checkRequestStatus} from '../utils.js';
import {HOST, AUTH_HEADERS} from '../const.js';

export default class PointsApi {

  /**
     @returns [
        {
          "id": "f4b62099-293f-4c3d-a702-94eec4a2808c",
          "base_price": 1100,
          "date_from": "2019-07-10T22:55:56.845Z",
          "date_to": "2019-07-11T11:22:13.375Z",
          "destination": "bfa5cb75-a1fe-4b77-a83c-0e528e910e04",
          "is_favorite": false,
          "offers": [
            "b4c3e4e6-9053-42ce-b747-e281314baa31"
          ],
          "type": "taxi"
        }
      ]
   */
  getList() {
    return getRequest('points')
      .then((response) => {
        checkRequestStatus(response.status, 200);
        return response.json();
      })
      .then((pointParams) => pointParams.map((params) => createPoint(params)));
  }

  addPoint(pointParams) {
    return fetch(
      `${HOST}/points`,
      {
        method: 'POST',
        headers: {
          ...AUTH_HEADERS,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointParams),
      }
    ).then((response) => {
      checkRequestStatus(response.status, 201);
      return response.json();
    })
      .then((body) => createPoint(body));
  }

  deletePoint(id) {
    return fetch(
      `${HOST}/points/${id}`,
      {
        method: 'DELETE',
        headers: AUTH_HEADERS,
      }
    ).then((response) => {
      checkRequestStatus(response.status, 204);
    });
  }

  updatePoint(pointParams) {
    return fetch(
      `${HOST}/points/${pointParams.id}`,
      {
        method: 'PUT',
        headers: {
          ...AUTH_HEADERS,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointParams),
      }
    ).then((response) => {
      checkRequestStatus(response.status, 200);
      return response.json();
    })
      .then((body) => createPoint(body));
  }
}
