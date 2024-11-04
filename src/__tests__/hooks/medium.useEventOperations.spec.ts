import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

// ? Medium: 아래 toastFn과 mock과 이 fn은 무엇을 해줄까요?
const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});



it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => expect(result.current.events).not.toHaveLength(0));
  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '일정 로딩 완료!' })
  );
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  setupMockHandlerCreation(); 
    const { result } = renderHook(() => useEventOperations(false));

    await act(async () => {
      await result.current.saveEvent({
        title: 'New Event',
        date: '2024-11-05',
        startTime: '09:00',
        endTime: '10:00',
        description: 'test',
        location: 'home',
        category: 'event',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 30
      });
    });

    expect(toastFn).toHaveBeenCalledWith(
      expect.objectContaining({ title: '일정이 추가되었습니다.' })
    );
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
  setupMockHandlerUpdating();

  const { result } = renderHook(() => useEventOperations(true));

    await act(async () => {
      await result.current.saveEvent({
        id: '1',
        title: 'Updated Event',
        date: '2024-11-05',
        startTime: '10:00',
        endTime: '12:00',
        description: 'test',
        location: 'home',
        category: 'event',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 30
      });
    });

    expect(toastFn).toHaveBeenCalledWith(
      expect.objectContaining({ title: '일정이 수정되었습니다.' })
    );
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  setupMockHandlerDeletion();

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '일정이 삭제되었습니다.' })
  );
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server Error' }))
    })
  );
  renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(toastFn).toHaveBeenCalledWith(
      expect.objectContaining({ title: '이벤트 로딩 실패' })
    );
  });
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  server.use(
    http.put('/api/events/:id', (req, res, ctx) => {
      return (
        res(ctx.status(404), ctx.json({ error: 'Event Not Found' }))
      )
    })
  );
  const { result } = renderHook(() => useEventOperations(true));

  await act(async () => {
    await result.current.saveEvent({
      id: 'non-existent-id',
      title: 'Non-Existent Event',
      date: '2024-11-05',
      startTime: '09:00',
      endTime: '10:00',
      description: 'test',
        location: 'home',
        category: 'event',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 30
    });
  });

  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '일정 저장 실패' })
  );
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  server.use(
    http.delete('/api/events/:id', (req, res, ctx) => {
      return res(
        ctx.status(500), 
        ctx.json({ error: 'Server Error' })
      )
    })
  );
  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.deleteEvent('non-existent-id');
  });

  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '일정 삭제 실패' })
  );
});
