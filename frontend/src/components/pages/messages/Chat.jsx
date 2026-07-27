import socket from "../../../socket";


socket.emit(
    "joinConversation",
    conversation._id
);


useEffect(() => {

    socket.on("newPulse", (message) => {

        setMessages((prev) => [
            ...prev,
            message
        ]);

    });


    return () => {
        socket.off("newPulse");
    };


}, []);