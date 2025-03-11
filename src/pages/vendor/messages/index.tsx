
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { sampleAgents } from "@/data/sampleData";
import { Send } from "lucide-react";

// Mock message data
const mockMessages = [
  {
    id: '1',
    senderId: '2', // Agent Smith
    receiverId: '3', // Vendor Jones
    content: 'Hello, I wanted to discuss the terms of our new contract.',
    timestamp: '2023-09-15T10:30:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '3', // Vendor Jones
    receiverId: '2', // Agent Smith
    content: 'Hi Agent Smith, I would be happy to discuss this. What specific points are you concerned about?',
    timestamp: '2023-09-15T11:15:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '2', // Agent Smith
    receiverId: '3', // Vendor Jones
    content: 'I think we should review the pricing structure and delivery timeline.',
    timestamp: '2023-09-15T11:45:00Z',
    read: true,
  },
  {
    id: '4',
    senderId: '4', // Sarah Johnson
    receiverId: '3', // Vendor Jones
    content: 'Hi Vendor Jones, are you available for a call tomorrow to review our agreement?',
    timestamp: '2023-09-16T09:00:00Z',
    read: false,
  },
];

export default function VendorMessages() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [localMessages, setLocalMessages] = useState(mockMessages);
  
  // Filter contacts (agents who have sent messages to this vendor)
  const uniqueContacts = [...new Set(mockMessages
    .filter(msg => msg.receiverId === user?.id || msg.senderId === user?.id)
    .map(msg => msg.senderId === user?.id ? msg.receiverId : msg.senderId)
  )];
  
  const contacts = sampleAgents.filter(agent => uniqueContacts.includes(agent.id));
  
  // Filter messages for active chat
  const chatMessages = localMessages.filter(
    msg => 
      (msg.senderId === user?.id && msg.receiverId === activeChat) ||
      (msg.receiverId === user?.id && msg.senderId === activeChat)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const activeContact = sampleAgents.find(agent => agent.id === activeChat);
  
  const handleSendMessage = () => {
    if (messageText.trim() && activeChat) {
      const newMessage = {
        id: `new-${Date.now()}`,
        senderId: user?.id || '',
        receiverId: activeChat,
        content: messageText.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setLocalMessages([...localMessages, newMessage]);
      setMessageText('');
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your agents</p>
      </div>
      
      <Card className="overflow-hidden border-border/50">
        <div className="grid md:grid-cols-12 h-[calc(100vh-240px)]">
          <div className="md:col-span-4 lg:col-span-3 border-r border-border/40">
            <CardHeader className="px-4 py-5">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <div className="overflow-y-auto h-[calc(100%-70px)]">
              {contacts.length > 0 ? contacts.map(contact => {
                const lastMessage = localMessages
                  .filter(msg => 
                    (msg.senderId === user?.id && msg.receiverId === contact.id) ||
                    (msg.receiverId === user?.id && msg.senderId === contact.id)
                  )
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                
                const unreadCount = localMessages.filter(
                  msg => msg.receiverId === user?.id && msg.senderId === contact.id && !msg.read
                ).length;
                
                return (
                  <div 
                    key={contact.id}
                    className={`
                      flex items-center gap-3 p-4 border-b border-border/30 cursor-pointer hover:bg-muted/50 transition-colors
                      ${activeChat === contact.id ? 'bg-muted' : ''}
                    `}
                    onClick={() => setActiveChat(contact.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${contact.name}&background=2563EB&color=fff`} />
                      <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{contact.name}</p>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="p-4 text-center text-muted-foreground">
                  No conversations yet
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-8 lg:col-span-9 flex flex-col">
            {activeChat ? (
              <>
                <div className="border-b border-border/40 p-4 flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${activeContact?.name || ''}&background=2563EB&color=fff`} />
                    <AvatarFallback>{activeContact?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activeContact?.name}</p>
                    <p className="text-xs text-muted-foreground">{activeContact?.email}</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map(message => {
                    const isFromMe = message.senderId === user?.id;
                    
                    return (
                      <div key={message.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          isFromMe 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-4 border-t border-border/40">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose an agent from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
