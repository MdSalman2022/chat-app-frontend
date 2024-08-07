import React, { useContext, useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { HiDotsVertical } from "react-icons/hi";
import { IoMdTrash } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { StateContext } from "../../../contexts/StateProvider/StateProvider";

const ChatMenuModal = ({
  menuModalOpen,
  setMenuModalOpen,
  menuRef,
  setIsAddModalOpen,
}) => {
  const { activeChat } = useContext(StateContext);

  console.log("activeChat", activeChat);
  return (
    <div ref={menuRef}>
      {" "}
      <div className="text-right">
        <Menu>
          <MenuButton className="">
            <span
              onClick={() => setMenuModalOpen(!menuModalOpen)}
              className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center ${
                menuModalOpen ? "bg-[#2b5278]" : "bg-[#17212b]"
              }`}
            >
              <HiDotsVertical className="text-2xl md:text-lg sxl:text-2xl text-gray-300 hover:text-white" />
            </span>
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-52 origin-top-right rounded-xl border border-white/5 bg-[#2b5278] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {" "}
            {activeChat?.isGroup && (
              <MenuItem>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                >
                  <BsPeople className="text-xl fill-white/50" />
                  Add Member
                </button>
              </MenuItem>
            )}
            {activeChat?.isGroup && <div className="my-1 h-px bg-white/5" />}
            <MenuItem>
              <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                <IoMdTrash className="text-xl fill-white/50" />
                Delete Chat
              </button>
            </MenuItem>
            <MenuItem>
              <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                <MdClear className="text-xl fill-white/50" />
                Clear History
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default ChatMenuModal;
