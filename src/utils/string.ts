import { Employee } from '@/hooks/useEmployees';

export const getRandomString = (length = 7): string => Math.random().toString(36).substr(2, length);

export const isAtLeastPartialEmail = (string: string) => string.includes('@');
export const isAtLeastPartialPhone = (string: string) => string.match(/^(\+|\d)+$/g);

export const formatPhone = (phone?: string) => String(phone || '')
  .replace(/[^\d]/g, '')
  .replace(/\d(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');

export const formatMoney = (amount = 0, currency = 'RUB', locale?: string) => (
  (new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 2,
  })).format(amount)
);

export const formatNumber = (amount = 0, locale?: string) => (
  (new Intl.NumberFormat(locale, {})).format(amount)
);

export const formatDuration = (duration: number) => ([
  Math.floor(duration / 60),
  duration % 60,
].map((i) => String(i).padStart(2, '0')).join(':'));

export const formatFullName = ({ first_name, last_name }: Partial<Employee>) => ([
  first_name,
  last_name,
].filter(Boolean).join(' '));

export const copyToClipboard = async (somethingToCopy: string) => {
  try {
    await navigator.clipboard.writeText(somethingToCopy as string);
  } catch (e) {
    // @TODO implement text input polyfill
  }
};
