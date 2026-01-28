# How to Update Schedule Page Events

## ✅ Quick Fix: Events Are Now Synced!

The events section and schedule page now use the **same centralized data source** at `src/data/events.ts`. This means:

- ✅ **Single source of truth** - Update events in ONE place
- ✅ **Automatic sync** - Both pages stay in sync automatically
- ✅ **Dance & Rap Battle are separate** - They're now two distinct events (id 10 and 11)

## 📝 How to Update Events

### Step 1: Edit the Centralized File

Open **`src/data/events.ts`** and edit the `ALL_EVENTS` array.

### Step 2: Update Event Fields

Each event has these fields:

```typescript
{
  id: number,                    // Unique ID
  title: string,                 // Schedule page title
  eventTitle?: string,           // Events section title (if different)
  category: string,              // Category filter (ESPORTS, CSE, etc.)
  department?: string,           // Department badge
  description: string,           // Short description (events section)
  scheduleDescription?: string, // Long description (schedule page)
  date: string,                  // Event date
  image: string,                 // Image path
  scheduleImage?: string,        // Different image for schedule (optional)
  prizePool: string,            // Prize pool amount
  day?: 1 | 2,                  // Day 1 or Day 2 (required for schedule)
  time?: string,                // Time range
  venue?: string,                // Location
  coordinators?: string,         // Student coordinators
  facultyCoordinators?: string,  // Faculty coordinators
  lottie?: string,              // Lottie animation URL
  color?: string,               // Background color class
}
```

### Step 3: Clear Cache (Important!)

After making changes, you have **3 options**:

#### Option 1: Add `?nocache=true` to URL (Easiest)
Visit: `http://localhost:3000/schedule?nocache=true`

#### Option 2: Wait 30 minutes
Cache expires automatically after 30 minutes.

#### Option 3: Restart Dev Server
Restart your development server to clear cache.

## 🎯 Current Events Status

### Events in Schedule (Day 1 & Day 2):
- ✅ Coding Premier League (id: 1)
- ✅ Electrifying Circuit (id: 2)
- ✅ Tower Making (id: 3)
- ✅ Waste to Wealth / RE-FAB (id: 4)
- ✅ Path Follower (id: 5)
- ✅ Dil Se Design (id: 6)
- ✅ Bridge Making (id: 7)
- ✅ Lathe War (id: 8)
- ✅ Robo Soccer / ROBO TERRAIN (id: 9)
- ✅ **Dance Battle (id: 10)** - Separate event ✅
- ✅ **Rap Battle (id: 11)** - Separate event ✅

### Events NOT in Schedule (Events-only):
- Valorant Tournament (id: 12)
- BGMI (id: 13)
- Treasure Hunt (id: 14)
- Arm Wrestling (id: 15)

## 🔧 Troubleshooting

### Changes Not Showing?

1. **Check cache**: Add `?nocache=true` to the schedule page URL
2. **Restart server**: Stop and restart your dev server
3. **Check console**: Look for cache logs in the browser console
4. **Verify file**: Make sure you edited `src/data/events.ts` (not the old files)

### Events Missing from Schedule?

Make sure the event has `day: 1` or `day: 2` set. Events without a `day` field won't appear on the schedule page.

### Events Not Matching?

- Check that `eventTitle` matches the title in Events.tsx
- Verify the mapping in `getEventTitleToScheduleId()` function

## 📍 File Locations

- **Main Events Data**: `src/data/events.ts`
- **Schedule Actions**: `src/app/schedule/actions.ts`
- **Schedule Page**: `src/app/schedule/page.tsx`
- **Events Component**: `src/components/Events.tsx`

## 💡 Pro Tips

1. **Use `eventTitle`** for different titles between events section and schedule
2. **Use `scheduleDescription`** for longer descriptions on schedule page
3. **Use `scheduleImage`** if you want different images for schedule vs events section
4. **Keep IDs sequential** - Don't skip numbers
5. **Test with `?nocache=true`** after making changes
