export type ContentType = 'quote' | 'fact' | 'reminder';

export interface ContentPayload {
  url: string;
  contentType: ContentType;
}

export interface Message {
  type: 'REPLACE_AD' | 'CONTENT_SCRIPT_READY' | 'BACKGROUND_READY' | 'AD_TRANSFORMED';
  payload?: ContentPayload;
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
  type: 'learning' | 'health' | 'productivity';
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