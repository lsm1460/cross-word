import { Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import APIResponse from '../../utils/APIResponse';
import Create from '../entity/Create';
import Participation from '../entity/Participation';
const _ = require('lodash');

export default class CrossWordController {
  getWord = async (req: Request, res: Response) => {
    const axios = require('axios');

    try {
      // request
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

      // response
      // channel: {
      //   total: 1,
      //   num: 10,
      //   title: '표준 국어 대사전 개발 지원(Open API) - 사전  검색',
      //   start: 1,
      //   description: '표준 국어 대사전 개발 지원(Open API) – 사전 검색 결과',
      //   item: [Array],
      //   link: 'https://stdict.korean.go.kr',
      //   lastbuilddate: '20221127125354'
      // }

      await axios
        .get('https://stdict.korean.go.kr/api/search.do', {
          params: {
            key: '285C75717B54083F74D4D67FEF622076',
            type_search: 'search',
            req_type: 'json',
            q: req.query.wordtext,
          },
        })
        .then(function (response) {
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          throw error;
        });
    } catch (err) {
      res.status(400).json(err);
    }
  };

  saveGame = async (req: Request, res: Response) => {
    const info = {
      nickname: req.body.nickname,
      board: JSON.stringify(req.body.board),
      gameData: JSON.stringify(req.body.gameData),
    };

    try {
      const createRepo = AppDataSource.getRepository(Create);
      const createData = createRepo.create(info);

      const result = await createRepo.save(createData);

      return res.status(200).json({ id: result.id });
    } catch (err) {
      return res.status(400).json(new APIResponse(null, 'Fail to create game', 400, err));
    }
  };

  getGameList = async (req: Request, res: Response) => {
    const { page, per_page } = req.query;
    const _p = parseInt(page.toString(), 10);
    const _pp = parseInt(per_page.toString(), 10);

    try {
      const createRepo = AppDataSource.getRepository(Create);
      const [list, total] = await createRepo
        .createQueryBuilder('create')
        .select(['create.id', 'create.nickname', 'create.createdAt'])
        .offset(Math.max(_p - 1, 0) * _pp)
        .limit(_pp)
        .getManyAndCount();

      return res.status(200).json({ list, total });
    } catch (err) {
      return res.status(400).json(new APIResponse(null, 'Fail to get game list', 400, err));
    }
  };

  getGame = async (req: Request, res: Response) => {
    const { id } = req.query;
    const _id = parseInt(id.toString(), 10);

    try {
      const createRepo = AppDataSource.getRepository(Create);
      const makerData = await createRepo.createQueryBuilder('create').where('create.id = :id', { id: _id }).getOne();

      if (!makerData) {
        throw 'no data';
      }

      const hideBoardData = _.mapValues(makerData, (_val, _key) => {
        if (_key === 'board') {
          return JSON.stringify(
            _.map(JSON.parse(_val), (_line) => _.map(_line, (_word) => (_word.trim() ? null : _word)))
          );
        }

        return _val;
      });

      return res.status(200).json(hideBoardData);
    } catch (err) {
      console.log(err);
      return res.status(400).json(new APIResponse(null, 'Fail to get game', 400, err));
    }
  };

  saveParticipation = async (req: Request, res: Response) => {
    const { id, playDuration, nickname, board } = req.body;

    try {
      const createRepo = AppDataSource.getRepository(Create);
      const boardData = await createRepo
        .createQueryBuilder('create')
        .select(['create.board'])
        .where('create.id = :id', { id })
        .getOne();

      const _check = _.isEqual(JSON.parse(boardData.board), board);

      if (!_check) {
        return res.status(200).json(0);
      }

      const info = {
        nickname,
        contentId: parseInt(id, 10),
        playDuration,
      };

      const participationRepo = AppDataSource.getRepository(Participation);
      const createData = participationRepo.create(info);

      await participationRepo.save(createData);

      return res.status(200).json(1);
    } catch (err) {
      console.log(err);
      return res.status(400).json(new APIResponse(null, 'Fail to save participation data', 400, err));
    }
  };
}
