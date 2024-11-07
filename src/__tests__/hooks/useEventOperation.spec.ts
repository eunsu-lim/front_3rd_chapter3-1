import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventOverlap } from '../../hooks/useEventOverlap';
import { Event } from '../../types';


vi.mock('@chakra-ui/react', () => ({
  useToast: () => vi.fn(),
}));

vi.mock('../utils/eventOverlap', () => ({
    findOverlappingEvents: vi.fn(),
  }));

vi.mock('../../hooks/useEventOperations', () => ({
  useEventOperations: () => ({
    saveEvent: vi.fn(),
  }),
}));

vi.mock('../../hooks/useEventForm', () => ({
  useEventForm: () => ({
    title: 'Test Event',
    date: '2024-11-08',
    startTime: '09:00',
    endTime: '10:00',
    description: 'Test Description',
    location: 'Test Location',
    category: 'Test Category',
    isRepeating: false,
    repeatType: 'none',
    repeatInterval: 1,
    repeatEndDate: null,
    notificationTime: 30, // 문자열 대신 숫자로 변경
    editingEvent: null,
    resetForm: vi.fn(),
    startTimeError: null,
    endTimeError: null,
  }),
}));

describe('useEventOverlap', () => {
  const sampleEvent: Event = {
    id: '1',
    title: 'Sample Event',
    date: '2024-11-10',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Description',
    location: 'Location',
    category: 'Category',
    repeat: { type: 'none', interval: 0, endDate: undefined },
    notificationTime: 30,
  };

  const sampleEvents = [sampleEvent];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('초기 상태값이 올바르게 설정되어야 합니다', () => {
    const { result } = renderHook(() => useEventOverlap(sampleEvents));

    expect(result.current.isOverlapDialogOpen).toBe(false);
    expect(result.current.overlappingEvents).toEqual([]);
  });

  it('addOrUpdateEvent 함수 호출', () => {
    const events: Event[] = []; 
    
    const { result } = renderHook(() => useEventOverlap(events));
    
    act(() => {
      result.current.addOrUpdateEvent();
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
    expect(result.current.overlappingEvents).toHaveLength(0);
  });


  it('handleOverlapConfirm 이벤트 정상 저장 후 다이얼로그가 닫혀야합니다.', async () => {
    const { result } = renderHook(() => useEventOverlap(sampleEvents));

    await act(async () => {
      await result.current.handleOverlapConfirm();
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
    expect(result.current.overlappingEvents).toHaveLength(0);
  });
 

  it('setIsOverlapDialogOpen으로 다이얼로그 상태를 변경할 수 있어야 합니다', () => {
    const { result } = renderHook(() => useEventOverlap(sampleEvents));

    act(() => {
      result.current.setIsOverlapDialogOpen(true);
    });
    expect(result.current.isOverlapDialogOpen).toBe(true);

    act(() => {
      result.current.setIsOverlapDialogOpen(false);
    });
    expect(result.current.isOverlapDialogOpen).toBe(false);
  });
});

