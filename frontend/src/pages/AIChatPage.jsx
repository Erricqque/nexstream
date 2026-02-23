import { ChatProvider, ChatWindow } from 'assistant-ui';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

export default function AIChatPage() {
  const { user } = useAuth();
  
  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <ChatProvider
        apiEndpoint={`${API_BASE_URL}/ai/chat-stream`}
        headers={{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }}
      >
        <ChatWindow
          title="NexStream AI Assistant"
          placeholder="Ask me anything about content creation, MLM, or NexStream..."
          showModelSelector={true}
          showAttachmentButton={true}
          showCopyButton={true}
          allowVoiceInput={true}
        />
      </ChatProvider>
    </div>
  );
}