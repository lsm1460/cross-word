import classNames from 'classnames/bind';
import styles from './editor.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ChartItems, PointPos } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getChartItem, getSceneId } from '@/src/utils/content';
import { clearHistory } from '@/src/utils/history';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import FlowChartViewer from '../viewer';
import FlowChart from './flowChart';
import FlowHeader from './flowHeader';
import FlowToolbar from './flowToolbar';
import FlowZoom from './flowZoom';

export type MoveItems = (_itemIds: string[], _deltaX: number, _deltaY: number) => void;
export type ConnectPoints = (_prev: PointPos, _next?: PointPos, _delete?: PointPos) => void;

function CodeFlowLabEditor() {
  const dispatch = useDispatch();

  const [moveItemInfo, setMoveItemInfo] = useState<{ ids: string[]; deltaX: number; deltaY: number }>(null);

  const { chartItems, sceneItemIds, itemsPos } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      itemsPos: state.mainDocument.contentDocument.itemsPos,
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const selectedChartItem = useMemo(() => getChartItem(sceneItemIds, chartItems), [chartItems, sceneItemIds]);

  useEffect(() => {
    clearHistory();
  }, []);

  useEffect(() => {
    if (moveItemInfo && (moveItemInfo.deltaX || moveItemInfo.deltaY)) {
      const targetItems = _.pickBy(selectedChartItem, (_item) => moveItemInfo.ids.includes(_item.id));

      const operations: Operation[] = Object.values(targetItems).map((_item) => {
        return {
          key: `itemsPos.${_item.id}`,
          value: {
            left: itemsPos[_item.id].left + moveItemInfo.deltaX,
            top: itemsPos[_item.id].top + moveItemInfo.deltaY,
          },
        };
      });

      dispatch(setDocumentValueAction(operations));

      setMoveItemInfo(null);
    }
  }, [moveItemInfo, selectedChartItem]);

  const moveItems: MoveItems = (_itemIds, _deltaX, _deltaY) => {
    setMoveItemInfo({ ids: _itemIds, deltaX: _deltaX, deltaY: _deltaY });
  };

  const connectPoints: ConnectPoints = (_prevPos, _nextPos, _deletePos) => {
    let newTargetItems: _.Dictionary<ChartItems>;

    const targetEltypeList = _.compact([
      selectedChartItem[_prevPos.parentId].elType,
      selectedChartItem[_nextPos?.parentId]?.elType,
      selectedChartItem[_deletePos?.parentId]?.elType,
    ]);
    //_prevPos, _nextPos, _deletePos의 id로 elType을 가져온 후 변수일 경우
    const isVariableFlag = targetEltypeList.includes(ChartItemType.variable);

    if (isVariableFlag) {
      // 블록과 변수 간 연결상황일 때
      const variablePosIndex = targetEltypeList.indexOf(ChartItemType.variable);
      const _targetPosList = _.compact([_prevPos, _nextPos, _deletePos]);
      const variablePos = _targetPosList[variablePosIndex];
      const targetPos = _targetPosList[Number(!variablePosIndex)];

      const { index: variableIndex } = document.getElementById(targetPos.id).dataset;
      const _variableIndex = parseInt(variableIndex);

      /**connect..**/ if (_prevPos && _nextPos && !_deletePos) {
        const targetItems = _.pickBy(selectedChartItem, (_item) =>
          [_prevPos.parentId, _nextPos.parentId].includes(_item.id)
        );

        // 변수 아이템은 connectionIds에 할당
        newTargetItems = _.mapValues(targetItems, (_item) => ({
          ..._item,
          ...(_item.id === variablePos.parentId && {
            connectionIds: {
              ..._item.connectionIds,
              [variablePos.connectDir]: [
                ..._item.connectionIds[variablePos.connectDir],
                {
                  id: variablePos.id,
                  parentId: variablePos.parentId,
                  connectId: targetPos.id,
                  connectParentId: targetPos.parentId,
                },
              ],
            },
          }),
          // 변수를 입력받는 아이템은 connectionVariables에 할당
          // 할당 시 인덱스에 유의해서 넣어야 함
          ...(_item.id === targetPos.parentId && {
            connectionVariables: new Array(_variableIndex + 1).fill(undefined).map((_v, _i) => {
              if (_variableIndex === _i) {
                return {
                  id: targetPos.id,
                  parentId: targetPos.parentId,
                  connectId: variablePos.id,
                  connectParentId: variablePos.parentId,
                };
              } else {
                return _item.connectionVariables[_i];
              }
            }),
          }),
        }));
      } /** disconnect..**/ else if (_prevPos && !_nextPos && _deletePos) {
        const targetItems = _.pickBy(selectedChartItem, (_item) =>
          [_prevPos.parentId, _deletePos.parentId].includes(_item.id)
        );

        newTargetItems = _.mapValues(targetItems, (_item) => ({
          ..._item,
          ...(_item.id === variablePos.parentId && {
            connectionIds: {
              ..._item.connectionIds,
              [variablePos.connectDir]: _item.connectionIds[variablePos.connectDir].filter(
                (_point) => _point.connectId !== targetPos.id
              ),
            },
          }),
          ...(_item.id === targetPos.parentId && {
            connectionVariables: _item.connectionVariables.map((_point) =>
              _point.connectId === variablePos.id ? undefined : _point
            ),
          }),
        }));
      }
    } else {
      // 일반적인 블록 간 연결상황일 때
      /**connect..**/ if (_prevPos && _nextPos && !_deletePos) {
        const targetItems = _.pickBy(selectedChartItem, (_item) =>
          [_prevPos.parentId, _nextPos.parentId].includes(_item.id)
        );

        newTargetItems = _.mapValues(targetItems, (_item) => ({
          ..._item,
          ...(_item.id === _prevPos.parentId && {
            connectionIds: {
              ..._item.connectionIds,
              [_prevPos.connectDir]: [
                ..._item.connectionIds[_prevPos.connectDir],
                {
                  id: _prevPos.id,
                  parentId: _prevPos.parentId,
                  connectId: _nextPos.id,
                  connectParentId: _nextPos.parentId,
                },
              ],
            },
          }),
          ...(_item.id === _nextPos.parentId && {
            connectionIds: {
              ..._item.connectionIds,
              [_nextPos.connectDir]: [
                ..._item.connectionIds[_nextPos.connectDir],
                {
                  id: _nextPos.id,
                  parentId: _nextPos.parentId,
                  connectId: _prevPos.id,
                  connectParentId: _prevPos.parentId,
                },
              ],
            },
          }),
        }));
      } /** disconnect..**/ else if (_prevPos && !_nextPos && _deletePos) {
        const targetItems = _.pickBy(selectedChartItem, (_item) =>
          [_prevPos.parentId, _deletePos.parentId].includes(_item.id)
        );

        newTargetItems = _.mapValues(targetItems, (_item) => ({
          ..._item,
          ...(_item.id === _prevPos.parentId && {
            connectionIds: {
              ..._item.connectionIds,
              [_prevPos.connectDir]: _item.connectionIds[_prevPos.connectDir].filter(
                (_point) => _point.connectId !== _deletePos.id
              ),
            },
          }),
          ...(_item.id === _deletePos.parentId && {
            connectionIds: {
              ..._item.connectionIds,
              [_deletePos.connectDir]: _item.connectionIds[_deletePos.connectDir].filter(
                (_point) => _point.connectId !== _prevPos.id
              ),
            },
          }),
        }));
      } /** change.. **/ else if (_prevPos && _nextPos && _deletePos) {
        const targetItems = _.pickBy(selectedChartItem, (_item) =>
          [_prevPos.parentId, _deletePos.parentId, _nextPos.parentId].includes(_item.id)
        );
        newTargetItems = _.mapValues(targetItems, (_item) => {
          if (_item.id === _prevPos.parentId) {
            const deletedIdList = _item.connectionIds[_prevPos.connectDir].filter(
              (_point) => _point.connectId !== _deletePos.id
            );

            return {
              ..._item,
              connectionIds: {
                ..._item.connectionIds,
                [_prevPos.connectDir]: [
                  ...deletedIdList,
                  {
                    id: _prevPos.id,
                    parentId: _prevPos.parentId,
                    connectId: _nextPos.id,
                    connectParentId: _nextPos.parentId,
                  },
                ],
              },
            };
          } else if (_item.id === _deletePos.parentId) {
            return {
              ..._item,
              connectionIds: {
                ..._item.connectionIds,
                [_deletePos.connectDir]: _item.connectionIds[_deletePos.connectDir].filter(
                  (_point) => _point.connectId !== _prevPos.id
                ),
              },
            };
          } else if (_item.id === _nextPos.parentId) {
            return {
              ..._item,
              connectionIds: {
                ..._item.connectionIds,
                [_nextPos.connectDir]: [
                  ..._item.connectionIds[_nextPos.connectDir],
                  {
                    id: _nextPos.id,
                    parentId: _nextPos.parentId,
                    connectId: _prevPos.id,
                    connectParentId: _prevPos.parentId,
                  },
                ],
              },
            };
          } else {
            return _item;
          }
        });
      }
    }

    if (newTargetItems) {
      let operations: Operation[];

      if (isVariableFlag) {
        operations = Object.values(newTargetItems).map((_item) => {
          const _changeKey = _item.connectionVariables ? 'connectionVariables' : 'connectionIds';

          return {
            key: `items.${_item.id}.${_changeKey}`,
            value: _item[_changeKey],
          };
        });
      } else {
        operations = Object.values(newTargetItems).map((_item) => ({
          key: `items.${_item.id}.connectionIds`,
          value: _item.connectionIds,
        }));
      }

      dispatch(setDocumentValueAction(operations));
    }
  };

  return (
    <>
      <FlowHeader />
      <div className={cx('editor-wrap')}>
        <FlowToolbar />
        <div className={cx('canvas-area')}>
          <FlowZoom>
            <FlowChart moveItems={moveItems} connectPoints={connectPoints} />
          </FlowZoom>
        </div>
        <FlowChartViewer />
      </div>
    </>
  );
}

export default CodeFlowLabEditor;
