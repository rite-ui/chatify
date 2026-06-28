import { useState } from 'react';
import { Camera, User, Mail,  Save } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../context/authStore.js';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Avatar from '../ui/Avatar.jsx';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile(form);
    setSaving(false);
    if (result.success) {
      toast.success('Profile updated! ✅');
      onClose();
    } else {
      toast.error(result.message || 'Update failed');
    }
  };

  const previewUser = { ...user, ...form };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-5">
        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar user={previewUser} size="xl" />
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center border-2 border-(--bg-card)">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-xs text-(--text-muted)">Avatar is auto-generated from your username</p>
        </div>

        {/* Avatar URL override */}
        <Input
          label="Avatar URL (optional)"
          type="url"
          placeholder="https://…"
          icon={Camera}
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />

        <Input
          label="Username"
          type="text"
          icon={User}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          minLength={3}
          maxLength={20}
        />

        {/* Email (read-only) */}
        <div>
          <label className="text-sm font-medium text-(--text-primary) block mb-1.5">Email</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-(--bg-secondary) border border-(--border) opacity-60">
            <Mail className="w-4 h-4 text-(--text-muted)" />
            <span className="text-sm text-(--text-muted)">{user?.email}</span>
            {user?.isVerified && (
              <span className="ml-auto text-xs text-emerald-500 font-medium">✓ Verified</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-(--text-primary) block mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell people about yourself…"
            maxLength={150}
            rows={3}
            className="input-field resize-none"
          />
          <p className="text-xs text-(--text-muted) text-right mt-1">{form.bio.length}/150</p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving…' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
