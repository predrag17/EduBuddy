"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { createAnswer } from "@/service/chatbot-service";
import { Navbar } from "@/components/navbar";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [botThinking, setbotThinking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { theme, setTheme } = useTheme();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { user: input, bot: "", timeTaken: 0 };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setProcessing(true);
    setbotThinking(true);
    setElapsedTime(0);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    try {
      const startTime = performance.now();
      const response = await createAnswer(input);

      const botReply = response;
      const endTime = performance.now();
      const totalTime = ((endTime - startTime) / 1000).toFixed(2);

      clearInterval(timerRef.current!);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = `${botReply} (⏱ ${totalTime}s)`;
        return updated;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = "Error creating the answer";
        return updated;
      });
    } finally {
      clearInterval(timerRef.current!);
      setProcessing(false);
      setTimeout(() => setbotThinking(false), 1000);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col items-center justify-start px-4 sm:px-8 md:px-12 lg:px-20 relative overflow-hidden transition-all duration-300 pt-19 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Navbar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 " />
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
              className={`text-2xl font-bold transition-all duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              🤖 EduBuddy
            </h2>
          </div>
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
                  className={`my-6 px-4 py-2 rounded-lg max-w-[75%] sm:max-w-full shadow-md transition-all duration-300 ${
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
                  className={`px-4 py-2 rounded-lg max-w-[75%] sm:max-w-full shadow-md transition-all duration-300 ${
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
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div
          className={`flex mt-4 gap-2 border-t pt-4 w-full flex-wrap sm:flex-nowrap transition-all duration-300 ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Input
            type="text"
            className={`flex-1 p-3 border rounded-lg focus:ring-2 w-full sm:w-auto min-h-[48px] transition-all duration-300 ${
              theme === "dark"
                ? "border-gray-500 bg-gray-800 text-white focus:ring-blue-500"
                : "border-gray-400 bg-white text-black focus:ring-blue-400"
            }`}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={processing}
          />
          <Button
            onClick={sendMessage}
            disabled={processing}
            className={`px-4 py-2 rounded-lg w-full sm:w-auto min-h-[48px] transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                : "bg-gradient-to-r from-blue-300 to-purple-400 text-black hover:opacity-90"
            }`}
          >
            {processing ? "Processing..." : "Send"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
