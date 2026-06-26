import { useEffect, useRef, useState, useCallback } from 'react';
import useChatStore from '../../context/chatStore.js';

const ChatWindow = () => {
    const { activeConversation, messages, msgLoading, fetchMessages } = useChatStore();
    const [replyTo, setReplyTo] = useState(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);


    const bottomRef = useRef(null);
    const containerRef = useRef(null);

    const convId   = activeConversation?._id;
    const convMsgs = messages[convId] || [];

  return (
    <div>ChatWindow</div>
  )
}

export default ChatWindow