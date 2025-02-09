'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Loader2, ImagePlus } from 'lucide-react';
import { getAblyChannel } from '@/lib/ably';

type InitialMessage = {
  message: string | null;
  type: string;
  id: string;
  createdAt: Date;
  senderRole: string;
  imagePath: string | null;
  imageUrl?: string;
};

export default function Chat({
  chatRoomId,
  initialMessages,
  userId,
}: {
  chatRoomId: string;
  initialMessages: InitialMessage[];
  userId: string;
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess : async() => {
    
    }
  });

  useEffect(() => {
    const channel = getAblyChannel(chatRoomId);

    // Subscribe to new messages
    channel.subscribe('message', (message) => {
      setMessages((prev) => [...prev, message.data]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
      };
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendImage = () => {
    if (!imagePreview) return;
    sendMessage.mutate({
      chatRoomId,
      message: '📷 Image',
      file: imagePreview,
    });
    setImagePreview(null);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage.mutate({ chatRoomId, message });
    setMessage('');
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.id === userId ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {msg.type === 'IMAGE' ? (
                <img src={msg.imageUrl} alt="Image" className="w-full rounded-lg" />
              ) : (
                <p>{msg.message}</p>
              )}
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.createdAt).toString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-gray-50">
        {imagePreview && (
          <div className="mb-4 relative">
            <img src={imagePreview} alt="Preview" className="w-[80%] rounded-lg shadow-md" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            >
              ✕
            </button>
            <button
              onClick={handleSendImage}
              className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send Image
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}