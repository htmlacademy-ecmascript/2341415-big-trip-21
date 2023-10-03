import {getRequest, checkRequestStatus } from '../utils.js';

export default class DestinationApi {

  /**
   * @returns Promise<[
   *   {
   *     "id": "cfe416cq-10xa-ye10-8077-2fs9a01edcab",
   *     "description": "Chamonix, is a beautiful city, a true asian pearl, with crowded streets.",
   *     "name": "Chamonix",
   *     "pictures": [
   *       {
   *         "src": "http://picsum.photos/300/200?r=0.0762563005163317",
   *         "description": "Chamonix parliament building"
   *       }
   *     ]
   *   }
   * ]>
   */
  getList() {
    return getRequest('destinations')
      .then((response) => {
        checkRequestStatus(response.status, 200);
        return response.json();
      });
  }
}
