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
