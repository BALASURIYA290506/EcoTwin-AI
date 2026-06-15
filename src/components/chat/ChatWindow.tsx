import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { askEcoTwinAI } from "../../utils/gemini";


interface ChatWindowProps {
    onClose: () => void;

    score: number;
    level: number;
    stage: string;
}

export default function ChatWindow({
    onClose,
    score,
    level,
    stage,
}: ChatWindowProps) {

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<{
        role: "user" | "assistant";
        content: string;
    }[]>([
        {
            role: "assistant",
            content: `🌱 Hi! I'm EcoCoach!

Current EcoTwin Score: ${score}

Choose an area to improve:

🍽 Food
🚗 Travel
⚡ Energy
♻ Waste`,
        },
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        if (!loading) {
            inputRef.current?.focus();
        }
    }, [loading]);

    async function handleSend() {
        if (!message.trim()) return;

        const userMessage = message;

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const history = messages
                .map((m) => `${m.role}: ${m.content}`)
                .join("\n");

            const reply = await askEcoTwinAI(
                userMessage,
                score,
                level,
                stage,
                history
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: reply,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "⚠️ Something went wrong. Please try again.",
                },
            ]);
        }

        setLoading(false);
    }

    return (
        <div className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-brand-primary text-white px-5 py-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold">
                            EcoCoach 🌱
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[11px] opacity-80">
                                Online
                            </span>
                        </div>
                    </div>
                    <p className="text-xs opacity-80">
                        AI Sustainability Mentor
                    </p>
                </div>

                <button onClick={onClose}>
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        role={msg.role}
                        content={msg.content}
                    />
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-200 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
                                <span
                                    className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                                    style={{ animationDelay: "0.15s" }}
                                />
                                <span
                                    className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                                    style={{ animationDelay: "0.3s" }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-3 flex gap-2">
                <input
                    ref={inputRef}
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 border border-slate-300 rounded-xl px-3 py-2 outline-none"
                />

                <button
                    onClick={handleSend}
                    className="bg-brand-primary text-white px-4 rounded-xl"
                >
                    ➤
                </button>
            </div>
        </div>
    );
}