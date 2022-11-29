import { AppDataSource } from "../../data-source";
import { Request, Response } from "express";
import { request } from "http";

export default class CrossWordController {
  getWord = async (req: Request, res: Response) => {
    const axios = require('axios');

    try {

      /*
      request
      ({
        url: 'https://stdict.korean.go.kr/api/search.do',
        method: 'get',
        params: {
          'key': '285C75717B54083F74D4D67FEF622076',
          'type_search': 'search',
          'req_type':'json',
          'q': req.body.wordtext
        }
        
      }

      response
      channel: {
        total: 1,
        num: 10,
        title: '표준 국어 대사전 개발 지원(Open API) - 사전  검색',
        start: 1,
        description: '표준 국어 대사전 개발 지원(Open API) – 사전 검색 결과',
        item: [Array],
        link: 'https://stdict.korean.go.kr',
        lastbuilddate: '20221127125354'
      }
      */
      await axios.get('https://stdict.korean.go.kr/api/search.do', {params: {
        'key': '285C75717B54083F74D4D67FEF622076',
        'type_search': 'search',
        'req_type':'json',
        'q': req.body.wordtext
        }
      })
      .then(function(response){
        console.log(response.data);
        res.json(response.data);
      })
    }catch(err) {
      console.log(err);
    }
  };
}