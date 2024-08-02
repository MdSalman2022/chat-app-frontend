import React, { useContext, useState } from "react";
import ModalBox from "../Shared/headlessui/ModalBox";
import { Button, DialogTitle } from "@headlessui/react";
import { Input } from "postcss";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";
import useChat from "../../../hooks/useChat";
import toast from "react-hot-toast";

const AddMemberModal = ({ isOpen, setIsOpen }) => {
  const { activeChat, groupMembers, contacts } = useContext(StateContext);
  const { AddParticipants } = useChat();
  const [selectedContacts, setSelectedContacts] = useState([]);
  console.log("groupMembers", groupMembers);
  const groupMemberIds = groupMembers?.map((member) => member._id);

  const allContacts = contacts?.filter(
    (contact) => !contact?.isGroup && !groupMemberIds?.includes(contact._id)
  );

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const handleAddToGroup = async () => {
    console.log("Add to group");
    const response = await AddParticipants({
      roomId: activeChat.roomId,
      participants: selectedContacts,
    });

    console.log("response", response);
    if (response.success) {
      setIsOpen(false);
      toast.success("Members added successfully");
    }
  };

  return (
    <div>
      <ModalBox isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex flex-col py-4">
          <DialogTitle className="font-bold text-white px-6 pb-4 border-b border-gray-900">
            Add Members
          </DialogTitle>
          <div className="flex flex-col px-3">
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] p-2 custom-scrollbar">
              {allContacts?.length > 0 ? (
                allContacts?.map((contact) => (
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
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-white">
                  No contacts available
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 px-6 pt-4 border-t border-gray-900">
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              className="rounded bg-red-700 py-2 px-4 text-sm text-white data-[hover]:bg-red-900 data-[active]:bg-red-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (selectedContacts.length > 0) {
                  handleAddToGroup();
                }
              }}
              className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >
              Done
            </Button>
          </div>
        </div>
      </ModalBox>
    </div>
  );
};

export default AddMemberModal;
