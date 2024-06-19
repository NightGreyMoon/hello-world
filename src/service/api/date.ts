import { request } from '../request';

export function getRecenDates(count?: number, year?: number, month?: number, day?: day) {
  if (year === undefined || month === undefined || day === undefined) {
    return request<DateOptions[]>({
      url: `/Date/GetRecent?count=${count}`,
      method: 'get'
    });
  }

  return request<DateOptions[]>({
    url: `/Date/GetRecent?count=${count}&date=${year}-${month}-${day}`,
    method: 'get'
  });
}
