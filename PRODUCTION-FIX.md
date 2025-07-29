# Railway Production Build Fix

## Error: sh: vite: not found

**Root Cause**: Build tools (vite, esbuild, typescript) were in devDependencies but Railway production builds don't install dev dependencies.

## Solution Applied:
Moved all build-time dependencies to `dependencies` so they're available during Railway build process:

**Moved to dependencies:**
- `vite` - Frontend build tool
- `esbuild` - Backend bundler  
- `typescript` - Type checking
- `tsx` - TypeScript execution
- `@vitejs/plugin-react` - React plugin
- `@tailwindcss/vite` - Tailwind integration
- `drizzle-kit` - Database tools
- All @types/* packages - TypeScript definitions
- Build tools: `autoprefixer`, `postcss`

## Result:
Railway will now have access to all build tools during the build process.

## Upload Instructions:
1. Replace package.json in your GitHub repository
2. Commit and push changes
3. Redeploy on Railway

Build should complete successfully in 8-12 minutes.