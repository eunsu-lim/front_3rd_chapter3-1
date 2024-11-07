import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { HStack, Heading, IconButton, Select, VStack } from "@chakra-ui/react";
import { MonthView, WeekView } from ".";
import { Direction, Event, View } from "../../types";

interface CalendarViewProps {
    currentDate: Date;
    view: View;
    setView: (view: View) => void;
    navigate: (direction: Direction) => void;
    events: Event[];
}

export default function CalendarView ({ currentDate, view, setView, navigate, events } : CalendarViewProps) {

    return (
        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={() => navigate('prev')}
            />
            <Select
              aria-label="view"
              value={view}
              onChange={(e) => setView(e.target.value as 'week' | 'month')}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={() => navigate('next')}
            />
          </HStack>

          {view === 'week' && <WeekView currentDate={currentDate} view={view} events={events} />}
          {view === 'month' && <MonthView currentDate={currentDate} view={view} events={events}  />}
        </VStack>
    )
}