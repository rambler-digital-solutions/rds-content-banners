var defaults = {
  contentTags: ['P'],
  headersTags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
  looped: false
};

var placeDefaults = {
  offset: 1000,
  looped: false,
  haveToBeAtLeast: 500,
  method: 'sspScroll'
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

var isDevelopment = window.location.hash.includes('development=1');

if (!Element.prototype.matches) {
  if (Element.prototype.matchesSelector) {
    Element.prototype.matches = Element.prototype.matchesSelector;
  }

  Element.prototype.matches = function(selector) {
    var matches = document.querySelectorAll(selector), th = this;
    return Array.prototype.some.call(matches, function(e) {
      return e === th;
    });
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.includes) {
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }

      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }

        k++;
      }

      return false;
    }
  });
}

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function objectAssign(target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i in symbols) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
}

function buildRootSelector(root, nodes) {
  var parts = [];
  for (var i in nodes) {
    var tag = nodes[i];
    parts.push(root + ' > ' + tag);
  }

  return parts.join(', ');
}

function getNodesLength(nodes, index) {
  var result = 0;
  for (var i = index; i < nodes.length; i++) {
    var node = nodes[i];
    result += (node && node.innerText ? node.innerText.length : 0);
  }

  return result;
}

function getNodeLength(node) {
  return node && node.innerText ? node.innerText.length : 0;
}

function isApproved(node, options) {
  // текущая нода должна быть блоком контента (параграфом)
  return options.contentTags.includes(node.nodeName);
}

function isApprovedByPrevious(nodes, index, place, floats, options) {
  var previousNode = nodes[index - 1];
  if (!previousNode) {
    return true;
  }

  // предыдущая нода не должна быть плавающей
  for (var i in floats) {
    if (floats[i] === previousNode) {
      return false;
    }
  }

  return true;
}

function isApprovedByNext(nodes, index, place, floats, options) {
  var nextNode = nodes[index + 1];
  if (!nextNode) {
    return false;
  }

  // следующая нода должна быть параграфом или заголовком
  if (!options.contentTags.includes(nextNode.nodeName)
    && !options.headersTags.includes(nextNode.nodeName)
  ) {
    return false;
  }

  // следующая нода не должна быть плавающей
  for (var i in floats) {
    if (floats[i] === nextNode) {
      return false;
    }
  }

  // после предполагаемого места вставки рекламы
  // должно быть определенное количество символов
  var length = 0;
  for (var i = index + 1; i < nodes.length; i++) {
    var node = nodes[i];
    if (options.contentTags.includes(node.nodeName)
      || options.headersTags.includes(node.nodeName)
    ) {
      length += getNodeLength(node);
      if (length >= place.haveToBeAtLeast) {
        return true;
      }
    }
  }

  return false;
}

function getAdfoxCallSettings(id, place) {
  var methodArguments;
  switch (place.method) {
    case 'show':
    case 'showRich':
    case 'showScroll':
      methodArguments = [id, place.bannerOptions, place.className];
      break;
    case 'show_b':
    case 'showScroll_b':
    case 'ssp':
    case 'sspScroll':
    case 'sspRich':
      methodArguments = [id, place.bannerOptions, place.begunOptions, place.className];
      break;
  }

  return {name: place.method, arguments: methodArguments};
}

function fillPlaces(nodes, places, floats, options) {
  var bannerIndex = 0;
  var stdout = '';

  var runtimePlaces = places;
  var loopedPlaces = places.filter(function(place) {
    return place.looped;
  });

  for (var i = 0; i < nodes.length; i++) {
    var place = runtimePlaces[bannerIndex];
    if (!place) {
      break;
    }

    var node = nodes[i];
    var text = node.innerText;
    if (!text) {
      continue;
    }

    stdout += text;

    // get flags
    var isTooLong = stdout.length > place.offset;
    var isAllowedByLength = place.haveToBeAtLeast
      ? getNodesLength(nodes, i) > place.haveToBeAtLeast : true;

    // append mock if needed
    if (isTooLong
      && isAllowedByLength
      && isApproved(nodes[i], options)
      && isApprovedByPrevious(nodes, i, place, floats, options)
      && isApprovedByNext(nodes, i, place, floats, options)
    ) {
      stdout = '';

      // append mock for the place
      var id = 'content-banner-' + i;
      node.insertAdjacentHTML('afterEnd', '<div id="' + id + '"></div>');

      // draw the banner
      var callback = getAdfoxCallSettings(id, place);
      var method = window.Adf.banner[callback.name];
      method.apply(method, callback.arguments);

      // get next banner index
      if (bannerIndex >= runtimePlaces.length - 1) {
        if (options.looped && loopedPlaces.length) {
          runtimePlaces = loopedPlaces;
          bannerIndex = 0;
        } else {
          break;
        }
      } else {
        bannerIndex++;
      }

      // log banner configuration if needed
      if (isDevelopment) {
        console.log('[content-banners] Banner #' + id + ' has been called.', callback.name, callback.arguments);
      }
    }
  }
}

function validateProperty(source, path, type) {
  var value = source;
  var parts = path.split('.');
  for (var i in parts) {
    var key = parts[i];
    value = value[key];
  }

  var valid = type === 'array' ? value instanceof Array : typeof value === type;
  if (!valid) {
    throw new Error('Property "' + path + '" of options have to be: ' + type + '.');
  }
}

function deduplicate(array) {
  var result = [];
  var cache = {};
  for (var i in array) {
    var value = array[i];
    if (!cache[value]) {
      result.push(value);
      cache[value] = true;
    }
  }

  cache = null;
  return result;
}

module.exports = function(custom) {
  var options = objectAssign({}, defaults, custom);

  validateProperty(options, 'root', 'string');
  validateProperty(options, 'places', 'array');
  validateProperty(options, 'nodes', 'array');
  validateProperty(options, 'floats', 'array');
  validateProperty(options, 'looped', 'boolean');

  var places = [];
  for (var i in options.places) {
    var place = objectAssign({}, placeDefaults, options.places[i], {index: i});
    validateProperty(place, 'offset', 'number');
    validateProperty(place, 'haveToBeAtLeast', 'number');
    validateProperty(place, 'className', 'string');
    validateProperty(place, 'method', 'string');
    validateProperty(place, 'looped', 'boolean');
    validateProperty(place, 'bannerOptions', 'object');
    places.push(place);
  }

  // merge and deduplicate selectors
  var floatsSelectors = options.floats;
  var nodesSelectors = deduplicate(options.nodes.concat(floatsSelectors));

  // get nodes lists
  var nodesList = (nodesSelectors.length) ? document.querySelectorAll(buildRootSelector(options.root, nodesSelectors)) : [];
  var floatsList = (floatsSelectors.length) ? document.querySelectorAll(buildRootSelector(options.root, floatsSelectors)) : [];

  // convert lists to the arrays
  var nodes = Array.prototype.slice.call(nodesList);
  var floats = Array.prototype.slice.call(floatsList);

  // fill the places
  fillPlaces(nodes, places, floats, options);
};
