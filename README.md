# The Pub - D&D 5e Homebrew Content Manager

![The Pub Logo](https://github.com/Tremontaine/the-pub/blob/main/public/logo.png)

The Pub is a modern, markdown-based repository for Dungeons & Dragons 5th Edition homebrew content. Store, search, filter, and analyze your custom monsters, spells, magic items, and subclasses with an intuitive interface and AI-powered assistance.

## Features

- **Markdown-Based Content Management**: Store all homebrew content in simple markdown files
- **AI Analysis**: Built-in AI assistant that can analyze balance, suggest improvements, and modify content
- **Content Types**: Manage monsters, spells, magic items, and character subclasses
- **Advanced Filtering**: Filter content by properties like CR, spell level, rarity, and more
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Light/Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **PDF Export**: Export any content or AI analysis as a PDF file
- **Global Search**: Quickly find any content across all categories
- **Source Viewing**: View the raw markdown source for any content
- **Content Width Controls**: Adjust the content width for comfortable reading on any screen

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [React](https://reactjs.org/) - UI component library
- [Mistral AI API](https://mistral.ai/) - AI assistant integration
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Markdown parsing with YAML frontmatter
- [Remark](https://github.com/remarkjs/remark) - Markdown processor
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - PDF export capability
- [Fuse.js](https://fusejs.io/) - Fuzzy search library

## Installation

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Mistral AI API key (for AI analysis features)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tremontaine/the-pub.git
   cd the-pub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root with your Mistral AI API key:
   ```
   MISTRAL_API_KEY=your_mistral_api_key
   ```

4. Add your logo (optional):
   - Save your logo as `logo.png` in the `public` folder

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at http://localhost:3000

## Building for Production

```bash
npm run build
npm start
```
## Docker Deployment

The Pub can be easily deployed using Docker.

### Using Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Tremontaine/the-pub.git
   cd the-pub
   ```

2. Create a `.env` file with your Mistral API key:
   ```
   MISTRAL_API_KEY=your_mistral_api_key
   ```

3. Build and start the container:
   ```bash
   docker compose up -d
   ```

4. Access The Pub at http://localhost:8765

### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t the-pub .
   ```

2. Run the container:
   ```bash
   docker run -p 8765:3000 -e MISTRAL_API_KEY=your_api_key -v $(pwd)/content:/app/content -d the-pub
   ```

### Docker Environment Variables

- `MISTRAL_API_KEY`: Your Mistral AI API key (required for AI analysis features)

### Persistent Storage

The Docker setup maps the `content` directory to persist your homebrew content even when the container is updated. Make sure your server has proper permissions set for this directory.

## Content Structure

All content is stored in markdown files within the `content` directory:

```
content/
├── bestiary/      # Monsters and creatures
├── spells/        # Spells and cantrips
├── items/         # Magic items and artifacts
└── subclasses/    # Character subclasses
```

### Adding Content

#### Bestiary Example (`content/bestiary/frost-giant.md`):

```markdown
---
name: Frost Giant
type: Giant
challenge_rating: 8
size: Huge
alignment: Neutral Evil
---

# Frost Giant

Terrible and fearsome giants with blue-white skin and pale, frosty hair.

## Stats
- **Armor Class:** 15 (patchwork armor)
- **Hit Points:** 138 (12d12 + 60)
- **Speed:** 40 ft.

... (additional content)
```

#### Spell Example (`content/spells/frostbolt.md`):

```markdown
---
name: Frostbolt
level: 2
school: Evocation
casting_time: 1 action
range: 60 feet
components: V, S
duration: Instantaneous
---

# Frostbolt

A bolt of ice shoots from your fingertips at a target within range.

... (additional content)
```

#### Item Example (`content/items/frost-brand.md`):

```markdown
---
name: Frost Brand
type: Weapon (any sword)
rarity: Very Rare
requires_attunement: true
---

# Frost Brand

When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage.

... (additional content)
```

#### Subclass Example (`content/subclasses/oath-of-frost.md`):

```markdown
---
name: Oath of Frost
class: Paladin
source: The Pub
level: 3
---

# Oath of Frost

The Oath of Frost binds paladins to the ideals of endurance, isolation, and preservation.

... (additional content)
```

## Configuration

### Environment Variables

- `MISTRAL_API_KEY`: Your Mistral AI API key (required for AI analysis features)

### Content Width

Adjust content width using the controls in the top right corner:
- Narrow (25%)
- Centered (50%)
- Wide (90%)

## AI Assistant

The built-in AI assistant can:
- Analyze balance of any entry
- Suggest improvements
- Add new features to existing content
- Modify content based on your specifications
- Provide detailed explanations

## Credits

- Icon assets: [Game-icons.net](https://game-icons.net/)
- Fonts: [Google Fonts](https://fonts.google.com/)
- D&D 5e SRD: [Wizards of the Coast](https://dnd.wizards.com/resources/systems-reference-document)

---

Built with ❤️ for the D&D homebrew community

*The Pub is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. The Pub may use the trademarks and other intellectual property of Wizards of the Coast LLC, which is permitted under Wizards' Fan Content Policy. For example, Dungeons & Dragons® is a trademark of Wizards of the Coast. For more information about Wizards of the Coast or any of Wizards' trademarks or other intellectual property, please visit their website at www.wizards.com.*
