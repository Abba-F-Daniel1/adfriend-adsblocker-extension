export type ContentType = "quote" | "fact" | "reminder";

export interface ContentPayload {
  url: string;
  contentType: ContentType;
}

// Message types
export type MessageType =
  | "CONTENT_SCRIPT_READY"
  | "DISABLE_ADFRIEND"
  | "ENABLE_ADFRIEND";

export interface Message {
  type: MessageType;
}

export interface Quote {
  text: string;
  author: string;
}

export interface Fact {
  category: string;
  text: string;
}

export interface Reminder {
  title: string;
  description: string;
  type: "learning" | "health" | "productivity";
}

// Chrome declarativeNetRequest API types
export type RuleActionType = chrome.declarativeNetRequest.RuleActionType;

export type ResourceType = chrome.declarativeNetRequest.ResourceType;

export interface RuleCondition {
  urlFilter: string;
  resourceTypes: ResourceType[];
}

export interface Rule {
  id: number;
  priority: number;
  action: { type: RuleActionType };
  condition: RuleCondition;
}

// Storage interface
export interface StorageData {
  blockedCount: number;
  enabled: boolean;
  darkMode: boolean;
}

// Element tracking interface
export interface ReplacedElement {
  original: Element;
  replacement: Element;
}

// Rule interface
export interface AdRule {
  id: number;
  priority: number;
  action: {
    type: chrome.declarativeNetRequest.RuleActionType;
  };
  condition: {
    urlFilter: string;
    resourceTypes: chrome.declarativeNetRequest.ResourceType[];
  };
}
