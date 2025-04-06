const SAVED_LISTINGS_KEY = 'saved_listings';

export const getLocalSavedListings = (): string[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(SAVED_LISTINGS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveListingLocally = (listingId: string | number): void => {
  if (typeof window === 'undefined') return;
  const saved = getLocalSavedListings();
  const listingIdStr = String(listingId);
  if (!saved.includes(listingIdStr)) {
    localStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify([...saved, listingIdStr]));
  }
};

export const removeListingLocally = (listingId: string | number): void => {
  if (typeof window === 'undefined') return;
  const saved = getLocalSavedListings();
  const listingIdStr = String(listingId);
  localStorage.setItem(
    SAVED_LISTINGS_KEY,
    JSON.stringify(saved.filter((id) => id !== listingIdStr))
  );
};

export const syncLocalSavedListings = async (userId: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  const localSaved = getLocalSavedListings();
  
  if (localSaved.length === 0) return;

  try {
    // Save each local listing to the server
    for (const listingId of localSaved) {
      await fetch('/api/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });
    }

    // Clear local storage after successful sync
    localStorage.removeItem(SAVED_LISTINGS_KEY);
  } catch (error) {
    console.error('Error syncing saved listings:', error);
  }
}; 