import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import { getUser } from "../../apiCall";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  // ===== Group creation =====
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // ===== Search friends (tự viết, không dùng Tippy) =====
  const [messengerSearchTerm, setMessengerSearchTerm] = useState("");

  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  // Socket connection
  useEffect(() => {
    socket.current = io("http://localhost:8900");

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        conversationId: data.conversationId,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Receive message
  useEffect(() => {
    if (arrivalMessage && currentChat?._id === arrivalMessage.conversationId) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Online users
  useEffect(() => {
    socket.current.emit("addUser", user._id);

    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f)),
      );
    });
  }, [user]);

  // Conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/conversations/${user._id}`,
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, [user._id]);

  // Messages
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;

      try {
        const res = await axios.get(
          `http://localhost:8800/api/messages/${currentChat._id}`,
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  // Friends
  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users/friends/${user._id}`,
        );
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getFriends();
  }, [user._id]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentChat) return;

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    if (currentChat.isGroup) {
      socket.current.emit("sendGroupMessage", {
        senderId: user._id,
        members: currentChat.members,
        text: newMessage,
        conversationId: currentChat._id,
      });
    } else {
      const receiverId = currentChat.members.find(
        (member) => member !== user._id,
      );

      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
        conversationId: currentChat._id,
      });
    }

    try {
      const res = await axios.post(
        "http://localhost:8800/api/messages",
        message,
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const openChatWithFriend = async (friend) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/conversations/find/${user._id}/${friend._id}`,
      );

      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Lọc bạn bè theo từ khóa, tự viết logic thay cho Tippy
  const filteredFriends = messengerSearchTerm
    ? friends.filter((f) =>
        f.username.toLowerCase().includes(messengerSearchTerm.toLowerCase()),
      )
    : [];

  const handleSelectSearchedFriend = (friend) => {
    openChatWithFriend(friend);
    setMessengerSearchTerm("");
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;

    if (!window.confirm("Bạn có chắc muốn xóa tin nhắn này?")) return;

    try {
      await axios.delete(`http://localhost:8800/api/messages/${messageId}`, {
        data: { sender: user._id },
      });

      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSelectedMember = (friendId) => {
    setSelectedMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const handleCreateGroup = async () => {
    // Cần tên nhóm + ít nhất 2 thành viên khác để là "nhóm" thực sự
    if (!groupName.trim() || selectedMembers.length < 2) return;

    try {
      const res = await axios.post(
        "http://localhost:8800/api/conversations/group",
        {
          name: groupName,
          members: [user._id, ...selectedMembers],
          admin: user._id,
        },
      );

      setConversations((prev) => [...prev, res.data]);
      setCurrentChat(res.data);

      setShowGroupForm(false);
      setGroupName("");
      setSelectedMembers([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentChat?.isGroup) return;

    if (!window.confirm("Bạn có chắc muốn rời nhóm này?")) return;

    try {
      await axios.put(
        `http://localhost:8800/api/conversations/group/${currentChat._id}/leave`,
        { userId: user._id },
      );

      setConversations((prev) => prev.filter((c) => c._id !== currentChat._id));
      setCurrentChat(null);
      setMessages([]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <Topbar />

      <div className="messenger">
        {/* LEFT SIDEBAR */}
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatSearchWrapper">
              <input
                placeholder="Tìm kiếm bạn bè"
                className="chatMenuInput"
                value={messengerSearchTerm}
                onChange={(e) => setMessengerSearchTerm(e.target.value)}
              />

              {messengerSearchTerm && (
                <div className="chatSearchDropdown">
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                      <div
                        key={friend._id}
                        className="chatSearchResultItem"
                        onClick={() => handleSelectSearchedFriend(friend)}
                      >
                        <img
                          className="chatSearchResultImg"
                          src={friend.avatar}
                          alt=""
                        />
                        <span>{friend.username}</span>
                      </div>
                    ))
                  ) : (
                    <span className="chatSearchEmpty">
                      Không tìm thấy kết quả
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              className="newGroupButton"
              onClick={() => setShowGroupForm((prev) => !prev)}
            >
              {showGroupForm ? "Hủy" : "+ Tạo nhóm"}
            </button>

            {showGroupForm && (
              <div className="groupForm">
                <input
                  placeholder="Tên nhóm"
                  className="chatMenuInput"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />

                <div className="groupMemberList">
                  {friends.map((friend) => (
                    <label key={friend._id} className="groupMemberOption">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(friend._id)}
                        onChange={() => toggleSelectedMember(friend._id)}
                      />
                      {friend.username}
                    </label>
                  ))}
                </div>

                <button
                  className="chatSubmitButton"
                  onClick={handleCreateGroup}
                >
                  Tạo
                </button>
              </div>
            )}

            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                currentUser={user}
                onClick={() => setCurrentChat(conversation)}
              />
            ))}
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                {currentChat.isGroup && (
                  <div className="chatBoxHeader">
                    <div className="chatBoxHeaderInfo">
                      <GroupAvatar conversation={currentChat} size="large" />
                      <span>{currentChat.name || "Nhóm chat"}</span>
                    </div>

                    <button
                      className="leaveGroupButton"
                      onClick={handleLeaveGroup}
                    >
                      Rời nhóm
                    </button>
                  </div>
                )}

                <div className="chatBoxTop">
                  {messages.map((message) => (
                    <div key={message._id || message.createdAt} ref={scrollRef}>
                      <MessageItem
                        message={message}
                        own={message.sender === user._id}
                        isGroup={currentChat.isGroup}
                        onDelete={handleDeleteMessage}
                      />
                    </div>
                  ))}
                </div>

                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="viết gì đó..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleEnterKey}
                  />

                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Gửi
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>

        {/* ONLINE FRIENDS */}
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {onlineFriends.map((friend) => (
              <div
                key={friend._id}
                className="chatOnlineFriend"
                onClick={() => openChatWithFriend(friend)}
              >
                <div className="chatOnlineImgContainer">
                  <img className="chatOnlineImg" src={friend.avatar} alt="" />
                  <div className="chatOnlineBadge"></div>
                </div>

                <span className="chatOnlineName">{friend.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   Group Avatar
   (avatar admin nằm trước, 1 avatar khác lệch phía sau,
   badge nhỏ ở góc hiện số thành viên còn lại)
========================= */

function GroupAvatar({ conversation, size }) {
  const [admin, setAdmin] = useState(null);
  const [secondMember, setSecondMember] = useState(null);

  useEffect(() => {
    const otherMemberId = conversation.members.find(
      (m) => m !== conversation.admin,
    );

    const fetchAvatars = async () => {
      try {
        if (conversation.admin) {
          const res = await axios.get(
            `http://localhost:8800/api/users?userId=${conversation.admin}`,
          );
          setAdmin(res.data);
        }

        if (otherMemberId) {
          const res2 = await axios.get(
            `http://localhost:8800/api/users?userId=${otherMemberId}`,
          );
          setSecondMember(res2.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAvatars();
  }, [conversation.admin, conversation.members]);

  // Số thành viên ngoài 2 avatar đang hiển thị (admin + 1 người)
  const extraCount = conversation.members.length - 2;

  return (
    <div
      className={`groupAvatarStack ${size === "large" ? "groupAvatarStackLarge" : ""}`}
    >
      <img className="groupAvatarBack" src={secondMember?.avatar} alt="" />

      {/* Avatar người tạo nhóm luôn nằm trên, không bị che */}
      <img className="groupAvatarFront" src={admin?.avatar} alt="" />

      {extraCount > 0 && (
        <div className="groupAvatarCountBadge">+{extraCount}</div>
      )}
    </div>
  );
}

/* =========================
   Conversation Item
========================= */

function ConversationItem({ conversation, currentUser, onClick }) {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    // Nhóm thì không cần tìm "friend" đơn lẻ
    if (conversation.isGroup) return;

    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getFriend = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?userId=${friendId}`,
        );

        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getFriend();
  }, [conversation, currentUser]);

  if (conversation.isGroup) {
    return (
      <div className="conversation" onClick={onClick}>
        <GroupAvatar conversation={conversation} />

        <span className="conversationName">
          {conversation.name || "Nhóm chat"}
        </span>
      </div>
    );
  }

  return (
    <div className="conversation" onClick={onClick}>
      <img className="conversationImg" src={friend?.avatar} alt="" />

      <span className="conversationName">{friend?.username}</span>
    </div>
  );
}

/* =========================
   Message Item
========================= */

function MessageItem({ message, own, isGroup, onDelete }) {
  const [sender, setSender] = useState(null);

  useEffect(() => {
    getUser(message.sender, setSender);
  }, [message]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={sender?.avatar} alt="" />

        <div>
          {isGroup && !own && (
            <p className="messageSenderName">{sender?.username}</p>
          )}
          <p className="messageText">{message.text}</p>
        </div>

        {own && message._id && (
          <span
            className="messageDeleteIcon"
            title="Xóa tin nhắn"
            onClick={() => onDelete(message._id)}
          >
            ✕
          </span>
        )}
      </div>

      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
