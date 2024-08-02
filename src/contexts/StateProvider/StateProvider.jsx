import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { v4 as uuidv4 } from "uuid";

import io from "socket.io-client";
const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
  withCredentials: true,
});
export const StateContext = createContext();

const StateProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);

  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setContacts([]);
    setActiveChat(null);
    setMessages([]);
  };

  const [messageIds, setMessageIds] = useState(new Set());

  console.log("messageIds", messageIds);

  useEffect(() => {
    if (user) {
      fetchContacts();

      fetchMessages(activeChat?.roomId)
        .then((historicalMessages) => {
          if (Array.isArray(historicalMessages)) {
            setMessages(historicalMessages);
            setMessageIds(
              new Set(historicalMessages.map((msg) => msg.messageId))
            );
          } else {
            setMessages([]);
            setMessageIds(new Set());
          }
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
          setMessages([]);
          setMessageIds(new Set());
        });

      const handleNewMessage = (message) => {
        console.log("New message received:", message);
        if (message?.roomId === activeChat?.roomId) {
          setMessages((prevMessages) => {
            if (!messageIds.has(message.messageId)) {
              setMessageIds((prevIds) =>
                new Set(prevIds).add(message.messageId)
              );
              return [
                ...(Array.isArray(prevMessages) ? prevMessages : []),
                message,
              ];
            }
            return prevMessages;
          });
        } else {
          console.log("Message for different room:", message.roomId);
        }
      };
      socket.on("message", handleNewMessage);
      // socket.on("message", (message) => {
      //   console.log("socket message", message);
      //   if (message.roomId === activeChat?.roomId) {
      //     setMessages((prevMessages) => [...prevMessages, message]);
      //   }
      // });
      return () => {
        socket.off("message", handleNewMessage);
      };
    }
  }, [user, activeChat]);

  const fetchMessages = async (roomId) => {
    if (roomId === undefined) return [];
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/messages?roomId=${roomId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  const fetchContacts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user/contacts?userId=${user._id}`
    );
    const datajson = await response.json();
    setContacts(datajson);
  };

  const sendMessage = (content) => {
    if (activeChat) {
      const message = {
        messageId: uuidv4(),
        roomId: activeChat.roomId,
        sender: user._id,
        senderName: user.username,
        receiver: activeChat._id,
        content,
      };
      socket.emit("message", message);
    }
  };

  const stateInfo = {
    handleLogout,
    contacts,
    setContacts,
    activeChat,
    setActiveChat,
    messages,
    setMessages,
    socket,
    sendMessage,
    groupMembers,
    setGroupMembers,
  };

  return (
    <StateContext.Provider value={stateInfo}>{children}</StateContext.Provider>
  );
};

export default StateProvider;
