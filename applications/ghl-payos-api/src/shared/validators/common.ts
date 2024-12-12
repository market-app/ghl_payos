export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const isVietnamPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  return /^((\+84|0)[135789]\d{8})$/.test(phoneNumber);
};

export function validStringNumber(value: string) {
  return value.match(/^\d+$/);
}

function leapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
export function validateDayMonth(dateStr: string) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (dateStr.match(regex) === null) {
    return false;
  }
  const [day, month, year] = dateStr.split('/');

  var months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  var days = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ];
  if (months.indexOf(month) != -1 && days.indexOf(day) != -1) {
    if (
      (month == '02' && day == '29' && leapYear(year) == false) ||
      (month == '02' && day == '30') ||
      (month == '02' && day == '31') ||
      (month == '04' && day == '31') ||
      (month == '06' && day == '31') ||
      (month == '09' && day == '31') ||
      (month == '11' && day == '31')
    ) {
      return false;
    } else {
      let GivenDate = year + '-' + month + '-' + day;
      var CurrentDate = new Date();
      let dateCurrentDate = new Date(GivenDate);
      dateCurrentDate = new Date(GivenDate);
      if (dateCurrentDate >= CurrentDate) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
}
