import {
  CHART_ELEMENT_ITEMS,
  FLOW_CHART_ITEMS_STYLE,
  FLOW_ITEM_ADDITIONAL_INFO,
  FLOW_ITEM_DEFAULT_INFO,
} from '@/consts/codeFlowLab/items';
import { ChartItemPos, ChartItemType, ChartItems, CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { getRandomId } from '@/src/utils/content';
import _ from 'lodash';

type IPolygon = { x: number; y: number }[];
export function doPolygonsIntersect(a: IPolygon, b: IPolygon) {
  const polygons = [a, b];
  let minA, maxA, projected, minB, maxB;

  for (let i = 0; i < polygons.length; i++) {
    // for each polygon, look at each edge of the polygon, and determine if it separates
    // the two shapes
    const polygon = polygons[i];
    for (let i1 = 0; i1 < polygon.length; i1++) {
      // grab 2 vertices to create an edge
      const i2 = (i1 + 1) % polygon.length;
      const p1 = polygon[i1];
      const p2 = polygon[i2];

      // find the line perpendicular to this edge
      const normal = { x: p2.y - p1.y, y: p1.x - p2.x };

      minA = maxA = undefined;
      // for each vertex in the first shape, project it onto the line perpendicular to the edge
      // and keep track of the min and max of these values
      for (let j = 0; j < a.length; j++) {
        projected = normal.x * a[j].x + normal.y * a[j].y;
        if (_.isUndefined(minA) || projected < minA) {
          minA = projected;
        }
        if (_.isUndefined(maxA) || projected > maxA) {
          maxA = projected;
        }
      }

      // for each vertex in the second shape, project it onto the line perpendicular to the edge
      // and keep track of the min and max of these values
      minB = maxB = undefined;
      for (let j = 0; j < b.length; j++) {
        projected = normal.x * b[j].x + normal.y * b[j].y;
        if (_.isUndefined(minB) || projected < minB) {
          minB = projected;
        }
        if (_.isUndefined(maxB) || projected > maxB) {
          maxB = projected;
        }
      }

      // if there is no overlap between the projects, the edge we are looking at separates the two
      // polygons, and we know there is no overlap
      if (maxA < minB || maxB < minA) {
        return false;
      }
    }
  }
  return true;
}

interface IPoint {
  x: number;
  y: number;
}

function getAngle(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const matrix = new WebKitCSSMatrix(style.webkitTransform);
  return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
}

export function getRectPoints(element: HTMLElement): IPoint[] {
  const rect = element.getBoundingClientRect();
  const x = rect.left;
  const y = rect.top;
  const width = rect.width;
  const height = rect.height;
  const angle = getAngle(element);

  const radian = (angle * Math.PI) / 180;
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);

  const x1 = x + width * cos;
  const y1 = y + width * sin;

  const x2 = x1 + height * -sin;
  const y2 = y1 + height * cos;

  const x3 = x2 + width * -cos;
  const y3 = y2 + height * -sin;

  return [
    { x, y },
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
  ];
}

export const getElType = (_elType) => {
  if (_elType === ChartItemType.span) {
    return _elType;
  }

  return CHART_ELEMENT_ITEMS.includes(_elType) ? ChartItemType.el : _elType;
};

export const getConnectSizeByType = (
  _idsByDic: ChartItems['connectionIds'],
  _chartItems: CodeFlowChartDoc['items']
) => {
  return _.mapValues(_idsByDic, (_ids) => {
    const typeGroup = _.groupBy(_ids, (_id) => getElType(_chartItems[_id].elType));

    return _.mapValues(typeGroup, (_ids) => _ids.length);
  });
};

export const makeNewItem = (
  zoomArea: HTMLElement,
  selectedChartItems: CodeFlowChartDoc['items'],
  itemsPos: CodeFlowChartDoc['itemsPos'],
  itemType: ChartItemType
): [ChartItems, ChartItemPos, string] => {
  const { scale, transX, transY } = zoomArea.dataset;
  const { width, height } = zoomArea.parentElement.getBoundingClientRect();

  const newItemId = getRandomId();

  const itemList = Object.values(selectedChartItems);
  const lastEl = itemList[itemList.length - 1];
  const itemSize = _.filter(itemList, (_item) => _item.elType === itemType).length;

  let pos = {
    left: width / parseFloat(scale) / 2 - parseFloat(transX),
    top: height / parseFloat(scale) / 2 - parseFloat(transY),
  };

  if (lastEl && itemsPos[lastEl.id].left === pos.left && itemsPos[lastEl.id].top === pos.top) {
    pos = {
      left: pos.left + 10,
      top: pos.top + 10,
    };
  }

  return [
    {
      ...FLOW_ITEM_DEFAULT_INFO,
      id: newItemId,
      name: `${itemType.replace(/\b[a-z]/g, (char) => char.toUpperCase())}-${itemSize + 1}`,
      elType: itemType,
      zIndex: itemList.length + 1,
      connectionIds: _.mapValues(FLOW_CHART_ITEMS_STYLE[itemType].connectionTypeList, () => []),
      ...(FLOW_ITEM_ADDITIONAL_INFO[itemType] && FLOW_ITEM_ADDITIONAL_INFO[itemType]),
    },
    pos,
    newItemId,
  ];
};
