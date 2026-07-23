/* Shared types & constants */

export type Role = 'passenger' | 'driver'

/* Place names: always shown as "Тоҷикӣ (English)" */
export const CITY_TJ: Record<string, string> = {
  Dushanbe: 'Душанбе',
  Khorog: 'Хоруғ',
  Kulob: 'Кӯлоб',
  Khujand: 'Хуҷанд',
}

export const cityLabel = (en: string) => `${CITY_TJ[en] ?? en} (${en})`

/* Meeting stands per departure city (used when a driver publishes a route) */
export const CITY_STAND: Record<string, { address: string; placeName: string }> = {
  Dushanbe: {
    address: 'Badakhshan Avtostansiya, Dushanbe',
    placeName: 'Автостансияи Бадахшон (Badakhshan Avtostansiya)',
  },
  Khorog: {
    address: 'Central bus stand, Khorog',
    placeName: 'Автостансияи марказӣ, Хоруғ (Khorog central stand)',
  },
  Kulob: {
    address: 'Central bus stand, Kulob',
    placeName: 'Автостансияи Кӯлоб (Kulob stand)',
  },
  Khujand: {
    address: 'Central bus stand, Khujand',
    placeName: 'Автостансияи Хуҷанд (Khujand stand)',
  },
}

export const standFor = (city: string) =>
  CITY_STAND[city] ?? { address: city, placeName: city }

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`

export const MAPS_URL =
  'https://maps.google.com/?q=Badakhshan+bus+station+Dushanbe'

export const mapsUrlFor = (address: string) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`

/* Calendar labels (Tajik with English month names) */
export const TJ_MONTHS = [
  'Январ',
  'Феврал',
  'Март',
  'Апрел',
  'Май',
  'Июн',
  'Июл',
  'Август',
  'Сентябр',
  'Октябр',
  'Ноябр',
  'Декабр',
]

export const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const TJ_DOW = ['Дш', 'Сш', 'Чш', 'Пш', 'Ҷм', 'Шб', 'Яш']
