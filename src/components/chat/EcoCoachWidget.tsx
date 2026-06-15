import { useState } from "react";
import ChatWindow from "./ChatWindow";

interface EcoCoachWidgetProps {
    score: number;
    level: number;
    stage: string;
}

export default function EcoCoachWidget({
    score,
    level,
    stage,
}: EcoCoachWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {isOpen && (
                <ChatWindow
                    onClose={() => setIsOpen(false)}
                    score={score}
                    level={level}
                    stage={stage}
                />
            )}

            <button
                onClick={() => setIsOpen(true)}
                className="
          fixed
          bottom-6
          right-6
          w-16
          h-16
          rounded-full
          bg-brand-primary
          text-white
          text-2xl
          shadow-xl
          z-50
          hover:scale-110
          transition
        "
            >
                🌱
            </button>
        </>
    );
}