import { useState } from 'react';
import { Search, Users, MessageSquare, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useChatStore from '../../context/chatStore.js';
import Modal from '../ui/Modal.jsx';
import Avatar from '../ui/Avatar.jsx';
import Input from '../ui/Input.jsx';

const STATIC_USERS_MOCK = [
  { _id: 'user_01', username: 'Aman Sharma', email: 'aman@luxe.com', status: 'online' },
  { _id: 'user_02', username: 'Rohit Verma', email: 'rohit@luxe.com', status: 'offline' },
  { _id: 'user_03', username: 'Sneha Kapoor', email: 'sneha@luxe.com', status: 'online' },
  { _id: 'user_04', username: 'Vikram Malhotra', email: 'vikram@luxe.com', status: 'online' },
  { _id: 'user_05', username: 'Ananya Iyer', email: 'ananya@luxe.com', status: 'offline' }
];

// ✅ Pure Utility function placed outside the React render stream to satisfy strict compilers
function generateStaticId(prefix) {
  const hexPool = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < 8; i++) {
    hash += hexPool[Math.floor(Math.random() * 16)];
  }
  return prefix + '_' + hash;
}

const NewConversationModal = ({ isOpen, onClose }) => {
  const [tab, setTab]               = useState('direct'); // 'direct' | 'group'
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [selected, setSelected]     = useState([]);
  const [groupName, setGroupName]   = useState('');
  const [creating, setCreating]     = useState(false);
  
  // Custom store reactive hooks
  const addConversation = useChatStore((state) => state.addConversation);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    
    if (q.length < 2) { 
      setResults([]); 
      return; 
    }

    setSearching(true);
    
    setTimeout(() => {
      const matched = STATIC_USERS_MOCK.filter(user => 
        user.username.toLowerCase().includes(q.toLowerCase()) || 
        user.email.toLowerCase().includes(q.toLowerCase())
      );
      setResults(matched);
      setSearching(false);
    }, 250);
  };

  const handleSelectUser = (user) => {
    if (tab === 'direct') {
      startDirect(user);
    } else {
      setSelected((prev) =>
        prev.find((u) => u._id === user._id)
          ? prev.filter((u) => u._id !== user._id)
          : [...prev, user]
      );
    }
  };

  const startDirect = async (user) => {
    setCreating(true);
    try {
      const uniqueId = generateStaticId('conv');
      
      const fakeDirectConversation = {
        _id: uniqueId,
        name: user.username,
        isGroup: false,
        participants: [user],
        unreadCount: 0,
        lastMessage: null
      };

      // ✅ Calling pure reference direct calls
      addConversation(fakeDirectConversation);
      setActiveConversation(fakeDirectConversation);
      
      toast.success(`Connected with ${user.username}`);
      onClose();
      reset();
    } catch {
      toast.error('Failed to start conversation');
    } finally {
      setCreating(false);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return toast.error('Group name is required');
    if (selected.length < 1) return toast.error('Add at least one participant');
    
    setCreating(true);
    try {
      const uniqueGroupId = generateStaticId('group');

      const fakeGroupConversation = {
        _id: uniqueGroupId,
        name: groupName.trim(),
        isGroup: true,
        participants: [...selected],
        unreadCount: 0,
        lastMessage: null
      };

      // ✅ Calling pure reference direct calls
      addConversation(fakeGroupConversation);
      setActiveConversation(fakeGroupConversation);

      toast.success(`Group "${groupName}" created!`);
      onClose();
      reset();
    } catch {
      toast.error('Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const reset = () => {
    setQuery(''); 
    setResults([]); 
    setSelected([]);
    setGroupName(''); 
    setTab('direct');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); reset(); }} title="New Conversation">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-(--bg-secondary) mb-5">
        {[
          { id: 'direct', label: 'Direct Message', icon: MessageSquare },
          { id: 'group',  label: 'New Group',       icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setTab(id); setResults([]); setQuery(''); setSelected([]); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === id ? 'bg-(--bg-card) text-(--text-primary) shadow-sm' : 'text-(--text-muted)'}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Group name input */}
      {tab === 'group' && (
        <Input
          placeholder="Group name…"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mb-4"
        />
      )}

      {/* Search */}
      <Input
        placeholder="Search users by name or email…"
        icon={Search}
        value={query}
        onChange={handleSearch}
      />

      {/* Selected users */}
      {tab === 'group' && selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((u) => (
            <div key={u._id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-500 text-xs font-medium border border-brand-500/10">
              {u.username}
              <button type="button" onClick={() => setSelected((s) => s.filter((x) => x._id !== u._id))}>
                <X className="w-3 h-3 hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-3 space-y-1 max-h-56 overflow-y-auto pr-1">
        {searching ? (
          <div className="text-center py-6 text-(--text-muted) text-sm">Searching node indexes…</div>
        ) : results.length > 0 ? (
          results.map((u) => {
            const isSelected = selected.some((s) => s._id === u._id);
            return (
              <motion.button
                key={u._id}
                layout
                type="button"
                onClick={() => handleSelectUser(u)}
                disabled={creating}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left outline-none
                  ${isSelected ? 'bg-brand-500/15 ring-1 ring-brand-500/30' : 'hover:bg-(--bg-secondary)'}`}
              >
                <Avatar user={u} size="sm" showStatus />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--text-primary) truncate">{u.username}</p>
                  <p className="text-xs text-(--text-muted) truncate">{u.email}</p>
                </div>
                {isSelected && <span className="text-brand-500 text-xs font-semibold pr-1">✓</span>}
              </motion.button>
            );
          })
        ) : query.length >= 2 ? (
          <p className="text-center text-sm text-(--text-muted) py-6">No user terminals found</p>
        ) : (
          <p className="text-center text-sm text-(--text-muted) py-6">Type 2 or more characters to query</p>
        )}
      </div>

      {/* Group create button */}
      {tab === 'group' && (
        <button
          type="button"
          onClick={createGroup}
          disabled={creating || !groupName.trim() || !selected.length}
          className="btn-primary w-full mt-4"
        >
          {creating ? 'Creating Node…' : <><Plus className="w-4 h-4" /> Create Group</>}
        </button>
      )}
    </Modal>
  );
};

export default NewConversationModal;