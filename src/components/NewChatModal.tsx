"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Chat } from "@/lib/supabase";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chat: Chat) => void;
}

export const NewChatModal = ({
  isOpen,
  onClose,
  onChatCreated,
}: NewChatModalProps) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: insertError } = await supabase
          .from("chats")
          .insert([
            {
              title,
              // Tambahkan user_id jika menggunakan autentikasi
              // user_id: (await supabase.auth.getUser()).data.user?.id
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating chat:", insertError);
          setError("Failed to create chat. Please try again.");
          return;
        }

        if (data) {
          onChatCreated(data as Chat);
          setTitle("");
          onClose();
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [title, onClose, onChatCreated]
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-background border border-border-800 rounded-2xl p-6 z-[10000]">
        <h2 className="text-xl text-head mb-4">New Chat</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chat title..."
            className="w-full p-3 rounded-xl bg-foreground-900 text-head outline-none border border-transparent focus:border-border-700"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-foreground-900"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim() || loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
