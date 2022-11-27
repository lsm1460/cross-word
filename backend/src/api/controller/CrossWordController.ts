import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";

export default class CrossWordController {
  getWord = async (req: Request, res: Response) => {
    // let info = {
    //   Word: req.body.wordtext,
    // };
console.log('1');
    const axios = require('axios');

    try {

      // ({
      //   url: 'https://stdict.korean.go.kr/api/search.do',
      //   method: 'get',
        // params: {
        //   'key': '285C75717B54083F74D4D67FEF622076',
        //   'type_search': 'search',
        //   'req_type':'json',
        //   'q': req.body.wordtext
        // }
        
      // }
      axios.get('https://stdict.korean.go.kr/api/search.do', {params: {
        'key': '285C75717B54083F74D4D67FEF622076',
        'type_search': 'search',
        'req_type':'json',
        'q': req.body.wordtext
        }
      })
      .then(function(res){

        // return res;
        console.log(res);
      })
    }catch(err) {
      console.log(err);
    }
  };
}