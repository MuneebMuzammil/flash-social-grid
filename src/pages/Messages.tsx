
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender_profile?: {
    username: string;
    avatar_url: string;
  };
}

interface Conversation {
  user_id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    // This is a simplified version - in a real app you'd have a more complex query
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .limit(10);

    if (profiles) {
      setConversations(profiles.map(profile => ({
        user_id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        last_message: 'Start a conversation',
        created_at: new Date().toISOString()
      })));
    }
  };

  const fetchMessages = async (userId: string) => {
    if (!user) return;

    try {
      // Get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      if (messagesData && messagesData.length > 0) {
        // Get unique sender IDs
        const senderIds = [...new Set(messagesData.map(message => message.sender_id))];
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', senderIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setMessages([]);
        } else {
          // Create a map of user_id to profile
          const profileMap = new Map();
          profilesData?.forEach(profile => {
            profileMap.set(profile.id, profile);
          });

          // Combine messages with profiles
          const messagesWithProfiles = messagesData.map(message => ({
            ...message,
            sender_profile: profileMap.get(message.sender_id) || { username: 'Unknown User', avatar_url: null }
          }));

          setMessages(messagesWithProfiles);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: selectedConversation,
        content: newMessage.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } else {
      setNewMessage('');
      fetchMessages(selectedConversation);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <div className="pt-16 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6 flex gap-4">
          {/* Conversations List */}
          <Card className="w-1/3 p-4">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.user_id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.user_id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedConversation(conversation.user_id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5">
                      <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                        {conversation.avatar_url ? (
                          <img src={conversation.avatar_url} alt={conversation.username} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{conversation.username}</p>
                      <p className="text-sm text-gray-500 truncate">{conversation.last_message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
