/* Shared types & constants (prototype mock data) */

export type Role = 'passenger' | 'driver'
export type SeatId = 'front' | 'm1' | 'b2'
export type SeatPrices = Record<SeatId, number>

export const SEAT_INFO: Record<SeatId, { price: number; label: string }> = {
  front: { price: 400, label: 'Front seat' },
  m1: { price: 350, label: 'Middle seat' },
  b2: { price: 300, label: 'Back seat' },
}

export const RIDES = [
  {
    id: 'bs',
    initials: 'BS',
    name: 'Bakhtiyor S.',
    rating: 4.8,
    rides: 56,
    from: 300,
    filled: 3,
    total: 6,
    car: 'Land Cruiser · Бадахшон (Badakhshan) stand',
    badge: 'Filling fast' as string | null,
  },
  {
    id: 'fk',
    initials: 'FK',
    name: 'Firdavs K.',
    rating: 4.6,
    rides: 31,
    from: 280,
    filled: 2,
    total: 7,
    car: 'Starex minivan · Бадахшон (Badakhshan) stand',
    badge: null as string | null,
  },
  {
    id: 'kn',
    initials: 'KN',
    name: 'Karim N.',
    rating: 4.9,
    rides: 112,
    from: 300,
    filled: 1,
    total: 6,
    car: 'Land Cruiser · leaves tomorrow',
    badge: null as string | null,
  },
]

/* Place names: always shown as "Тоҷикӣ (English)" */
export const CITY_TJ: Record<string, string> = {
  Dushanbe: 'Душанбе',
  Khorog: 'Хоруғ',
  Kulob: 'Кӯлоб',
  Khujand: 'Хуҷанд',
}

export const cityLabel = (en: string) => `${CITY_TJ[en] ?? en} (${en})`

export const DRIVER_PHONE = '+992 93 555 0117'

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`

export const MAPS_URL =
  'https://maps.google.com/?q=Badakhshan+bus+station+Dushanbe'

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
