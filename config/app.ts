export type AppConfig = {
  features: {
    enabledLanguages: string[];
    enableFluencyScoring: boolean;
    enablePronunciationAnalysis: boolean;
    enableGrammarCheck: boolean;
    enableVocabularyAnalysis: boolean;
    enableProgressTracking: boolean;
    enableAudioRecording: boolean;
    enableExport: boolean;
    enableAuthentication: boolean;
  };
  settings: {
    maxAudioRecordingLength: number; // in seconds
    maxTextLength: number; // in characters
    analysisTimeout: number; // in seconds
    defaultLanguage: string;
    supportEmail: string;
    apiEndpoint: string;
    analyticsEnabled: boolean;
  };
  auth: {
    cookieExpirationTime: number; // in seconds
    tokenName: string;
    userDataName: string;
    secureOnly: boolean;
  };
};

export const appConfig: AppConfig = {
  features: {
    enabledLanguages: [
      "english",
      "spanish",
      "french",
      "german",
      "italian",
      "portuguese",
      "russian",
      "chinese",
      "japanese",
      "arabic",
    ],
    enableFluencyScoring: true,
    enablePronunciationAnalysis: true,
    enableGrammarCheck: true,
    enableVocabularyAnalysis: true,
    enableProgressTracking: true,
    enableAudioRecording: true,
    enableExport: true,
    enableAuthentication: false, // Set to true when authentication is implemented
  },
  settings: {
    maxAudioRecordingLength: 300, // 5 minutes
    maxTextLength: 5000,
    analysisTimeout: 60,
    defaultLanguage: "english",
    supportEmail: "support@fluency-checker.com",
    apiEndpoint: "/api",
    analyticsEnabled: process.env.NODE_ENV === "production",
  },
  auth: {
    cookieExpirationTime: 60 * 60 * 24 * 7, // 1 week in seconds
    tokenName: "auth_token",
    userDataName: "user_data",
    secureOnly: process.env.NODE_ENV === "production",
  },
};
