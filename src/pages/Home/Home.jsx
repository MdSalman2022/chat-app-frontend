import React, { useContext, useEffect, useState } from "react";

import ChatWindow from "../../components/Main/ChatWindow/ChatWindow";
import Login from "../Login";
import Register from "../Register";
import { AuthContext } from "../../contexts/AuthProvider/AuthProvider";
import { StateContext } from "../../contexts/StateProvider/StateProvider";
import CreateGroup from "../../components/Main/CreateGroup/CreateGroup";
import toast from "react-hot-toast";

const Home = () => {
  const { user, handleRegister } = useContext(AuthContext);
  const {
    contacts,
    setContacts,
    activeChat,
    setActiveChat,
    messages,
    setMessages,
    handleLogout,
    socket,
    sendMessage,
    groupMembers,
    setGroupMembers,
  } = useContext(StateContext);

  console.log("activeChat", activeChat);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (phoneNumber) => {
    if (phoneNumber.trim() === "") {
      setSearchResults([]);
      return;
    }
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/user/search?phoneNumber=${phoneNumber}`
    );
    console.log("search", response);
    const datajson = await response.json();

    const filteredResults = datajson.filter(
      (result) => result._id !== user._id
    );
    setSearchResults(filteredResults);
  };

  console.log("searchResults", searchResults);

  console.log("user", user);
  const CreateChat = async (contact) => {
    console.log("contact", contact);
    if (contacts?.length > 0 && contacts.find((c) => c._id === contact?._id)) {
      setActiveChat(contact);
      setSearchResults([]);
      return;
    }
    try {
      // Join or create the chat room
      const participants = [user._id, contact._id];
      const joinResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/create-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participants: participants }),
        }
      );
      const joinData = await joinResponse.json();
      console.log("joinData", joinData);

      if (joinData.success) {
        // Set active chat and join socket room
        FindGroupInfo(joinData.roomId);
        setActiveChat({ ...contact, roomId: joinData.roomId });
        socket.emit("join", joinData.roomId);
        toast.success("Chat created successfully");
        setSearchResults([]);
      } else {
        console.error("Error creating group");
      }
    } catch (error) {
      console.error("Error joining chat:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  console.log("user", user);

  console.log("messages", messages);
  console.log("user", user);
  console.log("contacts", contacts);

  const [login, setLogin] = useState(false);

  const handleActiveChat = async (contact) => {
    const followSound = new Audio("../../assets/follow.wav");
    console.log("followSound", followSound);
    followSound.play();
    setActiveChat(contact);
    console.log("Joining room:", contact.roomId);
    socket.emit("join", contact.roomId);
    FindGroupInfo(contact.roomId);
  };

  const FindGroupInfo = async (roomId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/group-info?roomId=${roomId}`
      );
      const groupInfo = await response.json();
      const filter = groupInfo?.participants.filter(
        (participant) => participant?._id !== user._id
      );
      setGroupMembers(filter);
    } catch (error) {
      console.error("Error fetching group info:", error);
    }
  };

  // socket.onAny((eventName, ...args) => {
  //   // ...
  // });

  console.log("groupMembers", groupMembers);

  if (!user) {
    return (
      <div>
        {login ? (
          <Login setLogin={setLogin} />
        ) : (
          <Register onRegister={handleRegister} setLogin={setLogin} />
        )}
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col h-screen bg-gray-50">
      <div className="md:w-1/4 bg-[#17212b] p-6 shadow-lg flex flex-col gap-3 text-white">
        <h2 className="text-xl font-semibold text-gray-200">
          Welcome, {user.username}
        </h2>
        <CreateGroup />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by phone number"
            className="w-full border border-gray-700 rounded py-2 px-3 bg-[#242f3d] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults?.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded mt-1 z-10">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  onClick={() => CreateChat(result)}
                  className="p-3 hover:bg-gray-700 cursor-pointer transition duration-300"
                >
                  <span className="font-semibold text-gray-200">
                    {result.username}
                  </span>
                  <span className="text-gray-400">({result.phoneNumber})</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-400">Contacts</h3>
          <div className="flex flex-col overflow-y-auto">
            {contacts?.length > 0 &&
              contacts?.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => handleActiveChat(contact)}
                  className={`p-3 rounded cursor-pointer transition duration-300 ${
                    activeChat?._id === contact._id
                      ? "bg-[#2b5278] text-white"
                      : "bg-[#17212b] hover:bg-[#202b36] text-white "
                  }`}
                >
                  <span className="font-semibold text-gray-200">
                    {contact.roomName || contact.username}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-white">
        {activeChat ? (
          <div className="flex h-screen w-full">
            <ChatWindow
              activeChat={activeChat}
              messages={messages}
              sendMessage={sendMessage}
              recipient={activeChat.username}
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="bg-gray-700 text-white px-2 py-1 rounded-full font-semibold text-sm">
              Select a contact to start a conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
