var defaults = {
  looped: false
};

var placeDefaults = {
  offset: 1000,
  haveToBeAtLeast: 500,
  method: 'sspScroll'
};


var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

var isDevelopment = window.location.hash.indexOf('development=1') !== -1;

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
  for(var i in options.nodes){
    if(node.matches(options.nodes[i])){
      return true;
      break;
    }
  }
}

function isApprovedByPrevious(nodes, index, place, floats, options) {
  var node = nodes[index - 1];
  if (!node) {
    return true;
  }

  for (var i in floats) {
    if (floats[i] === node) {
      return false;
    }
  }

  return true;
}

function isApprovedByNext(nodes, index, place, floats, options) {
  var length = 0;

  var nextNode = nodes[index + 1];
  for (var i in floats) {
    if (floats[i] === nextNode) {
      return false;
    }
  }

  //count text length after banner
  for (var i = index + 1; i < nodes.length; i++) {
    var node = nodes[i];
    for(var ii in options.nodes){
      if(node.matches(options.nodes[ii])){
        length += getNodeLength(node);
        if (length >= place.haveToBeAtLeast) {
          return true;
          break;
        }
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

  return { name: place.method, arguments: methodArguments };
}

function fillPlaces(nodes, places, floats, options) {
  var bannerIndex = 0;
  var stdout = '';
  
  for (var i in nodes){
    i = +i;
    var node = nodes[i];
    var text = node.innerText;
    var place = places[bannerIndex];

    if (!text) {
      continue;
    }

    // remove deleted banners place
    if (options.looped && typeof place == 'undefined') {
      places = places.reduce(function (placesNew, place, index) {
        if (typeof place !== 'undefined') {
          place.index = index;
          placesNew.push(place);
        }
        return placesNew;
      }, []);
      
      place = (bannerIndex < places.length) ? places[bannerIndex] : places[0];
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

      // To loop or not to loop, that is the question!
      if (options.looped) {
        if (place.inLoop === false) {
          delete places[bannerIndex];
        }
        bannerIndex = (bannerIndex + 1 < places.length) ? bannerIndex + 1 : 0;
      } else {
        if(bannerIndex == places.length) break;
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

  //Element.matches polyfill
  (function(e){
    e.matches || (e.matches = e.matchesSelector || function(selector){
      var matches = document.querySelectorAll(selector), th = this;
      return Array.prototype.some.call(matches, function(e){
         return e === th;
      });
    });
  })(Element.prototype);

  validateProperty(custom, 'root', 'string');
  validateProperty(custom, 'places', 'array');
  validateProperty(custom, 'nodes', 'array');
  validateProperty(custom, 'floats', 'array');
  validateProperty(custom, 'looped', 'boolean');

  var options = objectAssign({}, defaults, custom);

  var places = [];
  for (var i in options.places) {
    var place = objectAssign({}, placeDefaults, options.places[i], { index: i });
    validateProperty(place, 'offset', 'number');
    validateProperty(place, 'haveToBeAtLeast', 'number');
    validateProperty(place, 'className', 'string');
    validateProperty(place, 'method', 'string');
    (place.inLoop) ? validateProperty(place, 'inLoop', 'boolean') : place.inLoop = false;
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