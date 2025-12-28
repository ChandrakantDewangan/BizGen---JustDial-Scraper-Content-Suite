
export interface BusinessDetails {
  name: string;
  rating: string;
  address: string;
  contact: string;
  tags: string[];
  reviewsCount?: string;
  openingHours?: string;
}

export interface MarketingContent {
  socialPost: string;
  adCopy: string;
  emailSubject: string;
  cardHtml: string;
  cardCss: string;
  imageDescription: string;
}

export interface ScrapeResult {
  details: BusinessDetails;
  sources: { title: string; uri: string }[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  SCRAPING = 'SCRAPING',
  GENERATING = 'GENERATING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  ERROR = 'ERROR'
}
