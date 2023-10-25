import classNames from 'classnames/bind';
import styles from './flowTabs.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartVariableItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction, setSceneOrderAction } from '@/reducers/contentWizard/mainDocument';
import { getRandomId } from '@/src/utils/content';
import _ from 'lodash';
import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { makeNewRoot } from '../flowChart/utils';

function FlowTabs() {
  const dispatch = useDispatch();

  const { sceneOrder, flowScene, flowItems, flowItemsPos } = useSelector(
    (state: RootState) => ({
      sceneOrder: state.mainDocument.sceneOrder,
      flowScene: state.mainDocument.contentDocument.scene,
      flowItems: state.mainDocument.contentDocument.items,
      flowItemsPos: state.mainDocument.contentDocument.itemsPos,
    }),
    shallowEqual
  );

  const sceneList = useMemo(
    () =>
      Object.keys(flowScene)
        .map((_key, _i) => ({ id: _key, name: `scene-${_i + 1}`, order: flowScene[_key].order }))
        .sort((a, b) => a.order - b.order),
    [flowScene]
  );

  const selectScene = (_sceneOrder: number) => {
    dispatch(setSceneOrderAction(_sceneOrder));
  };

  const handleAddScene = () => {
    const _sceneId = getRandomId();

    const newSceneOrder = Object.keys(flowScene).length + 1;
    const newRootBlock = makeNewRoot(newSceneOrder);

    const operations = [
      {
        key: `items`,
        value: {
          ...flowItems,
          [newRootBlock.id]: newRootBlock,
        },
      },
      {
        key: 'itemsPos',
        value: {
          ...flowItemsPos,
          [newRootBlock.id]: {
            [_sceneId]: {
              left: 24,
              top: 57,
            },
          },
        },
      },
      {
        key: 'scene',
        value: {
          ...flowScene,
          [_sceneId]: {
            name: `scene-${newSceneOrder}`,
            itemIds: [newRootBlock.id],
            order: newSceneOrder,
          },
        },
      },
    ];

    dispatch(setDocumentValueAction(operations));

    dispatch(setSceneOrderAction(newSceneOrder));
  };

  const removeScene = (_sceneId: string) => {
    if (
      !confirm(
        '삭제하시겠습니까?\n해당 장면에 포함된 블록들이 모두 지워집니다. 해당 장면에서 생성한 글로벌 변수는 변수 패널에서도 확인할 수 있습니다.'
      )
    ) {
      return;
    }

    const deleteItemIdList = flowScene[_sceneId].itemIds.filter(
      (_itemId) =>
        flowItems[_itemId].elType !== ChartItemType.variable ||
        (flowItems[_itemId].elType === ChartItemType.variable && (flowItems[_itemId] as ChartVariableItem).sceneId)
    );

    let newItemPoses = _.pickBy(flowItemsPos, (_pos, _itemId) => !deleteItemIdList.includes(_itemId));
    newItemPoses = _.mapValues(newItemPoses, (_pos) => _.pickBy(_pos, (__pos, __sceneId) => __sceneId !== _sceneId));

    const operations = [
      {
        key: `items`,
        value: _.pickBy(flowItems, (_item) => !deleteItemIdList.includes(_item.id)),
      },
      {
        key: 'itemsPos',
        value: newItemPoses,
      },
      {
        key: 'scene',
        value: _.pickBy(flowScene, (_scene, __sceneId) => __sceneId !== _sceneId),
      },
    ];

    // 순서를 먼저 변경하고 삭제과정 처리 진행
    dispatch(setSceneOrderAction(Math.max(1, sceneOrder - 1)));

    dispatch(setDocumentValueAction(operations));
  };

  const setList = (
    _list: {
      id: string;
      name: string;
      chosen?: boolean;
    }[]
  ) => {
    let isChanged = false;

    for (let _i = 0; _i < _list.length; _i++) {
      if (flowScene[_list[_i].id].order !== _i + 1) {
        isChanged = true;

        break;
      }
    }

    if (!isChanged) {
      return;
    }

    const changedTabOrder = _.findIndex(_list, (_item) => _.isBoolean(_item.chosen));

    const operations: Operation[] = _list.map((_item, _i) => ({ key: `scene.${_item.id}.order`, value: _i + 1 }));

    dispatch(setDocumentValueAction(operations));

    console.log();
    dispatch(setSceneOrderAction(changedTabOrder + 1));
  };

  return (
    <div className={cx('flow-tabs-wrap')}>
      <div className={cx('flow-tabs')}>
        <div className={cx('scene-list')}>
          <ReactSortable list={sceneList} setList={setList}>
            {sceneList.map((_scene, _i) => (
              <div
                key={_scene.id}
                className={cx('tab', { active: _i + 1 === sceneOrder })}
                onClick={() => selectScene(_i + 1)}
              >
                {_scene.name}
                {_i !== 0 && (
                  <button
                    onClick={(_event) => {
                      _event.stopPropagation();

                      removeScene(_scene.id);
                    }}
                  >
                    <i className="material-symbols-outlined">close</i>
                  </button>
                )}
              </div>
            ))}
          </ReactSortable>
          <div className={cx('add-scene-wrap')}>
            <button onClick={handleAddScene}>
              <i className="material-symbols-outlined">add</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowTabs;
