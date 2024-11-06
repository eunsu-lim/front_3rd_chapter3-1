import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const current = new Date('2024-11-03T00:00:00');

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
  ];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const notifiedEvents: string[] = [];
    const upcomingEvents = getUpcomingEvents(events, current, notifiedEvents);
    expect(upcomingEvents).toHaveLength(1); 
    expect(upcomingEvents).toEqual(expect.arrayContaining([events[1]]));
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const notifiedEvents: string[] = ['2'];
    const excludesEvents = getUpcomingEvents(events, current, notifiedEvents);
    expect(excludesEvents).toHaveLength(0); 
    expect(excludesEvents).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const notifiedEvents: string[] = [];
    const now = new Date('2024-11-03T00:09:00');
    const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);
    expect(upcomingEvents).not.toContainEqual([events[1]]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const notifiedEvents: string[] = [];
    const upcomingEvents = getUpcomingEvents(events, current, notifiedEvents);
    expect(upcomingEvents).not.toContainEqual([events[0]]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
      id: '3',
      title: '이벤트 3',
      date: '2024-11-04',
      startTime: '00:10',
      endTime: '01:00',
      description: 'Event 3',
      location: 'Home',
      category: '이벤트',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    };

    const newMessage = '60분 후 이벤트 3 일정이 시작됩니다.';
    const notificationMessage = createNotificationMessage(event);

    expect(notificationMessage).toBe(newMessage);
  });
});
