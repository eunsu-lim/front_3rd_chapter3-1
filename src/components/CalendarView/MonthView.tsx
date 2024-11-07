import { Box, HStack, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { useCalendarView } from "../../hooks/useCalendarView";
import { formatDate, formatMonth, getEventsForDay, getWeeksAtMonth } from "../../utils/dateUtils";
import { WEEK_DAYS } from "../../constants";
import { useSearch } from "../../hooks/useSearch";
import { useNotifications } from "../../hooks/useNotifications";
import { BellIcon } from "@chakra-ui/icons";
import { Event, View } from "../../types";

interface MonthViewProps {
  currentDate: Date;
  view: View;
  events: Event[];
}

export default function MonthView ({ currentDate, view, events }: MonthViewProps) {


    const { notifiedEvents } = useNotifications(events);

    const { holidays } = useCalendarView();


    const { filteredEvents } = useSearch(events, currentDate, view);

    const weeks = getWeeksAtMonth(currentDate);

    return (
      <VStack data-testid="month-view" align="stretch" w="full" spacing={4}>
        <Heading size="md">{formatMonth(currentDate)}</Heading>
        <Table variant="simple" w="full">
          <Thead>
            <Tr>
              {WEEK_DAYS.map((day) => (
                <Th key={day} width="14.28%">
                  {day}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {weeks.map((week, weekIndex) => (
              <Tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];

                  return (
                    <Td
                      key={dayIndex}
                      height="100px"
                      verticalAlign="top"
                      width="14.28%"
                      position="relative"
                    >
                      {day && (
                        <>
                          <Text fontWeight="bold">{day}</Text>
                          {holiday && (
                            <Text color="red.500" fontSize="sm">
                              {holiday}
                            </Text>
                          )}
                          {getEventsForDay(filteredEvents, day).map((event) => {
                            const isNotified = notifiedEvents.includes(event.id);
                            return (
                              <Box
                                key={event.id}
                                p={1}
                                my={1}
                                bg={isNotified ? 'red.100' : 'gray.100'}
                                borderRadius="md"
                                fontWeight={isNotified ? 'bold' : 'normal'}
                                color={isNotified ? 'red.500' : 'inherit'}
                              >
                                <HStack spacing={1}>
                                  {isNotified && <BellIcon />}
                                  <Text fontSize="sm" noOfLines={1}>
                                    {event.title}
                                  </Text>
                                </HStack>
                              </Box>
                            );
                          })}
                        </>
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    );
}