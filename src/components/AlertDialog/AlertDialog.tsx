import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { Event } from "../../types";

interface AlertDialogComponentProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    overlappingEvents: Event[];
    handleConfirm: () => void;
}

export default function AlertDialogComponent ({ 
    open, 
    setOpen, 
    overlappingEvents, 
    handleConfirm 
}: AlertDialogComponentProps) {

    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <AlertDialog
            isOpen={open}
            leastDestructiveRef={cancelRef}
            onClose={() => setOpen(false)}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    일정 겹침 경고
                </AlertDialogHeader>

                <AlertDialogBody>
                    다음 일정과 겹칩니다:
                    {overlappingEvents.map((event) => (
                        <Text key={event.id}>
                        {event.title} ({event.date} {event.startTime}-{event.endTime})
                        </Text>
                    ))}
                    계속 진행하시겠습니까?
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setOpen(false)}>
                    취소
                </Button>
                <Button
                    colorScheme="red"
                    onClick={handleConfirm}
                    ml={3}
                >
                    계속 진행
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}