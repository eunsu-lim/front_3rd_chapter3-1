import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-11-01',
      startTime: '00:10',
      endTime: '01:00',
      description: 'Event 1',
      location: 'Home',
      category: '이벤트',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-11-03',
      startTime: '00:10',
      endTime: '01:00',
      description: 'Event 2',
      location: 'Home',
      category: '이벤트',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
    {
        id: '3',
        title: '회의',
        date: '2024-11-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '팀 회의',
        location: '회의실 1',
        category: '일정',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 30,
    },
    {
        id: '4',
        title: '점심',
        date: '2024-11-06',
        startTime: '12:00',
        endTime: '13:00',
        description: '식사',
        location: '식당',
        category: '일정',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 15,
    },
];

const currentDate = new Date('2024-11-04T00:00:00');

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

    expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('이벤트 1');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('이벤트 1');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);

    act(() => {
      result.current.setSearchTerm('이벤트 2');
    });

    expect(result.current.filteredEvents).toEqual([events[1]]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, currentDate, 'week'));

    expect(result.current.filteredEvents).toEqual([events[1], events[2], events[3]]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const { result } = renderHook(() => useSearch(events, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toEqual([events[2]]);

    act(() => {
      result.current.setSearchTerm('점심');
    });

    expect(result.current.filteredEvents).toEqual([events[3]]);
});
