import { useState } from 'react';
import { Search, Users, MessageSquare, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatAPI } from '../../services/api.js';
import useChatStore from '../../context/chatStore.js';
import Modal from '../ui/Modal.jsx';
import Avatar from '../ui/Avatar.jsx';
import Input from '../ui/Input.jsx';

const NewConversationModal = ({ isOpen, onClose }) => {
  const [tab, setTab]               = useState('direct'); // 'direct' | 'group'
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [selected, setSelected]     = useState([]);
  const [groupName, setGroupName]   = useState('');
  const [creating, setCreating]     = useState(false);
  const { addConversation, setActiveConversation } = useChatStore();

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const { data } = await chatAPI.searchUsers(q);
      setResults(data.users);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
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
      const { data } = await chatAPI.createDirect(user._id);
      addConversation(data.conversation);
      setActiveConversation(data.conversation);
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
      const { data } = await chatAPI.createGroup({
        name: groupName,
        participants: selected.map((u) => u._id),
      });
      addConversation(data.conversation);
      setActiveConversation(data.conversation);
      onClose();
      reset();
    } catch {
      toast.error('Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const reset = () => {
    setQuery(''); setResults([]); setSelected([]);
    setGroupName(''); setTab('direct');
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

      {/* Selected users (group) */}
      {tab === 'group' && selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((u) => (
            <div key={u._id} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-500/15 text-brand-500 text-xs font-medium">
              {u.username}
              <button onClick={() => setSelected((s) => s.filter((x) => x._id !== u._id))}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-3 space-y-1 max-h-56 overflow-y-auto">
        {searching ? (
          <div className="text-center py-6 text-(--text-muted) text-sm">Searching…</div>
        ) : results.length > 0 ? (
          results.map((u) => {
            const isSelected = selected.some((s) => s._id === u._id);
            return (
              <motion.button
                key={u._id}
                layout
                onClick={() => handleSelectUser(u)}
                disabled={creating}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
                  ${isSelected ? 'bg-brand-500/15 ring-1 ring-brand-500/30' : 'hover:bg-(--bg-secondary)'}`}
              >
                <Avatar user={u} size="sm" showStatus />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--text-primary) truncate">{u.username}</p>
                  <p className="text-xs text-(--text-muted) truncate">{u.email}</p>
                </div>
                {isSelected && <span className="text-brand-500 text-xs font-semibold">✓</span>}
              </motion.button>
            );
          })
        ) : query.length >= 2 ? (
          <p className="text-center text-sm text-(--text-muted) py-6">No users found</p>
        ) : (
          <p className="text-center text-sm text-(--text-muted) py-6">Start typing to search</p>
        )}
      </div>

      {/* Group create button */}
      {tab === 'group' && (
        <button
          onClick={createGroup}
          disabled={creating || !groupName.trim() || !selected.length}
          className="btn-primary w-full mt-4"
        >
          {creating ? 'Creating…' : <><Plus className="w-4 h-4" /> Create Group</>}
        </button>
      )}
    </Modal>
  );
};

export default NewConversationModal;
