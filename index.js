var objectAssign = require('object-assign');

var defaults = {
  offset: 1000,
  haveToBeAtLeast: 500
};

function setStyle(node, style) {
  if (!style) {
    return node;
  }

  for (var i in style) {
    node.style[i] = style[i];
  }

  return node;
}

function buildRootSelector(root, nodes) {
  return nodes.map(tag => `${root} > ${tag}`).join(', ');
}

function getLength(nodes, index) {
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
          ? getLength(nodes, ii) > place.haveToBeAtLeast : true;

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
          var mock = setStyle(document.createElement('div'), place.style);
          mock.innerHTML = `#${place.index + 1} - ${place.name}`;
          node.insertAdjacentHTML('afterEnd', mock.outerHTML);
          break;
        }
      }
    }
  }
}

function validateProperty(source, path, type) {
  var value = source;
  var parts = path.split('.');
  for (var i = 0; i < parts.length; i++) {
    value = value[i];
  }

  var valid = type === 'array' ? value instanceof Array : typeof value !== type;
  if (!valid) {
    throw new Error('Property "' + path + '" of options have to be: ' + type + '.');
  }
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
    validateProperty(options, 'places.' + i + '.callback', 'function');
    places.push(place);
  }

  // get nodes lists
  var nodesList = document.querySelectorAll(buildRootSelector(options.root, options.nodes));
  var floatsList = document.querySelectorAll(buildRootSelector(options.root, options.floats));

  // convert lists to the arrays
  var nodes = Array.prototype.slice.call(nodesList);
  var floats = Array.prototype.slice.call(floatsList);

  // fill the places
  fillPlaces(nodes, places, floats);
};


