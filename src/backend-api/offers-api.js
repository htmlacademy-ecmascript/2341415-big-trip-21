import {asyncronize} from '../utils.js';
import {offers} from '../mock/fake-data.js';

export default class OffersApi {

  /**
    @returns Promise<[
      {
        "type": "taxi",
        "offers": [
          {
            "id": "b4c3e4e6-9053-42ce-b747-e281314baa31",
            "title": "Upgrade to a business class",
            "price": 120
          }
        ]
      }
    ]>
   */
  getList() {
    return asyncronize(offers);
  }
}
