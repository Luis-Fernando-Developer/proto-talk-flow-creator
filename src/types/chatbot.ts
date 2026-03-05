export type NodeType =  "bubble" | "input" | "input_number";

export type ChatNode = {
  id: string;
  type: NodeType;
  content?: string;
  next?: string;
};

export type Message = {
  from: "bot" | "user";
  content_message: string;
};

export type Session = {
  id: string;
  currentNodeId: string;
  messages: Message[];
};

// types/chatbot.ts
export type BotResponse = {
  sessionId: string;
  messages: Message[];
  waitingInput: boolean;
};
