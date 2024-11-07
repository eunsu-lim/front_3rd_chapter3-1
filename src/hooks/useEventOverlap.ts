import { useState } from 'react';
import { Event, EventForm } from '../types';
import { findOverlappingEvents } from '../utils/eventOverlap';
import { useToast } from '@chakra-ui/react';
import { useEventOperations } from '../hooks/useEventOperations';
import { useEventForm } from '../hooks/useEventForm';

export const useEventOverlap = (events: Event[]) => {
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const toast = useToast();
  const { saveEvent } = useEventOperations(false, () => {});
  const { 
    title, date, startTime, endTime, description, location, category, 
    isRepeating, repeatType, repeatInterval, repeatEndDate, notificationTime, 
    editingEvent, resetForm, startTimeError, endTimeError 
  } = useEventForm();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      resetForm();
    }
  };

  const handleOverlapConfirm = async () => {
    setIsOverlapDialogOpen(false);
    await saveEvent({
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    });
    resetForm();
  };

  return {
    isOverlapDialogOpen,
    setIsOverlapDialogOpen,
    overlappingEvents,
    addOrUpdateEvent,
    handleOverlapConfirm,
  };
};