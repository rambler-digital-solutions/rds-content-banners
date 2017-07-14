/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// Подключаем пакет rds-content-banners.
var renderContentBanners = __webpack_require__(1);

// Мокаем adfox для того,
// чтобы показать как работает скрипт.
window.Adf = __webpack_require__(2);

// Определяем рекламные места с настройками для проекта.
// В данном случае этот проект - motor.ru.
const banners = {
  root: '.article__body > .article__content',
  nodes: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', '.widget'],
  floats: ['.widget-image_left', '.widget-image_right'],
  looped: true,
  places: [
    { // Center
      offset: 400,
      haveToBeAtLeast: 500,
      method: 'sspScroll',
      className: 'adv-content adv-content_desktop adv-content_ad-center',
      bannerOptions: {
        p1: 'bwuqo',
        p2: 'fomw',
        pct: 'a',
        puid6: window.puids.puid_6,
        puid15: window.puids.puid_15,
        puid18: window.puids.puid_18
      },
      looped: true,
      begunOptions: {
        'begun-auto-pad': '433126276',
        'begun-block-id': '446857984'
      }
    },

    { // in_read
      offset: 500,
      haveToBeAtLeast: 200,
      method: 'sspScroll',
      siblingId: 'in_read',
      className: 'adv-content adv-content_desktop adv-content_in-read in-read in_read',
      bannerOptions: {
        p1: 'brzkf',
        p2: 'fcvb',
        pct: 'a',
        puid6: window.puids.puid_6,
        puid15: window.puids.puid_15,
        puid18: window.puids.puid_18
      },
      looped: false,
      begunOptions: {
        'begun-auto-pad': '433126276',
        'begun-block-id': '433128196'
      }
    },

    { // native3
      offset: 750,
      haveToBeAtLeast: 500,
      method: 'sspScroll',
      className: 'adv-content adv-content_desktop adv-content__native adv-content_native-3',
      bannerOptions: {
        p1: 'bvqmb',
        p2: 'fjgk',
        pct: 'a',
        puid6: window.puids.puid_6,
        puid15: window.puids.puid_15,
        puid18: window.puids.puid_18
      },
      looped: true,
      begunOptions: {
        'begun-auto-pad': '433126276',
        'begun-block-id': '435349782'
      }
    }
  ]
};

// Инициализируем все необходимые рекламные места.
renderContentBanners(banners);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var defaults = {
  contentTags: ['P'],
  headersTags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
  looped: false
};

var placeDefaults = {
  offset: 1000,
  looped: false,
  haveToBeAtLeast: 500,
  method: 'sspScroll',
  siblingId: ''
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
    var isContentTag = options.contentTags.includes(node.nodeName);
    var isHeaderTag = options.headersTags.includes(node.nodeName);
    if (!isContentTag && !isHeaderTag) {
      return false;
    }

    length += getNodeLength(node);
    if (length >= place.haveToBeAtLeast) {
      return true;
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
      var banner = '<div id="' + id + '"></div>';
      var sibling = place.siblingId ? '<div id="' + place.siblingId + '"></div>' : '';
      node.insertAdjacentHTML('afterEnd', banner + sibling);

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
        console.info('[rds-content-banners] [#' + id + '] Баннер был инициализирован с помощью метода ' + callback.name + ' (параметры инициализации ниже).');
        console.log({id: id, method: callback.name, el: node, arguments: callback.arguments});
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
    validateProperty(place, 'siblingId', 'string');
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function draw(id, method, className, bannerOptions, begunOptions) {
  var blocks = [];

  var title = 'Контентный баннер <u>#' + id + '</u>. Вызван с помощью метода "<u>' + method + '</u>".';
  blocks.push('<h3 style="font-size: 18px; color: #111111; margin: 0; padding: 0;">' + title + '</h3>');

  var description = 'Контейнеру присвоен класс "<u>' + className + '</u>".<br/><br/>Все стили баннера определяются на стороне сайта.';
  blocks.push('<p style="font-size: 14px; color: #666666; margin: 10px 0 0; padding: 0; line-height: 1.5;">' + description + '</p>');

  var node = document.getElementById(id);
  node.innerHTML =
    '<div class="' + className + '" style="background: #e0e0e0; padding: 25px; line-height: 1.3;">' +
      blocks.join('') +
    '</div>';
}

var processors = {
  default(method, id, bannerOptions, className) {
    draw(id, method, className, bannerOptions);
  },

  ssp(method, id, bannerOptions, begunOptions, className) {
    draw(id, method, className, bannerOptions, begunOptions);
  }
};


function create(name, processor) {
  return processor.bind(processor, name);
}

module.exports = {
  banner: {
    show: create('show', processors.default),
    showRich: create('showRich', processors.default),
    showScroll: create('showScroll', processors.default),
    show_b: create('show_b', processors.ssp),
    showScroll_b: create('showScroll_b', processors.ssp),
    ssp: create('ssp', processors.ssp),
    sspScroll: create('sspScroll', processors.ssp),
    sspRich: create('sspRich', processors.ssp)
  }
};


/***/ })
/******/ ]);