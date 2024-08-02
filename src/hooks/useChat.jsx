import React from "react";

const useChat = () => {
  const AddParticipants = async (payload) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/add-participants`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        return [];
        // throw new Error(`HTTP error! status: ${response.status}`);
      }
      const room = await response.json();
      return room;
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      return [];
      // throw error;
    }
  };

  return { AddParticipants };
};

export default useChat;
