import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '00:00',
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
      date: '2024-07-14',
      startTime: '00:00',
      endTime: '01:00',
      description: 'Event 2',
      location: 'Home',
      category: '이벤트',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
  ];
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const filteredEvents = getFilteredEvents(events, '이벤트 2', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].id).toBe('2');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].id).toBe('1');
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(2);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const filteredEvents = getFilteredEvents(events, '이벤트', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].id).toBe('1');
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(2);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const filteredEvents = getFilteredEvents(events, '이벤트 2', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].id).toBe('2');

    const filteredEventsUpperCase = getFilteredEvents(events, '이벤트 2'.toUpperCase(), new Date('2024-07-01'), 'month');
    expect(filteredEventsUpperCase).toHaveLength(1);
    expect(filteredEventsUpperCase[0].id).toBe('2');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-31'), 'month');
    expect(filteredEvents).toHaveLength(2);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const filteredEvents = getFilteredEvents([], '이벤트', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(0);
  });
});
