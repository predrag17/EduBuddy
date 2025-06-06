import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sun, Moon, History, Plus, Send, View, Volume } from "lucide-react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/navbar";
import {
  createAnswer,
  fetchConversations,
  fetchMessagesForConversation,
  fetchTTS,
} from "@/service/chatbot-service";
import { ChatMessageDto, ConversationDto } from "@/model";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/components/providers/auth-provider";

export default function Chatbot() {
  const auth = useAuth();
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { theme, setTheme } = useTheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (auth?.user) {
      loadConversations();
    }
  }, [auth?.user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const conversationsData = await fetchConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { user: input, bot: "" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setProcessing(true);
    setBotThinking(true);
    setElapsedTime(0);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    try {
      const startTime = performance.now();
      const response: ChatMessageDto = await createAnswer(
        input,
        selectedConversation
      );
      const endTime = performance.now();
      const totalTime = ((endTime - startTime) / 1000).toFixed(2);

      clearInterval(timerRef.current!);

      if (auth?.user) setSelectedConversation(response.conversation.id);

      setMessages((prev) => {
        const updated = [...prev];
        updated[
          updated.length - 1
        ].bot = `${response.message} (⏱ ${totalTime}s)`;
        return updated;
      });
    } catch (error) {
      clearInterval(timerRef.current!);
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = "Error creating the answer";
        return updated;
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setBotThinking(false), 1000);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setHistoryOpen(false);
    setSelectedConversation(null);
  };

  const loadConversationMessages = async (conversationId: number) => {
    setMessages([]);
    setIsLoading(true);
    try {
      const conversationMessages: ChatMessageDto[] =
        await fetchMessagesForConversation(conversationId);

      const mappedMessages = conversationMessages.reduce<
        { user: string; bot: string }[]
      >((acc, curr) => {
        if (curr.sender === "user") {
          acc.push({ user: curr.message, bot: "" });
        } else if (curr.sender === "bot" && acc.length > 0) {
          acc[acc.length - 1].bot = curr.message;
        }
        return acc;
      }, []);

      setSelectedConversation(conversationId);
      setMessages(mappedMessages);
    } catch (error: any) {
      console.error("Error fetching messages", error);
      toast.error("Error fetching messages for this conversation!");
      setMessages([]);
      setSelectedConversation(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTS = async (text: string) => {
    setIsFetchingAudio(true);
    setIsSpeaking(true);
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const blob = await fetchTTS(text);
      setIsFetchingAudio(false);
      setIsPlayingAudio(true);

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        setIsSpeaking(false);
      };

      await audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
        throw error;
      });
    } catch (error) {
      console.error("Failed to play TTS:", error);
      setIsFetchingAudio(false);
      setIsPlayingAudio(false);
      setIsSpeaking(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col items-center justify-start px-4 sm:px-8 md:px-12 lg:px-20 pt-19 relative overflow-hidden transition-all duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-white"
      }`}
    >
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl top-1/3 left-1/4 rounded-full" />
        <div className="absolute w-96 h-96 bg-pink-500/20 blur-3xl bottom-1/4 right-1/4 rounded-full" />
      </div>

      <Card
        className={`max-w-2xl w-full mx-auto mt-6 p-6 shadow-lg rounded-2xl flex flex-col h-[70vh] border sm:max-w-full sm:h-[80vh] backdrop-blur-lg z-10 transition-all duration-300 ${
          theme === "dark"
            ? "bg-black/50 border-transparent"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="flex items-center gap-2">
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              🤖 EduBuddy
            </h2>
          </div>
          <div className="flex gap-2">
            {auth?.user && (
              <Button
                variant="ghost"
                onClick={() => setHistoryOpen(true)}
                className="p-2 rounded-full"
              >
                <History className="w-6 h-6" />
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-800" />
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 rounded-lg space-y-4 overflow-y-auto bg-transparent scrollbar-hide">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-2 w-full"
            >
              <div className="flex justify-end">
                <div
                  className={`my-6 px-4 py-2 rounded-lg max-w-[75%] sm:max-w-full shadow-md ${
                    theme === "dark"
                      ? "bg-white text-black"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.user}
                </div>
              </div>
              <div className="flex justify-start">
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] sm:max-w-full shadow-md ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.bot ||
                    (botThinking ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        Thinking... ⏳ {elapsedTime}s
                      </motion.span>
                    ) : (
                      "..."
                    ))}
                </div>
                {msg.bot && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleTTS(msg.bot)}
                    className={`mt-1 ml-2 p-2 rounded-full transition-colors relative ${
                      isSpeaking
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                    }`}
                    title="Play message"
                    disabled={isSpeaking}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: isSpeaking ? 360 : 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        repeat: isSpeaking ? Infinity : 0,
                      }}
                    >
                      <Volume className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div
          className={`flex mt-4 gap-2 border-t pt-4 w-full flex-wrap sm:flex-nowrap ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Input
            type="text"
            className={`flex-1 p-3 border rounded-lg focus:ring-2 w-full sm:w-auto min-h-[48px] ${
              theme === "dark"
                ? "border-gray-500 bg-gray-800 text-white focus:ring-blue-500"
                : "border-gray-400 bg-white text-black focus:ring-blue-400"
            }`}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !processing) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={processing}
          />
          <Button
            onClick={sendMessage}
            className={`flex items-center justify-center gap-2 p-2 rounded-lg ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={processing}
          >
            {processing ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-50 p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat History</h3>
              <Button variant="ghost" onClick={() => setHistoryOpen(false)}>
                Close
              </Button>
            </div>

            <div className="flex justify-between items-center mb-2">
              <Button
                onClick={startNewChat}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> New Chat
              </Button>
            </div>

            <ScrollArea className="flex-1 space-y-2 overflow-auto mt-2">
              <div className="p-3 border rounded-lg text-sm break-words dark:border-gray-700">
                <ul className="space-y-4">
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.id}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <span>{conversation.title}</span>
                      <Button
                        onClick={() => {
                          loadConversationMessages(conversation.id);
                          setHistoryOpen(false);
                        }}
                      >
                        <View />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isFetchingAudio || isPlayingAudio) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center space-y-6"
            >
              {isFetchingAudio ? (
                <>
                  <div className="flex justify-center items-center">
                    <LoadingSpinner />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generating audio...
                  </p>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="flex items-end gap-1 h-10">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-blue-500 rounded"
                          animate={{ height: ["20%", "100%", "30%"] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    EduBuddy is speaking...
                  </p>
                  <Button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                      }
                      setIsPlayingAudio(false);
                      setIsSpeaking(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Stop Audio
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
