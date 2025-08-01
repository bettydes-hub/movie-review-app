# Movie Images Setup Guide

## How to Add Local Movie Images

### Step 1: Create the Images Folder
```bash
cd movie-review-app
mkdir -p public/movie-images
```

### Step 2: Add Your Movie Images
1. **Download movie poster images** (PNG or JPEG format)
2. **Rename them** to match the movie titles (e.g., `shawshank-redemption.jpg`)
3. **Place them** in the `public/movie-images/` folder

### Step 3: Update Seeded Movies (Optional)
If you want to use local images for seeded movies, update the database seeder:

```javascript
// In src/seeders/databaseSeeder.js
{
  title: 'The Shawshank Redemption',
  director: 'Frank Darabont',
  description: '...',
  categoryId: categories.find(c => c.category === 'Drama').id,
  image: '/movie-images/shawshank-redemption.jpg'  // Local path
}
```

### Step 4: Restart the Server
```bash
npm start
```

## Image Requirements
- **Format**: PNG or JPEG
- **Size**: Recommended 300x450 pixels (movie poster ratio)
- **File size**: Under 2MB per image
- **Naming**: Use lowercase, hyphens, no spaces

## Example Image Names
- `shawshank-redemption.jpg`
- `godfather.jpg`
- `dark-knight.jpg`
- `pulp-fiction.jpg`
- `fight-club.jpg`
- `inception.jpg`
- `matrix.jpg`
- `goodfellas.jpg`
- `silence-lambs.jpg`
- `interstellar.jpg`

## Testing
After adding images:
1. Restart your backend server
2. Go to your movie list page
3. Check if the images are displaying
4. Try adding a new movie with an image

## Troubleshooting
- **Images not showing**: Check the file path and permissions
- **CORS errors**: Make sure images are in the public folder
- **Large file errors**: Compress images to under 2MB 