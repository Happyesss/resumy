# Database Schema Issue: Missing 'type' Column in Resumes Table

## Issue Summary

**Error:** `Could not find the 'type' column of 'resumes' in the schema cache`
**Error Code:** PGRST204 (PostgREST error)
**Occurrence:** POST /home endpoint during `createTailoredResume` function execution

## Root Cause Analysis

### 1. **PostgREST Schema Cache Mismatch**

The error is caused by a mismatch between the PostgREST schema cache and the actual database schema. PostgREST (the API layer used by Supabase) has cached a version of the schema that expects a 'type' column in the 'resumes' table, but this column doesn't exist in the actual database.

### 2. **Dual Resume Classification System**

The application currently uses two different approaches to classify resumes as "base" or "tailored":

#### Current Implementation:
- **Boolean field:** `is_base_resume` (boolean) - Currently in database
- **String field:** `type` (text) - Expected by PostgREST cache but missing from database

#### Code Analysis:
```typescript
// In countResumes function (src/utils/actions/resumes/actions.ts:431)
export async function countResumes(type: 'base' | 'tailored' | 'all'): Promise<number> {
  // ... auth logic ...
  
  let query = supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (type !== 'all') {
    query = query.eq('is_base_resume', type === 'base'); // Uses boolean field
  }
  // ... rest of function
}
```

## Database Schema Analysis

### Current Schema (schema.sql)
```sql
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  job_id uuid NULL,
  is_base_resume boolean NULL DEFAULT false,    -- ✅ Current boolean approach
  type text NOT NULL DEFAULT 'base' CHECK (type IN ('base', 'tailored')), -- ✅ Added string approach
  name text NOT NULL,
  -- ... other columns
);
```

### Why the 'type' Column is Needed

1. **Improved Query Performance**: String-based categorization is more readable and performant for filtering operations
2. **API Consistency**: Eliminates the need to convert boolean values to string representations
3. **Future Extensibility**: Easier to add new resume types (e.g., 'template', 'archived') without schema changes
4. **Developer Experience**: More intuitive than boolean logic inversion

### Comparison: Boolean vs String Approach

| Aspect | `is_base_resume` (boolean) | `type` (string) |
|--------|---------------------------|-----------------|
| **Readability** | `WHERE is_base_resume = true` | `WHERE type = 'base'` |
| **Extensibility** | Limited to 2 states | Unlimited types |
| **API Response** | Requires conversion logic | Direct value usage |
| **Null Handling** | Complex with 3-state logic | Clear with default values |
| **Query Logic** | `type === 'base' ? true : false` | `type` |

## Technical Timeline

### What Happened:
1. **Initial Development**: Application used `is_base_resume` boolean field
2. **Schema Evolution**: `type` column was added to schema.sql for improved categorization
3. **Database Lag**: Local/production database wasn't updated with the new column
4. **Cache Mismatch**: PostgREST cached the schema expecting the `type` column
5. **Runtime Error**: API calls fail when PostgREST can't find the expected column

### Evidence from Codebase:
- ✅ `schema.sql` contains `type` column definition
- ❌ Migration files are empty (`migrate-type-column.sql`, `run-type-migration.js`)
- ✅ Application code uses `is_base_resume` for filtering
- ❌ No code explicitly references `type` column yet

## Solution Implementation

### 1. Database Migration (migrate-type-column.sql)
```sql
-- Add type column to resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('base', 'tailored'));

-- Update existing records based on is_base_resume
UPDATE public.resumes 
SET type = CASE 
    WHEN is_base_resume = true THEN 'base'
    WHEN is_base_resume = false THEN 'tailored'
    ELSE 'base'
END
WHERE type IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE public.resumes 
ALTER COLUMN type SET NOT NULL;

-- Set default value for new records
ALTER TABLE public.resumes 
ALTER COLUMN type SET DEFAULT 'base';
```

### 2. Code Migration Strategy

#### Phase 1: Add Column (Backward Compatible)
- ✅ Add `type` column to database
- ✅ Populate existing records
- ✅ Keep `is_base_resume` field for compatibility

#### Phase 2: Update Application Code
```typescript
// Before (using boolean)
query = query.eq('is_base_resume', type === 'base');

// After (using string)
query = query.eq('type', type);
```

#### Phase 3: Remove Legacy Field (Future)
- Remove `is_base_resume` column after full migration
- Update all references in codebase

## Prevention Strategies

### 1. **Database Migration Management**
- Implement proper migration scripts with rollback capabilities
- Use version control for database schema changes
- Test migrations in staging before production

### 2. **Schema Synchronization**
- Regular schema cache refreshes in PostgREST
- Automated schema validation in CI/CD pipeline
- Environment parity checks

### 3. **Development Workflow**
```bash
# Recommended workflow for schema changes
1. Update schema.sql
2. Create migration script
3. Test migration locally
4. Run migration in staging
5. Validate API endpoints
6. Deploy to production
7. Verify PostgREST cache refresh
```

## Resolution Steps

### Immediate Fix (Choose One):

#### Option A: Manual Database Update (Recommended)
1. Open Supabase Dashboard → SQL Editor
2. Execute the migration SQL from `migrate-type-column.sql`
3. Restart PostgREST service or wait for cache refresh

#### Option B: PostgREST Cache Refresh
1. Supabase Dashboard → Settings → Database
2. Find "Restart API" or contact support for PostgREST restart

#### Option C: Temporary Schema Revert
1. Remove `type` column from `schema.sql`
2. Continue using `is_base_resume` field
3. Plan proper migration for later

### Long-term Improvements:
1. Implement database migration tooling
2. Add schema validation tests
3. Create staging environment for schema testing
4. Document database change procedures

## Files Modified

- ✅ `schema.sql` - Added type column definition
- ✅ `migrate-type-column.sql` - Created migration script
- ✅ `run-type-migration.js` - Created migration runner (needs environment setup)
- 📝 `DATABASE_TYPE_COLUMN_ISSUE.md` - This documentation

## Related Code References

### Functions Using Resume Classification:
- `countResumes()` - src/utils/actions/resumes/actions.ts:431
- `createTailoredResume()` - src/utils/actions/resumes/actions.ts:246
- `getDashboardData()` - src/utils/actions.ts

### Components Using Resume Types:
- Home Dashboard - src/app/(dashboard)/home/page.tsx
- Resume Management - src/components/resume/management/
- Create Resume Dialogs - src/components/resume/management/dialogs/

## Monitoring and Validation

### Post-Migration Checks:
1. Verify `type` column exists: `SELECT type FROM resumes LIMIT 1;`
2. Check data consistency: `SELECT type, is_base_resume FROM resumes;`
3. Test API endpoints: POST /home, resume creation flows
4. Monitor error logs for PGRST204 errors

### Health Check Query:
```sql
SELECT 
  COUNT(*) as total_resumes,
  COUNT(*) FILTER (WHERE type = 'base') as base_resumes,
  COUNT(*) FILTER (WHERE type = 'tailored') as tailored_resumes,
  COUNT(*) FILTER (WHERE type IS NULL) as null_types
FROM resumes;
```

---

**Created:** July 29, 2025  
**Status:** Migration Ready  
**Priority:** High (Blocking Production)  
**Affected Endpoints:** POST /home, Resume Creation APIs
