# K-Drive Testing Guide

## Quick Test Checklist

The development server is running at **http://localhost:3000**

### 1. **Favicon & Title Test** ✓
- [ ] Open http://localhost:3000 in Chrome
- [ ] Check the browser tab shows "K-Drive - Your Kinetic Cloud Storage"
- [ ] Verify the favicon appears (blue hard drive icon)

### 2. **Storage Calculation Test** ✓
- [ ] Login or signup to the application
- [ ] Check the sidebar - storage should show "0 GB of 10 GB used" (if new user)
- [ ] Upload a file (e.g., an image or document)
- [ ] Verify the storage bar updates to show actual file size
- [ ] Upload more files and watch the storage percentage increase
- [ ] The storage bar should animate smoothly

### 3. **Trash Functionality Test** ✓

#### Delete & Trash
- [ ] Upload some files and create some folders
- [ ] Delete a file - it should disappear from My Drive
- [ ] Navigate to "Trash" in the sidebar
- [ ] Verify the deleted file appears in trash
- [ ] Delete a folder - verify it also appears in trash

#### Restore Functionality
- [ ] In the Trash page, click the three-dot menu on a file
- [ ] Click "Restore" (with rotate icon)
- [ ] Go back to "My Drive" - the file should be back
- [ ] Repeat for a folder

#### Permanent Delete
- [ ] In Trash, click the three-dot menu on a file
- [ ] Click "Delete Forever" (red text)
- [ ] Confirm the deletion in the popup
- [ ] Verify the file is permanently removed (not in Drive or Trash)

#### Empty Trash
- [ ] Delete multiple files/folders
- [ ] Go to Trash
- [ ] Click "Empty Trash" button (top right)
- [ ] Confirm the action
- [ ] Verify all items are permanently deleted

#### 30-Day Auto-Cleanup
- [ ] This runs automatically when the sidebar loads
- [ ] To test: Modify a trashed item's `updatedAt` date in localStorage to be >30 days old
- [ ] Refresh the page
- [ ] The old item should be automatically removed

### 4. **Storage Accuracy Test** ✓
- [ ] Upload files of known sizes (e.g., 1 MB, 5 MB, 10 MB)
- [ ] Check the storage display shows accurate total
- [ ] Delete a file
- [ ] Verify storage decreases (after permanent delete, not just trash)
- [ ] Empty trash and verify storage updates

### 5. **UI/UX Test** ✓
- [ ] Test both Grid and List view modes
- [ ] Test dark mode toggle
- [ ] Verify all buttons have hover effects
- [ ] Check that custom actions (Restore) only appear in Trash
- [ ] Verify normal actions (Preview, Download, Share) appear in My Drive

### 6. **Edge Cases** ✓
- [ ] Try to delete an already trashed item (should permanently delete)
- [ ] Restore an item when you're at storage limit
- [ ] Upload files until you hit 10 GB limit
- [ ] Test with very large file names
- [ ] Test with special characters in file names

## Manual Testing Steps

### Test Storage Calculation:
```
1. Open DevTools → Application → Local Storage → http://localhost:3000
2. Check 'kdrive_files' - should see your uploaded files
3. Each file has a 'size' property in bytes
4. Sidebar should sum all sizes and convert to GB
```

### Test 30-Day Cleanup:
```javascript
// In browser console:
const files = JSON.parse(localStorage.getItem('kdrive_files'));
files[0].updatedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
localStorage.setItem('kdrive_files', JSON.stringify(files));
// Refresh page - file should be auto-deleted if trashed
```

### Test Trash Restore:
```
1. Upload a test file
2. Delete it (moves to trash)
3. Go to Trash page
4. Click menu → Restore
5. Go back to My Drive
6. File should be visible again
```

## Known Limitations

1. **Storage is in localStorage**: Browser limit is ~10 MB for localStorage, so actual 10 GB limit won't work in practice
2. **Files stored as base64**: This increases storage size by ~33%
3. **No real backend**: All data is client-side only
4. **30-day cleanup**: Only runs when sidebar loads, not on a schedule

## Success Criteria

✅ **All tests pass if:**
- Storage shows accurate file sizes
- Trash shows deleted items
- Restore brings items back
- Permanent delete removes items completely
- Empty trash clears all items
- Auto-cleanup removes old items
- Favicon and title are correct
- UI is responsive and smooth

## Next Features to Implement

Based on Google Drive comparison:
1. Rename files/folders
2. Share functionality
3. Search
4. Sorting options
5. File details panel
6. Drag & drop upload
