"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import type { Chat } from "@/lib/supabase-client";

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
              messages: [],
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
          New Chat
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
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
