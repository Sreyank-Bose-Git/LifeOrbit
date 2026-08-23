import React, { useState } from "react";
import { X, User, Trash2, LogOut, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, deleteUser, signOut, FirebaseUser, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, GoogleAuthProvider } from "../lib/firebase";
import { deleteUserCloudData } from "../lib/cloudSync";
import { storage } from "../lib/storage";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  onDataCleared: () => void;
}

export function AccountSettingsModal({ isOpen, onClose, currentUser, onDataCleared }: AccountSettingsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  if (!isOpen || !currentUser) return null;

  const performDeletion = async (skipDataDeletion = false) => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const uid = currentUser.uid;
      
      // 1. Delete data from firestore first, if not already done
      if (!skipDataDeletion) {
        await deleteUserCloudData(uid);
      }
      
      // 2. Delete the user account from Firebase Auth
      await deleteUser(currentUser);
      
      // 3. Clear local storage so the next guest session is fresh
      storage.clearAllData();
      onDataCleared();
      
      onClose();
    } catch (error: any) {
      console.warn("Delete account error:", error);
      
      if (error.code === 'auth/requires-recent-login') {
        const isGoogle = currentUser.providerData.some(p => p.providerId === 'google.com');
        if (isGoogle) {
          try {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(currentUser, provider);
            // After successful re-auth, data is already deleted, just delete the user
            await deleteUser(currentUser);
            storage.clearAllData();
            onDataCleared();
            onClose();
          } catch (reauthErr) {
            console.warn("Re-auth error:", reauthErr);
            setErrorMsg("Failed to verify your identity. Please log out and log back in to try again.");
            setIsDeleting(false);
          }
        } else {
          setErrorMsg("Session expired. Please log out and log back in to delete your account.");
          setIsDeleting(false);
        }
      } else {
        setErrorMsg(error.message || "Failed to delete account. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const isGoogle = currentUser.providerData.some(p => p.providerId === 'google.com');

    if (isGoogle) {
      setShowGoogleConfirm(true);
    } else {
      // For email/password, show password confirmation input
      setShowPasswordConfirm(true);
    }
  };

  const handleConfirmGoogleDelete = async () => {
    await performDeletion();
  };

  const handleConfirmPasswordDelete = async () => {
    if (!passwordConfirm) {
      setErrorMsg("Please enter your password to confirm deletion.");
      return;
    }
    
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email || "", passwordConfirm);
      await reauthenticateWithCredential(currentUser, credential);
      await performDeletion(false);
    } catch (err: any) {
      console.warn("Re-auth password error:", err);
      setErrorMsg("Incorrect password or session expired. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear local storage on sign out as well
      storage.clearAllData();
      onDataCleared();
      onClose();
    } catch (error: any) {
      console.warn("Sign out error:", error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 relative">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              Account Settings
            </h2>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Account Info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Signed in as</div>
              <div className="text-white font-medium">{currentUser.email}</div>
              {currentUser.displayName && (
                <div className="text-slate-400 text-sm mt-1">{currentUser.displayName}</div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-sm text-rose-200 leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!showPasswordConfirm && !showGoogleConfirm ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete Account Permanently
                  </button>
                </>
              ) : showGoogleConfirm ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-4">
                  <div className="text-sm text-rose-200">
                    Are you absolutely sure you want to delete your account? This action cannot be undone and will erase all your cloud data.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowGoogleConfirm(false)}
                      className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmGoogleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Confirm Delete"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-4">
                  <div className="text-sm text-rose-200">
                    Please enter your password to confirm account deletion. This cannot be undone.
                  </div>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 bg-black/50 border border-rose-500/30 rounded-lg text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPasswordConfirm(false)}
                      className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPasswordDelete}
                      disabled={isDeleting || !passwordConfirm}
                      className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Confirm Delete"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center text-xs text-slate-500 pt-2">
              Deleting your account will permanently erase your user data from the cloud.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
