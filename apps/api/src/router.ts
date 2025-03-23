import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.create();

// Analytics API Routes
const fetchViewsFromCloudflare = async (path: string): Promise<number> => {
  try {
    // Forward this to our Express API endpoint to avoid duplicating code
    const response = await fetch(`http://localhost:3001/api/views/page?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch views: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.views || 0;
  } catch (error) {
    console.error('Error in tRPC fetchViews:', error);
    return 0;
  }
};

export const appRouter = t.router({
  // Health check
  health: t.procedure
    .query(() => {
      return { status: 'ok' };
    }),
  
  // Get views for a single route
  getViews: t.procedure
    .input(z.object({ path: z.string() }))
    .query(async ({ input }) => {
      try {
        const views = await fetchViewsFromCloudflare(input.path);
        return { views };
      } catch (error) {
        console.error('Error in getViews:', error);
        return { views: 0 };
      }
    }),
  
  // Get views for multiple routes
  getBulkViews: t.procedure
    .input(z.object({ routes: z.array(z.string()) }))
    .query(async ({ input }) => {
      try {
        // Forward to our Express API endpoint
        const response = await fetch('http://localhost:3001/api/views/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ routes: input.routes })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bulk views: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { views: data.views || {} };
      } catch (error) {
        console.error('Error in getBulkViews:', error);
        // Return 0 views for each route on error
        const emptyViews = input.routes.reduce((acc, route) => {
          acc[route] = 0;
          return acc;
        }, {} as Record<string, number>);
        
        return { views: emptyViews };
      }
    })
});

export type AppRouter = typeof appRouter;