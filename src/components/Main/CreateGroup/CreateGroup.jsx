import React, { useContext, useState } from "react";
import ModalBox from "../Shared/headlessui/ModalBox";
import { Button, Description, DialogTitle, Input } from "@headlessui/react";
import clsx from "clsx";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
const CreateGroup = () => {
  const { user } = useContext(AuthContext);
  const { contacts, socket, setActiveChat, setMessages } =
    useContext(StateContext);

  const [groupName, setGroupName] = useState("");

  const [pageName, setPageName] = useState(1);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);

  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const handleCreateGroup = async () => {
    console.log("Create Group");
    try {
      const groupMembers = [user._id, ...selectedContacts];
      // Join or create the chat room
      const joinResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/chat/create-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupName, participants: groupMembers }),
        }
      );
      const joinData = await joinResponse.json();
      console.log("joinData", joinData);

      if (joinData.success) {
        setIsNewGroupModalOpen(false);
        setActiveChat({ participants: groupMembers, roomId: joinData.roomId });
        socket.emit("join", joinData.roomId);
        toast.success("Group created successfully");
      } else {
        console.error("Error creating group");
      }
    } catch (error) {
      console.error("Error joining chat:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <ModalBox isOpen={isNewGroupModalOpen} setIsOpen={setIsNewGroupModalOpen}>
        <div className="flex flex-col py-4">
          <DialogTitle className="font-bold text-white px-6 pb-4 border-b border-gray-900">
            {pageName === 2 ? "Add Members" : "Create New Group"}
          </DialogTitle>
          <div className="flex flex-col px-3">
            {pageName === 2 ? (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] p-2 custom-scrollbar">
                {contacts?.map((contact) => (
                  <div
                    key={contact._id}
                    className={`flex items-center gap-2 p-2 px-3 rounded-lg cursor-pointer ${
                      selectedContacts.includes(contact._id)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                    onClick={() => handleSelectContact(contact._id)}
                  >
                    <input
                      type="checkbox"
                      id={contact._id}
                      checked={selectedContacts.includes(contact._id)}
                      onChange={() => handleSelectContact(contact._id)}
                      className="hidden"
                    />
                    <label htmlFor={contact._id} className="cursor-pointer">
                      {contact.username}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pb-3">
                <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={clsx(
                    "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                  )}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 px-6 pt-4 border-t border-gray-900">
            <Button
              type="button"
              onClick={() => {
                if (pageName === 1) {
                  setIsNewGroupModalOpen(false);
                } else {
                  setPageName(1);
                }
              }}
              className="rounded bg-red-700 py-2 px-4 text-sm text-white data-[hover]:bg-red-900 data-[active]:bg-red-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (pageName === 1) {
                  setPageName(2);
                } else {
                  handleCreateGroup();
                }
              }}
              className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >
              {pageName === 1 ? "Next" : "Create Group"}
            </Button>
          </div>
        </div>
      </ModalBox>
      <button
        onClick={() => setIsNewGroupModalOpen(true)}
        className="h-10 flex justify-center items-center w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
      >
        New Group
      </button>
    </div>
  );
};

export default CreateGroup;
