
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

