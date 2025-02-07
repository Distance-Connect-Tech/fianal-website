'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Loader2, ImagePlus } from 'lucide-react';
import { getAblyChannel } from '@/lib/ably';
type InitialMessage = {
  chatRoomId: string;
  message: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  imageId: string | null;
  imagePath: string | null;
  senderId: string;
  senderRole: string;
  imageUrl: string | null;
};

export default function Chat({
  chatRoomId,
  initialMessages,
  userId
}: {
  chatRoomId: string;
  initialMessages: InitialMessage[];
  userId: string;
}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation();
  const { mutateAsync: uploadImage } = api.file.chatImageUpload.useMutation();
  
 
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
        const { id: imageId, url: imageUrl, path: imagePath } = await uploadImage({
          file: base64,
          chatRoomId
        });

        sendMessage({
          chatRoomId,
          message: '📷 Image',
          imageId,
          imagePath
        });
      };
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage({ chatRoomId, message });
    setMessage('');
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg,idx) => (
          <div
            key={idx}
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="Chat attachment"
                  className="max-h-64 rounded-lg object-cover"
                />
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
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50"
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
            className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
