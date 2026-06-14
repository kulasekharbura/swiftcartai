'use client';

import { useState, useEffect } from 'react';
import type { HouseholdProfile } from '@/types/index';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';

const STORAGE_KEY = 'swiftcart_household_profile';

const defaultProfile: HouseholdProfile = {
  householdSize: 2,
  diet: 'non-vegetarian',
  budget: 'standard',
};

interface HouseholdProfileProps {
  onProfileChange: (profile: HouseholdProfile) => void;
}

export function HouseholdProfilePanel({ onProfileChange }: HouseholdProfileProps) {
  const [profile, setProfile] = useState<HouseholdProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as HouseholdProfile;
        setProfile(parsed);
        onProfileChange(parsed);
      } catch {
        // Use defaults
      }
    }
    setHasLoaded(true);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    onProfileChange(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof HouseholdProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!hasLoaded) return null;

  const dietLabel = profile.diet === 'non-vegetarian' ? 'Non-Veg' : profile.diet === 'vegetarian' ? 'Vegetarian' : 'Vegan';
  const dietEmoji = profile.diet === 'vegan' ? '🌱' : profile.diet === 'vegetarian' ? '🥬' : '🍗';
  const budgetEmoji = profile.budget === 'budget' ? '💰' : profile.budget === 'premium' ? '💎' : '🏷️';

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <Card>
        <CardContent className="p-4">
          {!isEditing ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  👨‍👩‍👧‍👦 {profile.householdSize} {profile.householdSize === 1 ? 'person' : 'people'}
                </Badge>
                <Badge variant="secondary">
                  {dietEmoji} {dietLabel}
                </Badge>
                <Badge variant="secondary">
                  {budgetEmoji} {profile.budget.charAt(0).toUpperCase() + profile.budget.slice(1)}
                </Badge>
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#131A22]">Household Profile</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#131A22] mb-1">
                    Household Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={profile.householdSize}
                    onChange={(e) => handleChange('householdSize', Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-2 border border-[#D5D9D9] rounded-lg text-sm text-[#131A22] focus:ring-2 focus:ring-[#FF9900]/20 focus:border-[#FF9900] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#131A22] mb-1">
                    Diet
                  </label>
                  <select
                    value={profile.diet}
                    onChange={(e) => handleChange('diet', e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5D9D9] rounded-lg text-sm text-[#131A22] focus:ring-2 focus:ring-[#FF9900]/20 focus:border-[#FF9900] outline-none transition-all"
                  >
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#131A22] mb-1">
                    Budget
                  </label>
                  <select
                    value={profile.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5D9D9] rounded-lg text-sm text-[#131A22] focus:ring-2 focus:ring-[#FF9900]/20 focus:border-[#FF9900] outline-none transition-all"
                  >
                    <option value="budget">Budget</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
