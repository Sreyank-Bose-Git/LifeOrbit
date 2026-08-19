import React, { useState } from "react";
import { UserProfileAccount, Category, ThemeAccent, BackgroundAnimationMode } from "../types";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  UserCheck,
  Palette,
  Eye,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

interface ProfileHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfileAccount[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (profileData: Partial<UserProfileAccount>) => void;
  onUpdateProfile: (profile: UserProfileAccount) => void;
  onDeleteProfile: (profileId: string) => void;
}

const AVATAR_PRESETS = ["🚀", "🧘", "🎨", "⚡", "🧠", "💼", "🌿", "🏆", "🔥", "🪐", "🎵", "💻", "🏹", "🌊", "🔮", "🧪"];

const ACCENT_COLORS: { id: ThemeAccent; label: string; hex: string; bg: string }[] = [
  { id: "emerald", label: "Emerald", hex: "#10b981", bg: "bg-emerald-500" },
  { id: "violet", label: "Violet", hex: "#8b5cf6", bg: "bg-violet-500" },
  { id: "amber", label: "Amber", hex: "#f59e0b", bg: "bg-amber-500" },
  { id: "cyan", label: "Cyan", hex: "#06b6d4", bg: "bg-cyan-500" },
  { id: "rose", label: "Rose", hex: "#f43f5e", bg: "bg-rose-500" },
  { id: "slate", label: "Slate", hex: "#64748b", bg: "bg-slate-500" },
];

export const ProfileHubModal: React.FC<ProfileHubModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
}) => {
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfileAccount | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Profile Form State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newMotto, setNewMotto] = useState("");
  const [newAvatar, setNewAvatar] = useState("⚡");
  const [newAccent, setNewAccent] = useState<ThemeAccent>("emerald");
  const [newBgMode, setNewBgMode] = useState<BackgroundAnimationMode>("aurora");
  const [newFocusHours, setNewFocusHours] = useState(4);

  // Edit Profile Form State
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editMotto, setEditMotto] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editAccent, setEditAccent] = useState<ThemeAccent>("emerald");
  const [editBgMode, setEditBgMode] = useState<BackgroundAnimationMode>("aurora");
  const [editFocusHours, setEditFocusHours] = useState(4);

  if (!isOpen) return null;

  const handleOpenEdit = (p: UserProfileAccount) => {
    setEditingProfile(p);
    setEditName(p.name);
    setEditRole(p.role);
    setEditMotto(p.northStarMotto);
    setEditAvatar(p.avatarIcon || "🚀");
    setEditAccent(p.themeConfig?.accent || "emerald");
    setEditBgMode(p.themeConfig?.ambientBackground || "aurora");
    setEditFocusHours(p.targetFocusHoursPerDay || 4);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    const accentObj = ACCENT_COLORS.find((c) => c.id === editAccent) || ACCENT_COLORS[0];
    const updated: UserProfileAccount = {
      ...editingProfile,
      name: editName.trim() || editingProfile.name,
      role: editRole.trim() || editingProfile.role,
      northStarMotto: editMotto.trim() || editingProfile.northStarMotto,
      avatarIcon: editAvatar,
      avatarColor: accentObj.hex,
      targetFocusHoursPerDay: editFocusHours,
      themeConfig: {
        ...editingProfile.themeConfig,
        accent: editAccent,
        ambientBackground: editBgMode,
        avatarIcon: editAvatar,
        avatarColor: accentObj.hex,
        customAppTitle: (editName.trim() || "SPACE").toUpperCase() + " OS",
      },
    };

    onUpdateProfile(updated);
    setEditingProfile(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const accentObj = ACCENT_COLORS.find((c) => c.id === newAccent) || ACCENT_COLORS[0];
    onCreateProfile({
      name: newName.trim(),
      role: newRole.trim() || "Independent Creator",
      northStarMotto: newMotto.trim() || "Master daily rhythm and achieve bold aspirations.",
      avatarIcon: newAvatar,
      avatarColor: accentObj.hex,
      targetFocusHoursPerDay: newFocusHours,
      themeConfig: {
        accent: newAccent,
        density: "balanced",
        showStreakBadges: true,
        showMilestonesOnCards: true,
        soundEffectsEnabled: true,
        ambientSoundPreset: "binaural",
        ambientBackground: newBgMode,
        avatarIcon: newAvatar,
        avatarColor: accentObj.hex,
        customAppTitle: newName.trim().toUpperCase() + " OS",
        quickLogDefaultStep: 1,
      },
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setIsCreatingNew(false);
    setNewName("");
    setNewRole("");
    setNewMotto("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-70 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCreatingNew && !editingProfile) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-4xl bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Top Glow in modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer active:scale-95 transition"
          aria-label="Close profile switcher"
        >
          <X className="w-5 h-5" />
        </button>

        {/* VIEW 1: Main Netflix-Style Profile Selector */}
        {!isCreatingNew && !editingProfile && (
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
                Multi-Space Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isManaging ? "Manage Orbit Spaces" : "Who is Orbiting Today?"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {isManaging
                  ? "Select a profile avatar to customize name, color palette, or ambient mode."
                  : "Switch effortlessly between your distinct workspaces, goals, and habits."}
              </p>
            </div>

            {/* Profile Cards Grid */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-2 pb-4">
              {profiles.map((profile) => {
                const isActive = profile.id === activeProfileId;
                const accentColor = profile.avatarColor || "#10b981";

                return (
                  <motion.div
                    key={profile.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col items-center group cursor-pointer relative"
                    onClick={() => {
                      if (isManaging) {
                        handleOpenEdit(profile);
                      } else {
                        onSelectProfile(profile.id);
                        onClose();
                      }
                    }}
                  >
                    {/* Avatar Container */}
                    <div
                      className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 shadow-xl border-2 ${
                        isActive
                          ? "border-emerald-400 ring-4 ring-emerald-500/20 shadow-emerald-500/20"
                          : "border-white/10 group-hover:border-white/40 group-hover:shadow-2xl"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}25 0%, #141414 100%)`,
                      }}
                    >
                      {/* Avatar Emoji / Icon */}
                      <span className="text-4xl sm:text-5xl select-none filter drop-shadow-md group-hover:scale-110 transition-transform">
                        {profile.avatarIcon || "🚀"}
                      </span>

                      {/* Active Checkmark Badge */}
                      {isActive && !isManaging && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-black p-1 rounded-full shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Edit Badge overlay in Manage mode */}
                      {isManaging && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                          <div className="p-2.5 bg-white/20 rounded-full group-hover:bg-emerald-500 group-hover:text-black transition">
                            <Edit2 className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Profile Name & Tag */}
                    <div className="mt-3 text-center max-w-[130px]">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition truncate">
                        {profile.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                        {profile.role || "Active Space"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Add Profile Button Card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsCreatingNew(true)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-dashed border-white/20 group-hover:border-emerald-400 bg-white/[0.02] group-hover:bg-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-all duration-200 shadow-lg">
                  <Plus className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div className="mt-3 text-center">
                  <h4 className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition">
                    Add Space
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">New Account</p>
                </div>
              </motion.div>
            </div>

            {/* Bottom Actions: Manage Toggle & Done */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-center space-x-3">
              <button
                onClick={() => setIsManaging(!isManaging)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 flex items-center space-x-2 ${
                  isManaging
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-[#141414] hover:bg-white/10 text-slate-300 border-white/10"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{isManaging ? "Done Managing" : "Manage Profiles"}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-semibold border border-white/5 cursor-pointer active:scale-95 transition"
              >
                Continue Tracking
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Create New Profile Modal */}
        {isCreatingNew && (
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create New Orbit Profile</h3>
                  <p className="text-xs text-slate-400">
                    Add a completely separate workspace for your fitness, studio, or work life.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Avatar & Colors */}
              <div className="space-y-4 bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5">
                <label className="text-xs font-bold text-slate-300 block">Choose Avatar Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {AVATAR_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewAvatar(emoji)}
                      className={`p-2 text-xl rounded-xl border transition cursor-pointer active:scale-95 ${
                        newAvatar === emoji
                          ? "bg-emerald-500/20 border-emerald-500 shadow-xs"
                          : "bg-white/5 border-transparent hover:bg-white/10"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-slate-300 block pt-2">Accent Theme Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewAccent(c.id)}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-medium transition cursor-pointer active:scale-95 ${
                        newAccent === c.id
                          ? "bg-white/15 border-white/40 text-white"
                          : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-slate-300 block pt-2">Ambient Background Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["aurora", "particles", "mesh", "none"] as BackgroundAnimationMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setNewBgMode(mode)}
                      className={`p-2 rounded-xl border text-xs capitalize font-medium transition cursor-pointer active:scale-95 ${
                        newBgMode === mode
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Name & Details */}
              <div className="space-y-4 bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Space Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marathon Training / Design Studio / Family"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Role / Focus Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Endurance Athlete / Lead Architect"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">North Star Motto</label>
                  <input
                    type="text"
                    placeholder="e.g. Unrelenting discipline creates limitless freedom."
                    value={newMotto}
                    onChange={(e) => setNewMotto(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Daily Focus Target</label>
                    <span className="text-xs font-bold text-emerald-400">{newFocusHours} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={newFocusHours}
                    onChange={(e) => setNewFocusHours(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs shadow-lg active:scale-95 transition"
              >
                Create & Switch Space
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: Edit Profile Modal */}
        {editingProfile && (
          <form onSubmit={handleSaveEdit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Profile: {editingProfile.name}</h3>
                  <p className="text-xs text-slate-400">Modify profile identity, theme styling, and ambient visuals.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Avatar & Colors */}
              <div className="space-y-4 bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5">
                <label className="text-xs font-bold text-slate-300 block">Avatar Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {AVATAR_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditAvatar(emoji)}
                      className={`p-2 text-xl rounded-xl border transition cursor-pointer active:scale-95 ${
                        editAvatar === emoji
                          ? "bg-indigo-500/20 border-indigo-500 shadow-xs"
                          : "bg-white/5 border-transparent hover:bg-white/10"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-slate-300 block pt-2">Accent Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEditAccent(c.id)}
                      className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-medium transition cursor-pointer active:scale-95 ${
                        editAccent === c.id
                          ? "bg-white/15 border-white/40 text-white"
                          : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-slate-300 block pt-2">Background Visuals</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["aurora", "particles", "mesh", "none"] as BackgroundAnimationMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEditBgMode(mode)}
                      className={`p-2 rounded-xl border text-xs capitalize font-medium transition cursor-pointer active:scale-95 ${
                        editBgMode === mode
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                          : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Name & Details */}
              <div className="space-y-4 bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Role Description</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">North Star Motto</label>
                  <input
                    type="text"
                    value={editMotto}
                    onChange={(e) => setEditMotto(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Daily Focus Target</label>
                    <span className="text-xs font-bold text-indigo-400">{editFocusHours} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={editFocusHours}
                    onChange={(e) => setEditFocusHours(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Delete Profile button (if > 1 profile) */}
                {profiles.length > 1 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete profile "${editingProfile.name}"?`)) {
                          onDeleteProfile(editingProfile.id);
                          setEditingProfile(null);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete this space</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-lg active:scale-95 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
