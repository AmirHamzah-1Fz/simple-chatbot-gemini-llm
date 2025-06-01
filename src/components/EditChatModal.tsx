"use client";

import { useState, useCallback } from "react";
import type { Chat } from "@/lib/supabase-client";

interface EditChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | null;
  onEditChat: (chat: Chat, newTitle: string) => Promise<void>;
}

export const EditChatModal = ({
  isOpen,
  onClose,
  chat,
  onEditChat,
}: EditChatModalProps) => {
  const [title, setTitle] = useState(chat?.title || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim() || !chat) return;

      setLoading(true);
      setError(null);

      try {
        await onEditChat(chat, title.trim());
        setTitle("");
        onClose();
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [title, onClose, onEditChat, chat]
  );

  if (!isOpen || !chat) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-[90%] max-w-[400px] bg-background border border-border-800 rounded-2xl p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-xl text-primary mb-4">
          Edit Chat
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chat title..."
            className="w-full p-3 rounded-xl placeholder:text-body text-head bg-foreground-900 outline-none border border-primary focus:border-primary transition-colors"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-foreground-900 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!title.trim() || loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
