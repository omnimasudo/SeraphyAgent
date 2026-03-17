import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your prompts.json
const promptsFilePath = path.join(__dirname, '../public/data/prompts.json');

try {
  // 1. Read the file
  const rawData = fs.readFileSync(promptsFilePath, 'utf-8');
  let prompts = JSON.parse(rawData);

  console.log(`Found ${prompts.length} prompts. Updating images with random tech images from Unsplash (simulated)...`);

  // We will pick from a curated list of reliable Unsplash Source URLs based on category/keywords
  // Since source.unsplash.com is deprecated, we use direct photo IDs or a service that redirects correctly.
  
  prompts = prompts.map((prompt) => {
    // 1. Clean title for keywords
    // Only take first word or two, remove special characters
    const titleKeyword = prompt.title.split(' ').slice(0, 1).join('').replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    // 2. Determine base keywords
    const tag = prompt.tags?.[0] || 'tech';
    let keywords = `${titleKeyword},${tag}`;
    
    // 3. Fallback for specific categories to ensure relevance
    if (prompt.category === 'Development' || prompt.for_devs) {
       keywords = `code,programming,computer,${titleKeyword}`;
    } else if (prompt.category === 'Writing') {
       keywords = `writing,paper,notebook,office`;
    } else if (prompt.category === 'Business') {
       keywords = `business,meeting,office,chart`;
    } else if (prompt.category === 'Marketing') {
       keywords = `marketing,social,media,analytics`;
    } else if (prompt.category === 'Design') {
       keywords = `design,art,colors,creative`;
    }

    // 4. Construct URL
    // Using LoremFlickr which is basically Flickr's random focused image service.
    // Dimensions: 1280x720 (HD)
    // Lock: Ensures the same ID always gets the same random image
    const imageUrl = `https://loremflickr.com/1280/720/${keywords}?lock=${prompt.id}`;

    return {
      ...prompt,
      image: imageUrl
    };
  });

  // 3. Write back to file
  fs.writeFileSync(promptsFilePath, JSON.stringify(prompts, null, 2));
  console.log('Successfully updated prompts.json with image URLs!');

} catch (error) {
  console.error('Error updating prompts:', error);
}
