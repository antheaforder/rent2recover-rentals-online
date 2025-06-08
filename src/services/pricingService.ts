
import { differenceInDays } from "date-fns";

export interface PricingBreakdown {
  total: number;
  breakdown: string;
  details: {
    months?: { count: number; rate: number; total: number };
    weeks?: { count: number; rate: number; total: number };
    days?: { count: number; rate: number; total: number };
  };
  duration: number;
}

export interface CategoryPricing {
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
}

export const calculateOptimalPricing = (
  startDate: Date,
  endDate: Date,
  pricing: CategoryPricing
): PricingBreakdown => {
  const totalDays = differenceInDays(endDate, startDate) + 1;
  
  // Calculate different billing scenarios
  const dailyOnly = totalDays * pricing.dailyRate;
  
  let bestTotal = dailyOnly;
  let bestBreakdown = `${totalDays} days @ R${pricing.dailyRate}/day`;
  let bestDetails = {
    days: { count: totalDays, rate: pricing.dailyRate, total: dailyOnly }
  };

  // Try weekly + daily combination
  if (totalDays >= 7) {
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const weeklyTotal = (weeks * pricing.weeklyRate) + (remainingDays * pricing.dailyRate);
    
    if (weeklyTotal < bestTotal) {
      bestTotal = weeklyTotal;
      bestBreakdown = weeks > 0 ? `${weeks} week${weeks > 1 ? 's' : ''} @ R${pricing.weeklyRate}/week` : '';
      if (remainingDays > 0) {
        bestBreakdown += bestBreakdown ? ` + ${remainingDays} days @ R${pricing.dailyRate}/day` : `${remainingDays} days @ R${pricing.dailyRate}/day`;
      }
      bestDetails = {
        ...(weeks > 0 && { weeks: { count: weeks, rate: pricing.weeklyRate, total: weeks * pricing.weeklyRate } }),
        ...(remainingDays > 0 && { days: { count: remainingDays, rate: pricing.dailyRate, total: remainingDays * pricing.dailyRate } })
      };
    }
  }

  // Try monthly + weekly + daily combination
  if (totalDays >= 30) {
    const months = Math.floor(totalDays / 30);
    const remainingAfterMonths = totalDays % 30;
    const weeks = Math.floor(remainingAfterMonths / 7);
    const days = remainingAfterMonths % 7;
    
    const monthlyTotal = (months * pricing.monthlyRate) + (weeks * pricing.weeklyRate) + (days * pricing.dailyRate);
    
    if (monthlyTotal < bestTotal) {
      bestTotal = monthlyTotal;
      bestBreakdown = months > 0 ? `${months} month${months > 1 ? 's' : ''} @ R${pricing.monthlyRate}/month` : '';
      if (weeks > 0) {
        bestBreakdown += bestBreakdown ? ` + ${weeks} week${weeks > 1 ? 's' : ''} @ R${pricing.weeklyRate}/week` : `${weeks} week${weeks > 1 ? 's' : ''} @ R${pricing.weeklyRate}/week`;
      }
      if (days > 0) {
        bestBreakdown += bestBreakdown ? ` + ${days} days @ R${pricing.dailyRate}/day` : `${days} days @ R${pricing.dailyRate}/day`;
      }
      bestDetails = {
        ...(months > 0 && { months: { count: months, rate: pricing.monthlyRate, total: months * pricing.monthlyRate } }),
        ...(weeks > 0 && { weeks: { count: weeks, rate: pricing.weeklyRate, total: weeks * pricing.weeklyRate } }),
        ...(days > 0 && { days: { count: days, rate: pricing.dailyRate, total: days * pricing.dailyRate } })
      };
    }
  }

  return {
    total: bestTotal,
    breakdown: bestBreakdown,
    details: bestDetails,
    duration: totalDays
  };
};

export const getPricingRecommendation = (days: number): string => {
  if (days <= 6) {
    return "Daily billing is most cost-effective for short rentals.";
  } else if (days <= 29) {
    return "Weekly billing provides better value for medium-term rentals.";
  } else {
    return "Monthly billing offers the best savings for long-term rentals.";
  }
};
