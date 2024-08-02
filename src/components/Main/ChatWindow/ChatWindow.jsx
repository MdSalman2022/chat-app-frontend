// components/ChatWindow.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { HiDotsVertical } from "react-icons/hi";
import ChatMenuModal from "./ChatMenuModal";
import AddMemberModal from "./AddMemberModal";

function ChatWindow({ messages, sendMessage, recipient, activeChat }) {
  const { groupMembers } = useContext(StateContext);
  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const menuRef = useRef(null);

  console.log("menuModalOpen", menuModalOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, setMenuModalOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  console.log("groupMembers", groupMembers);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 320)}px`;
    }
  }, [newMessage]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  console.log("activeChat", activeChat);
  console.log("messages", messages);
  console.log("user chat", user);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#0e1621] text-white w-full">
      <AddMemberModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
      <div className="flex items-center justify-between bg-[#17212b] p-5">
        <div className="flex w-full font-semibold">
          {activeChat?.roomName || activeChat?.username}
        </div>

        <div>
          <ChatMenuModal
            menuModalOpen={menuModalOpen}
            setMenuModalOpen={setMenuModalOpen}
            menuRef={menuRef}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages?.length > 0 &&
          messages?.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                message?.sender === user?._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg min-w-28 max-w-xs ${
                  message?.sender === user?._id
                    ? "bg-[#2b5278] text-white"
                    : "bg-[#182533] text-white"
                }`}
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                <strong className="block mb-1">
                  {message?.sender === user?._id
                    ? "Me"
                    : groupMembers?.find(
                        (member) => member._id === message.sender
                      )?.username}
                </strong>
                {message.content}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="">
        <textarea
          ref={textareaRef}
          className="w-full p-2 bg-[#17212b] text-white resize-none overflow-y-auto outline-none scrollbar-hide"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={"Write a message..."}
          onKeyDown={handleKeyPress}
          style={{ minHeight: "40px", maxHeight: "220px" }}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
