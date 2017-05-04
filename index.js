var defaults = {
  offset: 1000,
  haveToBeAtLeast: 500,
  method: 'sspScroll'
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

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
      for (var i = 0; i < symbols.length; i++) {
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
  for (var i = 0; i < nodes.length; i++) {
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

function isApproved(node) {
  return node.nodeName === 'P';
}

function isApprovedByPrevious(nodes, index, place, floats) {
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

function isApprovedByNext(nodes, index, place, floats) {
  var length = 0;
  for (var i = index + 1; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.nodeName === 'P') {
      length += getNodeLength(node);
      if (length >= place.haveToBeAtLeast) {
        return true;
      }
    } else {
      return false;
    }
  }

  return false;
}

function drawPlace(id, place) {
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

  window.Adf.banner[place.method].apply(window.Adf.banner, methodArguments);
}

function fillPlaces(nodes, places, floats) {
  var index = 0;
  var stdout = '';
  for (var i in places) {
    var place = places[i];
    for (var ii = index; ii < nodes.length; ii++) {
      var node = nodes[ii];
      var text = node.innerText;
      index = ii;

      if (text) {
        stdout += text;

        // get flags
        var isTooLong = stdout.length > place.offset;
        var isAllowedByLength = place.haveToBeAtLeast
          ? getNodesLength(nodes, ii) > place.haveToBeAtLeast : true;

        // append mock if needed
        if (isTooLong
          && isAllowedByLength
          && isApproved(nodes[ii])
          && isApprovedByPrevious(nodes, ii, place, floats)
          && isApprovedByNext(nodes, ii, place, floats)
        ) {
          stdout = '';
          index = ii + 1;

          // append mock for the place
          var id = 'content-banner-' + index;
          node.insertAdjacentHTML('afterEnd', '<div id="' + id + '"></div>');
          drawPlace(id, place);
          break;
        }
      }
    }
  }
}

function validateProperty(source, path, type) {
  var value = source;
  var parts = path.split('.');
  for(var i in parts) {
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

module.exports = function(options) {
  validateProperty(options, 'root', 'string');
  validateProperty(options, 'places', 'array');
  validateProperty(options, 'nodes', 'array');
  validateProperty(options, 'floats', 'array');

  var places = [];
  for (var i = 0; i < options.places.length; i++) {
    var place = objectAssign({}, defaults, options.places[i], { index: i });
    validateProperty(options, 'places.' + i + '.offset', 'number');
    validateProperty(options, 'places.' + i + '.haveToBeAtLeast', 'number');
    validateProperty(options, 'places.' + i + '.className', 'string');
    validateProperty(options, 'places.' + i + '.method', 'string');
    validateProperty(options, 'places.' + i + '.bannerOptions', 'object');
    places.push(place);
  }

  // merge and deduplicate selectors
  var floatsSelectors = options.floats;
  var nodesSelectors = deduplicate(options.nodes.concat(floatsSelectors));

  // get nodes lists
  var nodesList = document.querySelectorAll(buildRootSelector(options.root, nodesSelectors));
  var floatsList = document.querySelectorAll(buildRootSelector(options.root, floatsSelectors));

  // convert lists to the arrays
  var nodes = Array.prototype.slice.call(nodesList);
  var floats = Array.prototype.slice.call(floatsList);

  // fill the places
  fillPlaces(nodes, places, floats);
};
