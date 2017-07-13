// Подключаем пакет rds-content-banners.
var renderContentBanners = require('./../index');

// Мокаем adfox для того,
// чтобы показать как работает скрипт.
window.Adf = require('./adfox.mock.js');

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
