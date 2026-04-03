import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface SubscriptionState {
  isPremium: boolean;
  subscriptionExpiry: string | null;
  aiUsageCount: number;
  aiUsageDate: string;
  dailyLimit: number;
  showPaywall: (feature: string) => void;
  hidePaywall: () => void;
  paywallFeature: string | null;
  incrementAiUsage: () => boolean;
  activatePremium: () => void;
}

const SubscriptionContext = createContext<SubscriptionState | null>(null);

const DAILY_AI_LIMIT = 3;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function loadFromStorage(): { isPremium: boolean; subscriptionExpiry: string | null; aiUsageCount: number; aiUsageDate: string } {
  try {
    const data = localStorage.getItem('lifeos_subscription');
    if (data) {
      return JSON.parse(data);
    }
  } catch {}
  return {
    isPremium: false,
    subscriptionExpiry: null,
    aiUsageCount: 0,
    aiUsageDate: getTodayString(),
  };
}

function saveToStorage(state: { isPremium: boolean; subscriptionExpiry: string | null; aiUsageCount: number; aiUsageDate: string }) {
  localStorage.setItem('lifeos_subscription', JSON.stringify(state));
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [storageData, setStorageData] = useState(loadFromStorage);
  const [paywallFeature, setPaywallFeature] = useState<string | null>(null);

  const isPremium = storageData.isPremium;
  const aiUsageCount = storageData.aiUsageDate === getTodayString() ? storageData.aiUsageCount : 0;
  const dailyLimit = DAILY_AI_LIMIT;

  useEffect(() => {
    saveToStorage({ ...storageData, aiUsageDate: getTodayString() });
  }, [storageData]);

  const showPaywall = useCallback((feature: string) => {
    setPaywallFeature(feature);
  }, []);

  const hidePaywall = useCallback(() => {
    setPaywallFeature(null);
  }, []);

  const incrementAiUsage = useCallback((): boolean => {
    if (isPremium) return true;

    const today = getTodayString();
    const currentCount = storageData.aiUsageDate === today ? storageData.aiUsageCount : 0;

    if (currentCount >= dailyLimit) {
      showPaywall('ai-limit');
      return false;
    }

    setStorageData(prev => ({
      ...prev,
      aiUsageCount: prev.aiUsageDate === today ? prev.aiUsageCount + 1 : 1,
      aiUsageDate: today,
    }));
    return true;
  }, [isPremium, storageData, dailyLimit, showPaywall]);

  const activatePremium = useCallback(() => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    setStorageData(prev => ({
      ...prev,
      isPremium: true,
      subscriptionExpiry: expiryDate.toISOString(),
    }));
    setPaywallFeature(null);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        subscriptionExpiry: storageData.subscriptionExpiry,
        aiUsageCount,
        aiUsageDate: storageData.aiUsageDate,
        dailyLimit,
        showPaywall,
        hidePaywall,
        paywallFeature,
        incrementAiUsage,
        activatePremium,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionState {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
