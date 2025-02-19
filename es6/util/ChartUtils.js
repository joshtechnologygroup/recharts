import _isEqual from "lodash/isEqual";
import _sortBy from "lodash/sortBy";
import _isNaN from "lodash/isNaN";
import _upperFirst from "lodash/upperFirst";
import _isString from "lodash/isString";
import _isArray from "lodash/isArray";
import _max from "lodash/max";
import _min from "lodash/min";
import _flatMap from "lodash/flatMap";
import _isFunction from "lodash/isFunction";
import _get from "lodash/get";
import _isNil from "lodash/isNil";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { getNiceTickValues, getTickValuesFixedDomain } from 'recharts-scale';
import * as d3Scales from 'd3-scale';
import { stack as shapeStack, stackOrderNone, stackOffsetExpand, stackOffsetNone, stackOffsetSilhouette, stackOffsetWiggle } from 'd3-shape';
import { isNumOrStr, uniqueId, isNumber, getPercentValue, mathSign, findEntryInArray } from './DataUtils';
import { Legend } from '../component/Legend';
import { findAllByType, findChildByType, getDisplayName } from './ReactUtils'; // TODO: Cause of circular dependency. Needs refactor.
// import { RadiusAxisProps, AngleAxisProps } from '../polar/types';

import { filterProps } from './types';
export function getValueByDataKey(obj, dataKey, defaultValue) {
  if (_isNil(obj) || _isNil(dataKey)) {
    return defaultValue;
  }

  if (isNumOrStr(dataKey)) {
    return _get(obj, dataKey, defaultValue);
  }

  if (_isFunction(dataKey)) {
    return dataKey(obj);
  }

  return defaultValue;
}
/**
 * Get domain of data by key
 * @param  {Array}   data      The data displayed in the chart
 * @param  {String}  key       The unique key of a group of data
 * @param  {String}  type      The type of axis
 * @param  {Boolean} filterNil Whether or not filter nil values
 * @return {Array} Domain of data
 */

export function getDomainOfDataByKey(data, key, type, filterNil) {
  var flattenData = _flatMap(data, function (entry) {
    return getValueByDataKey(entry, key);
  });

  if (type === 'number') {
    var domain = flattenData.filter(function (entry) {
      return isNumber(entry) || parseFloat(entry);
    });
    return domain.length ? [_min(domain), _max(domain)] : [Infinity, -Infinity];
  }

  var validateData = filterNil ? flattenData.filter(function (entry) {
    return !_isNil(entry);
  }) : flattenData; // 支持Date类型的x轴

  return validateData.map(function (entry) {
    return isNumOrStr(entry) || entry instanceof Date ? entry : '';
  });
}
export var calculateActiveTickIndex = function calculateActiveTickIndex(coordinate) {
  var _ticks$length;

  var ticks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var unsortedTicks = arguments.length > 2 ? arguments[2] : undefined;
  var axis = arguments.length > 3 ? arguments[3] : undefined;
  var index = -1;
  var len = (_ticks$length = ticks === null || ticks === void 0 ? void 0 : ticks.length) !== null && _ticks$length !== void 0 ? _ticks$length : 0;

  if (len > 1) {
    if (axis && axis.axisType === 'angleAxis' && Math.abs(Math.abs(axis.range[1] - axis.range[0]) - 360) <= 1e-6) {
      var range = axis.range; // ticks are distributed in a circle

      for (var i = 0; i < len; i++) {
        var before = i > 0 ? unsortedTicks[i - 1].coordinate : unsortedTicks[len - 1].coordinate;
        var cur = unsortedTicks[i].coordinate;
        var after = i >= len - 1 ? unsortedTicks[0].coordinate : unsortedTicks[i + 1].coordinate;
        var sameDirectionCoord = void 0;

        if (mathSign(cur - before) !== mathSign(after - cur)) {
          var diffInterval = [];

          if (mathSign(after - cur) === mathSign(range[1] - range[0])) {
            sameDirectionCoord = after;
            var curInRange = cur + range[1] - range[0];
            diffInterval[0] = Math.min(curInRange, (curInRange + before) / 2);
            diffInterval[1] = Math.max(curInRange, (curInRange + before) / 2);
          } else {
            sameDirectionCoord = before;
            var afterInRange = after + range[1] - range[0];
            diffInterval[0] = Math.min(cur, (afterInRange + cur) / 2);
            diffInterval[1] = Math.max(cur, (afterInRange + cur) / 2);
          }

          var sameInterval = [Math.min(cur, (sameDirectionCoord + cur) / 2), Math.max(cur, (sameDirectionCoord + cur) / 2)];

          if (coordinate > sameInterval[0] && coordinate <= sameInterval[1] || coordinate >= diffInterval[0] && coordinate <= diffInterval[1]) {
            index = unsortedTicks[i].index;
            break;
          }
        } else {
          var min = Math.min(before, after);
          var max = Math.max(before, after);

          if (coordinate > (min + cur) / 2 && coordinate <= (max + cur) / 2) {
            index = unsortedTicks[i].index;
            break;
          }
        }
      }
    } else {
      // ticks are distributed in a single direction
      for (var _i = 0; _i < len; _i++) {
        if (_i === 0 && coordinate <= (ticks[_i].coordinate + ticks[_i + 1].coordinate) / 2 || _i > 0 && _i < len - 1 && coordinate > (ticks[_i].coordinate + ticks[_i - 1].coordinate) / 2 && coordinate <= (ticks[_i].coordinate + ticks[_i + 1].coordinate) / 2 || _i === len - 1 && coordinate > (ticks[_i].coordinate + ticks[_i - 1].coordinate) / 2) {
          index = ticks[_i].index;
          break;
        }
      }
    }
  } else {
    index = 0;
  }

  return index;
};
/**
 * Get the main color of each graphic item
 * @param  {ReactElement} item A graphic item
 * @return {String}            Color
 */

export var getMainColorOfGraphicItem = function getMainColorOfGraphicItem(item) {
  var _ref = item,
      displayName = _ref.type.displayName; // TODO: check if displayName is valid.

  var _item$props = item.props,
      stroke = _item$props.stroke,
      fill = _item$props.fill;
  var result;

  switch (displayName) {
    case 'Line':
      result = stroke;
      break;

    case 'Area':
    case 'Radar':
      result = stroke && stroke !== 'none' ? stroke : fill;
      break;

    default:
      result = fill;
      break;
  }

  return result;
};
export var getLegendProps = function getLegendProps(_ref2) {
  var children = _ref2.children,
      formattedGraphicalItems = _ref2.formattedGraphicalItems,
      legendWidth = _ref2.legendWidth,
      legendContent = _ref2.legendContent;
  var legendItem = findChildByType(children, Legend.displayName);

  if (!legendItem) {
    return null;
  }

  var legendData;

  if (legendItem.props && legendItem.props.payload) {
    legendData = legendItem.props && legendItem.props.payload;
  } else if (legendContent === 'children') {
    legendData = (formattedGraphicalItems || []).reduce(function (result, _ref3) {
      var item = _ref3.item,
          props = _ref3.props;
      var data = props.sectors || props.data || [];
      return result.concat(data.map(function (entry) {
        return {
          type: legendItem.props.iconType || item.props.legendType,
          value: entry.name,
          color: entry.fill,
          payload: entry
        };
      }));
    }, []);
  } else {
    legendData = (formattedGraphicalItems || []).map(function (_ref4) {
      var item = _ref4.item;
      var _item$props2 = item.props,
          dataKey = _item$props2.dataKey,
          name = _item$props2.name,
          legendType = _item$props2.legendType,
          hide = _item$props2.hide;
      return {
        inactive: hide,
        dataKey: dataKey,
        type: legendItem.props.iconType || legendType || 'square',
        color: getMainColorOfGraphicItem(item),
        value: name || dataKey,
        payload: item.props
      };
    });
  }

  return _objectSpread(_objectSpread(_objectSpread({}, legendItem.props), Legend.getWithHeight(legendItem, legendWidth)), {}, {
    payload: legendData,
    item: legendItem
  });
};
/**
 * Calculate the size of all groups for stacked bar graph
 * @param  {Object} stackGroups The items grouped by axisId and stackId
 * @return {Object} The size of all groups
 */

export var getBarSizeList = function getBarSizeList(_ref5) {
  var globalSize = _ref5.barSize,
      _ref5$stackGroups = _ref5.stackGroups,
      stackGroups = _ref5$stackGroups === void 0 ? {} : _ref5$stackGroups;

  if (!stackGroups) {
    return {};
  }

  var result = {};
  var numericAxisIds = Object.keys(stackGroups);

  for (var i = 0, len = numericAxisIds.length; i < len; i++) {
    var sgs = stackGroups[numericAxisIds[i]].stackGroups;
    var stackIds = Object.keys(sgs);

    for (var j = 0, sLen = stackIds.length; j < sLen; j++) {
      var _sgs$stackIds$j = sgs[stackIds[j]],
          items = _sgs$stackIds$j.items,
          cateAxisId = _sgs$stackIds$j.cateAxisId;
      var barItems = items.filter(function (item) {
        return getDisplayName(item.type).indexOf('Bar') >= 0;
      });

      if (barItems && barItems.length) {
        var selfSize = barItems[0].props.barSize;
        var cateId = barItems[0].props[cateAxisId];

        if (!result[cateId]) {
          result[cateId] = [];
        }

        result[cateId].push({
          item: barItems[0],
          stackList: barItems.slice(1),
          barSize: _isNil(selfSize) ? globalSize : selfSize
        });
      }
    }
  }

  return result;
};
/**
 * Calculate the size of each bar and the gap between two bars
 * @param  {Number} bandSize  The size of each category
 * @param  {sizeList} sizeList  The size of all groups
 * @param  {maxBarSize} maxBarSize The maximum size of bar
 * @return {Number} The size of each bar and the gap between two bars
 */

export var getBarPosition = function getBarPosition(_ref6) {
  var barGap = _ref6.barGap,
      barCategoryGap = _ref6.barCategoryGap,
      bandSize = _ref6.bandSize,
      _ref6$sizeList = _ref6.sizeList,
      sizeList = _ref6$sizeList === void 0 ? [] : _ref6$sizeList,
      maxBarSize = _ref6.maxBarSize;
  var len = sizeList.length;
  if (len < 1) return null;
  var realBarGap = getPercentValue(barGap, bandSize, 0, true);
  var result; // whether or not is barSize setted by user

  if (sizeList[0].barSize === +sizeList[0].barSize) {
    var useFull = false;
    var fullBarSize = bandSize / len;
    var sum = sizeList.reduce(function (res, entry) {
      return res + entry.barSize || 0;
    }, 0);
    sum += (len - 1) * realBarGap;

    if (sum >= bandSize) {
      sum -= (len - 1) * realBarGap;
      realBarGap = 0;
    }

    if (sum >= bandSize && fullBarSize > 0) {
      useFull = true;
      fullBarSize *= 0.9;
      sum = len * fullBarSize;
    }

    var offset = (bandSize - sum) / 2 >> 0;
    var prev = {
      offset: offset - realBarGap,
      size: 0
    };
    result = sizeList.reduce(function (res, entry) {
      var newRes = [].concat(_toConsumableArray(res), [{
        item: entry.item,
        position: {
          offset: prev.offset + prev.size + realBarGap,
          size: useFull ? fullBarSize : entry.barSize
        }
      }]);
      prev = newRes[newRes.length - 1].position;

      if (entry.stackList && entry.stackList.length) {
        entry.stackList.forEach(function (item) {
          newRes.push({
            item: item,
            position: prev
          });
        });
      }

      return newRes;
    }, []);
  } else {
    var _offset = getPercentValue(barCategoryGap, bandSize, 0, true);

    if (bandSize - 2 * _offset - (len - 1) * realBarGap <= 0) {
      realBarGap = 0;
    }

    var originalSize = (bandSize - 2 * _offset - (len - 1) * realBarGap) / len;

    if (originalSize > 1) {
      originalSize >>= 0;
    }

    var size = maxBarSize === +maxBarSize ? Math.min(originalSize, maxBarSize) : originalSize;
    result = sizeList.reduce(function (res, entry, i) {
      var newRes = [].concat(_toConsumableArray(res), [{
        item: entry.item,
        position: {
          offset: _offset + (originalSize + realBarGap) * i + (originalSize - size) / 2,
          size: size
        }
      }]);

      if (entry.stackList && entry.stackList.length) {
        entry.stackList.forEach(function (item) {
          newRes.push({
            item: item,
            position: newRes[newRes.length - 1].position
          });
        });
      }

      return newRes;
    }, []);
  }

  return result;
};
export var appendOffsetOfLegend = function appendOffsetOfLegend(offset, items, props, legendBox) {
  var children = props.children,
      width = props.width,
      margin = props.margin;
  var legendWidth = width - (margin.left || 0) - (margin.right || 0); // const legendHeight = height - (margin.top || 0) - (margin.bottom || 0);

  var legendProps = getLegendProps({
    children: children,
    legendWidth: legendWidth
  });
  var newOffset = offset;

  if (legendProps) {
    var box = legendBox || {};
    var align = legendProps.align,
        verticalAlign = legendProps.verticalAlign,
        layout = legendProps.layout;

    if ((layout === 'vertical' || layout === 'horizontal' && verticalAlign === 'center') && isNumber(offset[align])) {
      newOffset = _objectSpread(_objectSpread({}, offset), {}, _defineProperty({}, align, newOffset[align] + (box.width || 0)));
    }

    if ((layout === 'horizontal' || layout === 'vertical' && align === 'center') && isNumber(offset[verticalAlign])) {
      newOffset = _objectSpread(_objectSpread({}, offset), {}, _defineProperty({}, verticalAlign, newOffset[verticalAlign] + (box.height || 0)));
    }
  }

  return newOffset;
};

var isErrorBarRelevantForAxis = function isErrorBarRelevantForAxis(layout, axisType, direction) {
  if (_isNil(axisType)) {
    return true;
  }

  if (layout === 'horizontal') {
    return axisType === 'yAxis';
  }

  if (layout === 'vertical') {
    return axisType === 'xAxis';
  }

  if (direction === 'x') {
    return axisType === 'xAxis';
  }

  if (direction === 'y') {
    return axisType === 'yAxis';
  }

  return true;
};

export var getDomainOfErrorBars = function getDomainOfErrorBars(data, item, dataKey, layout, axisType) {
  var children = item.props.children;
  var errorBars = findAllByType(children, 'ErrorBar').filter(function (errorBarChild) {
    return isErrorBarRelevantForAxis(layout, axisType, errorBarChild.props.direction);
  });

  if (errorBars && errorBars.length) {
    var keys = errorBars.map(function (errorBarChild) {
      return errorBarChild.props.dataKey;
    });
    return data.reduce(function (result, entry) {
      var entryValue = getValueByDataKey(entry, dataKey, 0);
      var mainValue = _isArray(entryValue) ? [_min(entryValue), _max(entryValue)] : [entryValue, entryValue];
      var errorDomain = keys.reduce(function (prevErrorArr, k) {
        var errorValue = getValueByDataKey(entry, k, 0);
        var lowerValue = mainValue[0] - Math.abs(_isArray(errorValue) ? errorValue[0] : errorValue);
        var upperValue = mainValue[1] + Math.abs(_isArray(errorValue) ? errorValue[1] : errorValue);
        return [Math.min(lowerValue, prevErrorArr[0]), Math.max(upperValue, prevErrorArr[1])];
      }, [Infinity, -Infinity]);
      return [Math.min(errorDomain[0], result[0]), Math.max(errorDomain[1], result[1])];
    }, [Infinity, -Infinity]);
  }

  return null;
};
export var parseErrorBarsOfAxis = function parseErrorBarsOfAxis(data, items, dataKey, axisType, layout) {
  var domains = items.map(function (item) {
    return getDomainOfErrorBars(data, item, dataKey, layout, axisType);
  }).filter(function (entry) {
    return !_isNil(entry);
  });

  if (domains && domains.length) {
    return domains.reduce(function (result, entry) {
      return [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])];
    }, [Infinity, -Infinity]);
  }

  return null;
};
/**
 * Get domain of data by the configuration of item element
 * @param  {Array}   data      The data displayed in the chart
 * @param  {Array}   items     The instances of item
 * @param  {String}  type      The type of axis, number - Number Axis, category - Category Axis
 * @param  {LayoutType} layout The type of layout
 * @param  {Boolean} filterNil Whether or not filter nil values
 * @return {Array}        Domain
 */

export var getDomainOfItemsWithSameAxis = function getDomainOfItemsWithSameAxis(data, items, type, layout, filterNil) {
  var domains = items.map(function (item) {
    var dataKey = item.props.dataKey;

    if (type === 'number' && dataKey) {
      return getDomainOfErrorBars(data, item, dataKey, layout) || getDomainOfDataByKey(data, dataKey, type, filterNil);
    }

    return getDomainOfDataByKey(data, dataKey, type, filterNil);
  });

  if (type === 'number') {
    // Calculate the domain of number axis
    return domains.reduce(function (result, entry) {
      return [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])];
    }, [Infinity, -Infinity]);
  }

  var tag = {}; // Get the union set of category axis

  return domains.reduce(function (result, entry) {
    for (var i = 0, len = entry.length; i < len; i++) {
      if (!tag[entry[i]]) {
        tag[entry[i]] = true;
        result.push(entry[i]);
      }
    }

    return result;
  }, []);
};
export var isCategoricalAxis = function isCategoricalAxis(layout, axisType) {
  return layout === 'horizontal' && axisType === 'xAxis' || layout === 'vertical' && axisType === 'yAxis' || layout === 'centric' && axisType === 'angleAxis' || layout === 'radial' && axisType === 'radiusAxis';
};
/**
 * Calculate the Coordinates of grid
 * @param  {Array} ticks The ticks in axis
 * @param {Number} min   The minimun value of axis
 * @param {Number} max   The maximun value of axis
 * @return {Array}       Coordinates
 */

export var getCoordinatesOfGrid = function getCoordinatesOfGrid(ticks, min, max) {
  var hasMin, hasMax;
  var values = ticks.map(function (entry) {
    if (entry.coordinate === min) {
      hasMin = true;
    }

    if (entry.coordinate === max) {
      hasMax = true;
    }

    return entry.coordinate;
  });

  if (!hasMin) {
    values.push(min);
  }

  if (!hasMax) {
    values.push(max);
  }

  return values;
};
/**
 * Get the ticks of an axis
 * @param  {Object}  axis The configuration of an axis
 * @param {Boolean} isGrid Whether or not are the ticks in grid
 * @param {Boolean} isAll Return the ticks of all the points or not
 * @return {Array}  Ticks
 */

export var getTicksOfAxis = function getTicksOfAxis(axis, isGrid, isAll) {
  if (!axis) return null;
  var scale = axis.scale;
  var duplicateDomain = axis.duplicateDomain,
      type = axis.type,
      range = axis.range;
  var offsetForBand = axis.realScaleType === 'scaleBand' ? scale.bandwidth() / 2 : 2;
  var offset = (isGrid || isAll) && type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axis.axisType === 'angleAxis' ? mathSign(range[0] - range[1]) * 2 * offset : offset; // The ticks setted by user should only affect the ticks adjacent to axis line

  if (isGrid && (axis.ticks || axis.niceTicks)) {
    return (axis.ticks || axis.niceTicks).map(function (entry) {
      var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
      return {
        coordinate: scale(scaleContent) + offset,
        value: entry,
        offset: offset
      };
    });
  } // When axis is a categorial axis, but the type of axis is number or the scale of axis is not "auto"


  if (axis.isCategorical && axis.categoricalDomain) {
    return axis.categoricalDomain.map(function (entry, index) {
      return {
        coordinate: scale(entry) + offset,
        value: entry,
        index: index,
        offset: offset
      };
    });
  }

  if (scale.ticks && !isAll) {
    return scale.ticks(axis.tickCount).map(function (entry) {
      return {
        coordinate: scale(entry) + offset,
        value: entry,
        offset: offset
      };
    });
  } // When axis has duplicated text, serial numbers are used to generate scale


  return scale.domain().map(function (entry, index) {
    return {
      coordinate: scale(entry) + offset,
      value: duplicateDomain ? duplicateDomain[entry] : entry,
      index: index,
      offset: offset
    };
  });
};
/**
 * combine the handlers
 * @param  {Function} defaultHandler Internal private handler
 * @param  {Function} parentHandler  Handler function specified in parent component
 * @param  {Function} childHandler   Handler function specified in child component
 * @return {Function}                The combined handler
 */

export var combineEventHandlers = function combineEventHandlers(defaultHandler, parentHandler, childHandler) {
  var customizedHandler;

  if (_isFunction(childHandler)) {
    customizedHandler = childHandler;
  } else if (_isFunction(parentHandler)) {
    customizedHandler = parentHandler;
  }

  if (_isFunction(defaultHandler) || customizedHandler) {
    return function (arg1, arg2, arg3, arg4) {
      if (_isFunction(defaultHandler)) {
        defaultHandler(arg1, arg2, arg3, arg4);
      }

      if (_isFunction(customizedHandler)) {
        customizedHandler(arg1, arg2, arg3, arg4);
      }
    };
  }

  return null;
};
/**
 * Parse the scale function of axis
 * @param  {Object}   axis          The option of axis
 * @param  {String}   chartType     The displayName of chart
 * @param  {Boolean}  hasBar        if it has a bar
 * @return {Function}               The scale function
 */

export var parseScale = function parseScale(axis, chartType, hasBar) {
  var scale = axis.scale,
      type = axis.type,
      layout = axis.layout,
      axisType = axis.axisType;

  if (scale === 'auto') {
    if (layout === 'radial' && axisType === 'radiusAxis') {
      return {
        scale: d3Scales.scaleBand(),
        realScaleType: 'band'
      };
    }

    if (layout === 'radial' && axisType === 'angleAxis') {
      return {
        scale: d3Scales.scaleLinear(),
        realScaleType: 'linear'
      };
    }

    if (type === 'category' && chartType && (chartType.indexOf('LineChart') >= 0 || chartType.indexOf('AreaChart') >= 0 || chartType.indexOf('ComposedChart') >= 0 && !hasBar)) {
      return {
        scale: d3Scales.scalePoint(),
        realScaleType: 'point'
      };
    }

    if (type === 'category') {
      return {
        scale: d3Scales.scaleBand(),
        realScaleType: 'band'
      };
    }

    return {
      scale: d3Scales.scaleLinear(),
      realScaleType: 'linear'
    };
  }

  if (_isString(scale)) {
    var name = "scale".concat(_upperFirst(scale));
    return {
      scale: (d3Scales[name] || d3Scales.scalePoint)(),
      realScaleType: d3Scales[name] ? name : 'point'
    };
  }

  return _isFunction(scale) ? {
    scale: scale
  } : {
    scale: d3Scales.scalePoint(),
    realScaleType: 'point'
  };
};
var EPS = 1e-4;
export var checkDomainOfScale = function checkDomainOfScale(scale) {
  var domain = scale.domain();

  if (!domain || domain.length <= 2) {
    return;
  }

  var len = domain.length;
  var range = scale.range();
  var min = Math.min(range[0], range[1]) - EPS;
  var max = Math.max(range[0], range[1]) + EPS;
  var first = scale(domain[0]);
  var last = scale(domain[len - 1]);

  if (first < min || first > max || last < min || last > max) {
    scale.domain([domain[0], domain[len - 1]]);
  }
};
export var findPositionOfBar = function findPositionOfBar(barPosition, child) {
  if (!barPosition) {
    return null;
  }

  for (var i = 0, len = barPosition.length; i < len; i++) {
    if (barPosition[i].item === child) {
      return barPosition[i].position;
    }
  }

  return null;
};
export var truncateByDomain = function truncateByDomain(value, domain) {
  if (!domain || domain.length !== 2 || !isNumber(domain[0]) || !isNumber(domain[1])) {
    return value;
  }

  var min = Math.min(domain[0], domain[1]);
  var max = Math.max(domain[0], domain[1]);
  var result = [value[0], value[1]];

  if (!isNumber(value[0]) || value[0] < min) {
    result[0] = min;
  }

  if (!isNumber(value[1]) || value[1] > max) {
    result[1] = max;
  }

  if (result[0] > max) {
    result[0] = max;
  }

  if (result[1] < min) {
    result[1] = min;
  }

  return result;
};
/* eslint no-param-reassign: 0 */

export var offsetSign = function offsetSign(series) {
  var n = series.length;

  if (n <= 0) {
    return;
  }

  for (var j = 0, m = series[0].length; j < m; ++j) {
    var positive = 0;
    var negative = 0;

    for (var i = 0; i < n; ++i) {
      var value = _isNaN(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
      /* eslint-disable prefer-destructuring */

      if (value >= 0) {
        series[i][j][0] = positive;
        series[i][j][1] = positive + value;
        positive = series[i][j][1];
      } else {
        series[i][j][0] = negative;
        series[i][j][1] = negative + value;
        negative = series[i][j][1];
      }
      /* eslint-enable prefer-destructuring */

    }
  }
};
/* eslint no-param-reassign: 0 */

export var offsetPositive = function offsetPositive(series) {
  var n = series.length;

  if (n <= 0) {
    return;
  }

  for (var j = 0, m = series[0].length; j < m; ++j) {
    var positive = 0;

    for (var i = 0; i < n; ++i) {
      var value = _isNaN(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
      /* eslint-disable prefer-destructuring */

      if (value >= 0) {
        series[i][j][0] = positive;
        series[i][j][1] = positive + value;
        positive = series[i][j][1];
      } else {
        series[i][j][0] = 0;
        series[i][j][1] = 0;
      }
      /* eslint-enable prefer-destructuring */

    }
  }
};
var STACK_OFFSET_MAP = {
  sign: offsetSign,
  expand: stackOffsetExpand,
  none: stackOffsetNone,
  silhouette: stackOffsetSilhouette,
  wiggle: stackOffsetWiggle,
  positive: offsetPositive
};
export var getStackedData = function getStackedData(data, stackItems, offsetType) {
  var dataKeys = stackItems.map(function (item) {
    return item.props.dataKey;
  });
  var stack = shapeStack().keys(dataKeys).value(function (d, key) {
    return +getValueByDataKey(d, key, 0);
  }).order(stackOrderNone).offset(STACK_OFFSET_MAP[offsetType]);
  return stack(data);
};
export var getStackGroupsByAxisId = function getStackGroupsByAxisId(data, _items, numericAxisId, cateAxisId, offsetType, reverseStackOrder) {
  if (!data) {
    return null;
  } // reversing items to affect render order (for layering)


  var items = reverseStackOrder ? _items.reverse() : _items;
  var stackGroups = items.reduce(function (result, item) {
    var _item$props3 = item.props,
        stackId = _item$props3.stackId,
        hide = _item$props3.hide;

    if (hide) {
      return result;
    }

    var axisId = item.props[numericAxisId];
    var parentGroup = result[axisId] || {
      hasStack: false,
      stackGroups: {}
    };

    if (isNumOrStr(stackId)) {
      var childGroup = parentGroup.stackGroups[stackId] || {
        numericAxisId: numericAxisId,
        cateAxisId: cateAxisId,
        items: []
      };
      childGroup.items.push(item);
      parentGroup.hasStack = true;
      parentGroup.stackGroups[stackId] = childGroup;
    } else {
      parentGroup.stackGroups[uniqueId('_stackId_')] = {
        numericAxisId: numericAxisId,
        cateAxisId: cateAxisId,
        items: [item]
      };
    }

    return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, axisId, parentGroup));
  }, {});
  return Object.keys(stackGroups).reduce(function (result, axisId) {
    var group = stackGroups[axisId];

    if (group.hasStack) {
      group.stackGroups = Object.keys(group.stackGroups).reduce(function (res, stackId) {
        var g = group.stackGroups[stackId];
        return _objectSpread(_objectSpread({}, res), {}, _defineProperty({}, stackId, {
          numericAxisId: numericAxisId,
          cateAxisId: cateAxisId,
          items: g.items,
          stackedData: getStackedData(data, g.items, offsetType)
        }));
      }, {});
    }

    return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, axisId, group));
  }, {});
};
/**
 * get domain of ticks
 * @param  {Array} ticks Ticks of axis
 * @param  {String} type  The type of axis
 * @return {Array} domain
 */

export var calculateDomainOfTicks = function calculateDomainOfTicks(ticks, type) {
  if (type === 'number') {
    return [_min(ticks), _max(ticks)];
  }

  return ticks;
};
/**
 * Configure the scale function of axis
 * @param {Object} scale The scale function
 * @param {Object} opts  The configuration of axis
 * @return {Object}      null
 */

export var getTicksOfScale = function getTicksOfScale(scale, opts) {
  var realScaleType = opts.realScaleType,
      type = opts.type,
      tickCount = opts.tickCount,
      originalDomain = opts.originalDomain,
      allowDecimals = opts.allowDecimals;
  var scaleType = realScaleType || opts.scale;

  if (scaleType !== 'auto' && scaleType !== 'linear') {
    return null;
  }

  if (tickCount && type === 'number' && originalDomain && (originalDomain[0] === 'auto' || originalDomain[1] === 'auto')) {
    // Calculate the ticks by the number of grid when the axis is a number axis
    var domain = scale.domain();

    if (!domain.length) {
      return null;
    }

    var tickValues = getNiceTickValues(domain, tickCount, allowDecimals);
    scale.domain(calculateDomainOfTicks(tickValues, type));
    return {
      niceTicks: tickValues
    };
  }

  if (tickCount && type === 'number') {
    var _domain = scale.domain();

    var _tickValues = getTickValuesFixedDomain(_domain, tickCount, allowDecimals);

    return {
      niceTicks: _tickValues
    };
  }

  return null;
};
export var getCateCoordinateOfLine = function getCateCoordinateOfLine(_ref7) {
  var axis = _ref7.axis,
      ticks = _ref7.ticks,
      bandSize = _ref7.bandSize,
      entry = _ref7.entry,
      index = _ref7.index,
      dataKey = _ref7.dataKey;

  if (axis.type === 'category') {
    // find coordinate of category axis by the value of category
    if (!axis.allowDuplicatedCategory && axis.dataKey && !_isNil(entry[axis.dataKey])) {
      var matchedTick = findEntryInArray(ticks, 'value', entry[axis.dataKey]);

      if (matchedTick) {
        return matchedTick.coordinate + bandSize / 2;
      }
    }

    return ticks[index] ? ticks[index].coordinate + bandSize / 2 : null;
  }

  var value = getValueByDataKey(entry, !_isNil(dataKey) ? dataKey : axis.dataKey);
  return !_isNil(value) ? axis.scale(value) : null;
};
export var getCateCoordinateOfBar = function getCateCoordinateOfBar(_ref8) {
  var axis = _ref8.axis,
      ticks = _ref8.ticks,
      offset = _ref8.offset,
      bandSize = _ref8.bandSize,
      entry = _ref8.entry,
      index = _ref8.index;

  if (axis.type === 'category') {
    return ticks[index] ? ticks[index].coordinate + offset : null;
  }

  var value = getValueByDataKey(entry, axis.dataKey, axis.domain[index]);
  return !_isNil(value) ? axis.scale(value) - bandSize / 2 + offset : null;
};
export var getBaseValueOfBar = function getBaseValueOfBar(_ref9) {
  var numericAxis = _ref9.numericAxis;
  var domain = numericAxis.scale.domain();

  if (numericAxis.type === 'number') {
    var min = Math.min(domain[0], domain[1]);
    var max = Math.max(domain[0], domain[1]);

    if (min <= 0 && max >= 0) {
      return 0;
    }

    if (max < 0) {
      return max;
    }

    return min;
  }

  return domain[0];
};
export var getStackedDataOfItem = function getStackedDataOfItem(item, stackGroups) {
  var stackId = item.props.stackId;

  if (isNumOrStr(stackId)) {
    var group = stackGroups[stackId];

    if (group && group.items.length) {
      var itemIndex = -1;

      for (var i = 0, len = group.items.length; i < len; i++) {
        if (group.items[i] === item) {
          itemIndex = i;
          break;
        }
      }

      return itemIndex >= 0 ? group.stackedData[itemIndex] : null;
    }
  }

  return null;
};

var getDomainOfSingle = function getDomainOfSingle(data) {
  return data.reduce(function (result, entry) {
    return [_min(entry.concat([result[0]]).filter(isNumber)), _max(entry.concat([result[1]]).filter(isNumber))];
  }, [Infinity, -Infinity]);
};

export var getDomainOfStackGroups = function getDomainOfStackGroups(stackGroups, startIndex, endIndex) {
  return Object.keys(stackGroups).reduce(function (result, stackId) {
    var group = stackGroups[stackId];
    var stackedData = group.stackedData;
    var domain = stackedData.reduce(function (res, entry) {
      var s = getDomainOfSingle(entry.slice(startIndex, endIndex + 1));
      return [Math.min(res[0], s[0]), Math.max(res[1], s[1])];
    }, [Infinity, -Infinity]);
    return [Math.min(domain[0], result[0]), Math.max(domain[1], result[1])];
  }, [Infinity, -Infinity]).map(function (result) {
    return result === Infinity || result === -Infinity ? 0 : result;
  });
};
export var MIN_VALUE_REG = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
export var MAX_VALUE_REG = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
export var parseSpecifiedDomain = function parseSpecifiedDomain(specifiedDomain, dataDomain, allowDataOverflow) {
  if (_isFunction(specifiedDomain)) {
    return specifiedDomain(dataDomain, allowDataOverflow);
  }

  if (!_isArray(specifiedDomain)) {
    return dataDomain;
  }

  var domain = [];
  /* eslint-disable prefer-destructuring */

  if (isNumber(specifiedDomain[0])) {
    domain[0] = allowDataOverflow ? specifiedDomain[0] : Math.min(specifiedDomain[0], dataDomain[0]);
  } else if (MIN_VALUE_REG.test(specifiedDomain[0])) {
    var value = +MIN_VALUE_REG.exec(specifiedDomain[0])[1];
    domain[0] = dataDomain[0] - value;
  } else if (_isFunction(specifiedDomain[0])) {
    domain[0] = specifiedDomain[0](dataDomain[0]);
  } else {
    domain[0] = dataDomain[0];
  }

  if (isNumber(specifiedDomain[1])) {
    domain[1] = allowDataOverflow ? specifiedDomain[1] : Math.max(specifiedDomain[1], dataDomain[1]);
  } else if (MAX_VALUE_REG.test(specifiedDomain[1])) {
    var _value = +MAX_VALUE_REG.exec(specifiedDomain[1])[1];

    domain[1] = dataDomain[1] + _value;
  } else if (_isFunction(specifiedDomain[1])) {
    domain[1] = specifiedDomain[1](dataDomain[1]);
  } else {
    domain[1] = dataDomain[1];
  }
  /* eslint-enable prefer-destructuring */


  return domain;
};
/**
 * Calculate the size between two category
 * @param  {Object} axis  The options of axis
 * @param  {Array}  ticks The ticks of axis
 * @param  {Boolean} isBar if items in axis are bars
 * @return {Number} Size
 */

export var getBandSizeOfAxis = function getBandSizeOfAxis(axis, ticks, isBar) {
  if (axis && axis.scale && axis.scale.bandwidth) {
    var bandWidth = axis.scale.bandwidth();

    if (!isBar || bandWidth > 0) {
      return bandWidth;
    }
  }

  if (axis && ticks && ticks.length >= 2) {
    var orderedTicks = _sortBy(ticks, function (o) {
      return o.coordinate;
    });

    var bandSize = Infinity;

    for (var i = 1, len = orderedTicks.length; i < len; i++) {
      var cur = orderedTicks[i];
      var prev = orderedTicks[i - 1];
      bandSize = Math.min((cur.coordinate || 0) - (prev.coordinate || 0), bandSize);
    }

    return bandSize === Infinity ? 0 : bandSize;
  }

  return isBar ? undefined : 0;
};
/**
 * parse the domain of a category axis when a domain is specified
 * @param   {Array}        specifiedDomain  The domain specified by users
 * @param   {Array}        calculatedDomain The domain calculated by dateKey
 * @param   {ReactElement} axisChild        The axis element
 * @returns {Array}        domains
 */

export var parseDomainOfCategoryAxis = function parseDomainOfCategoryAxis(specifiedDomain, calculatedDomain, axisChild) {
  if (!specifiedDomain || !specifiedDomain.length) {
    return calculatedDomain;
  }

  if (_isEqual(specifiedDomain, _get(axisChild, 'type.defaultProps.domain'))) {
    return calculatedDomain;
  }

  return specifiedDomain;
};
export var getTooltipItem = function getTooltipItem(graphicalItem, payload) {
  var _graphicalItem$props = graphicalItem.props,
      dataKey = _graphicalItem$props.dataKey,
      name = _graphicalItem$props.name,
      unit = _graphicalItem$props.unit,
      formatter = _graphicalItem$props.formatter,
      tooltipType = _graphicalItem$props.tooltipType,
      chartType = _graphicalItem$props.chartType;
  return _objectSpread(_objectSpread({}, filterProps(graphicalItem)), {}, {
    dataKey: dataKey,
    unit: unit,
    formatter: formatter,
    name: name || dataKey,
    color: getMainColorOfGraphicItem(graphicalItem),
    value: getValueByDataKey(payload, dataKey),
    type: tooltipType,
    payload: payload,
    chartType: chartType
  });
};