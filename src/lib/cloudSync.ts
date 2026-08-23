import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { storage } from "./storage";
import { Endeavor, ProgressLog, TimeBlock, UserStats, UserProfileAccount } from "../types";

export interface CloudUserData {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL?: string;
  activeProfileId: string;
  profiles: UserProfileAccount[];
  profileData: Record<
    string,
    {
      endeavors: Endeavor[];
      logs: ProgressLog[];
      timeBlocks: TimeBlock[];
      stats: UserStats;
    }
  >;
  updatedAt: string;
}

/**
 * Synchronize current local state into Firestore for the logged-in user
 */
export async function syncLocalToCloud(uid: string, userMeta: { email?: string | null; displayName?: string | null; emailVerified?: boolean }): Promise<void> {
  if (!uid) return;

  const profiles = storage.getProfiles();
  const activeProfileId = storage.getActiveProfileId();
  const profileData: Record<string, any> = {};

  profiles.forEach((p) => {
    profileData[p.id] = {
      endeavors: storage.getEndeavors(p.id),
      logs: storage.getLogs(p.id),
      timeBlocks: storage.getTimeBlocks(p.id),
      stats: storage.getStats(p.id),
    };
  });

  const cloudPayload: CloudUserData = {
    uid,
    email: userMeta.email || "",
    emailVerified: Boolean(userMeta.emailVerified),
    displayName: userMeta.displayName || profiles[0]?.name || "LifeOrbit User",
    activeProfileId,
    profiles,
    profileData,
    updatedAt: new Date().toISOString(),
  };

  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, cloudPayload, { merge: true });
    // Also save in user_workspaces for quick lookup/backup
    const workspaceRef = doc(db, "user_workspaces", uid);
    await setDoc(workspaceRef, {
      uid,
      activeProfileId,
      profileCount: profiles.length,
      totalEndeavors: Object.values(profileData).reduce((acc: number, cur: any) => acc + (cur.endeavors?.length || 0), 0),
      lastSyncedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error("Failed to sync to cloud database:", err);
    throw err;
  }
}

/**
 * Load cloud database data and populate local storage / active session
 */
export async function syncCloudToLocal(uid: string): Promise<CloudUserData | null> {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as CloudUserData;

      if (data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
        storage.saveProfiles(data.profiles);
      }
      if (data.activeProfileId) {
        storage.setActiveProfileId(data.activeProfileId);
      }
      if (data.profileData) {
        Object.entries(data.profileData).forEach(([pId, pContent]) => {
          if (pContent.endeavors) storage.saveEndeavors(pContent.endeavors, pId);
          if (pContent.logs) storage.saveLogs(pContent.logs, pId);
          if (pContent.timeBlocks) storage.saveTimeBlocks(pContent.timeBlocks, pId);
          if (pContent.stats) storage.saveStats(pContent.stats, pId);
        });
      }

      return data;
    }
    return null;
  } catch (err) {
    console.error("Failed to sync cloud to local:", err);
    return null;
  }
}

/**
 * Delete all root documents for a user from Firestore to ensure clean account deletion.
 * Note: Real production apps might need Cloud Functions to delete subcollections, 
 * but this is sufficient for client-side root deletion.
 */
export async function deleteUserCloudData(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const userDocRef = doc(db, "users", uid);
    const workspaceRef = doc(db, "user_workspaces", uid);
    await deleteDoc(userDocRef);
    await deleteDoc(workspaceRef);
  } catch (err) {
    console.error("Failed to delete user cloud data:", err);
    throw err;
  }
}
