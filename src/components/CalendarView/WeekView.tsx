import { Box, HStack, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { formatWeek, getWeekDates } from "../../utils/dateUtils";
import { BellIcon } from "@chakra-ui/icons";
import { useSearch } from "../../hooks/useSearch";
import { useNotifications } from "../../hooks/useNotifications";
import { WEEK_DAYS } from "../../constants";
import { Event, View } from "../../types";

interface WeekViewProps {
  currentDate: Date;
  view: View;
  events: Event[];
}

export default function WeekView ({ currentDate, view, events }: WeekViewProps) {

    const { notifiedEvents } = useNotifications(events);

    const { filteredEvents } = useSearch(events, currentDate, view);

    const weekDates = getWeekDates(currentDate);

    return (
      <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
        <Heading size="md">{formatWeek(currentDate)}</Heading>
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
            <Tr>
              {weekDates.map((date) => (
                <Td key={date.toISOString()} height="100px" verticalAlign="top" width="14.28%">
                  <Text fontWeight="bold">{date.getDate()}</Text>
                  {filteredEvents
                    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
                    .map((event) => {
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
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    );
}