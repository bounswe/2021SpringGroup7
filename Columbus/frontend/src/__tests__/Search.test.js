import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostSearchPage, { getNewDate, getMaxDayByYearAndMonth} from '../pages/Search/PostSearchPage'


test('Get max days from 31 month', () => {
  expect(getMaxDayByYearAndMonth(2021, 12)).toBe(31);
});

test('Get max days from 31 month again', () => {
    expect(getMaxDayByYearAndMonth(2021, 10)).toBe(31);
  });

test('Get max days from year which is divisible by 4', () => {
    expect(getMaxDayByYearAndMonth(2020, 2)).toBe(29);
});

test('Get max days from year from 30 month', () => {
    expect(getMaxDayByYearAndMonth(2020, 4)).toBe(30);
});

test('Century check', () => {
    const dateType = "century"
    const searchParams = new URLSearchParams()
    searchParams.set("date", 13)
    expect(getNewDate(searchParams, dateType)).toBe(13);
});


test('Decade check', () => {
    const dateType = "decade"
    const searchParams = new URLSearchParams()
    searchParams.set("date", 18)
    expect(getNewDate(searchParams, dateType)).toBe("180s");
});

test('Decade check again', () => {
    const dateType = "decade"
    const searchParams = new URLSearchParams()
    searchParams.set("date", 181)
    expect(getNewDate(searchParams, dateType)).toBe("1810s");
});

test('Specific date type check year', () => {
    const dateType = "specific"
    const searchParams = new URLSearchParams()
    searchParams.set("startYear", "2022")
    expect(getNewDate(searchParams, dateType)).toStrictEqual({startDate: {
        year: 2022,
        month: NaN,
        day: NaN
      }, endDate: {
            year: NaN,
            month: NaN,
            day: NaN
      }});
});

test('Specific date type check start year with end year', () => {
    const dateType = "specific"
    const searchParams = new URLSearchParams()
    searchParams.set("startYear", "2021")
    searchParams.set("endYear", "2022")
    expect(getNewDate(searchParams, dateType)).toStrictEqual({startDate: {
        year: 2021,
        month: NaN,
        day: NaN
      }, endDate: {
            year: 2022,
            month: NaN,
            day: NaN
      }});
});


test('Specific date type check start year month and day with end year', () => {
    const dateType = "specific"
    const searchParams = new URLSearchParams()
    searchParams.set("startYear", "2021")
    searchParams.set("startMonth", "11")
    searchParams.set("startDay", "30")
    searchParams.set("endYear", "2022")
    expect(getNewDate(searchParams, dateType)).toStrictEqual({startDate: {
        year: 2021,
        month: 11,
        day: 30
      }, endDate: {
            year: 2022,
            month: NaN,
            day: NaN
      }});
});


test('Check render', () => {
    render(<PostSearchPage/>)
})


