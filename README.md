# VentBuddy: AI-Powered Life Advice Agents

## Tagline
**Get sarcastic, witty, and brutally honest advice on dating, networking, and finance from AI agents with unique personalities and thousands of years of "experience".**

---

## Problem Statement
VentBuddy solves several critical challenges in the advice space:
1. **Lack of engaging personal advice platforms**:
   - Combines practical advice with humor for a fun experience.
2. **Difficulty finding specialized advice**:
   - Offers domain-specific agents for dating, networking, and finance.
3. **Inconsistent AI personalities**:
   - Ensures memorable, distinct personas across interactions.
4. **Limited accessibility to multiple AI models**:
   - Implements fallback systems with Groq, Mistral, and Ollama APIs.
5. **Lack of humor in serious topics**:
   - Uses humor to make serious conversations approachable.
6. **Inflexibility in handling diverse queries**:
   - Adapts AI responses to various scenarios seamlessly.

---

## Features
- **Unique AI Personalities**:
  - **Cupid**: Sarcastic dating advice.
  - **LinkedOut Larry**: Professional networking tips.
  - **Penny Pincher**: Financial wisdom with a sting.
- **Multi-Model Fallback**:
  - Prioritizes Groq, Mistral, and Ollama APIs for reliability.
- **Interactive, Fun UI**:
  - Accessible, responsive design with Tailwind CSS.
- **Fast Performance**:
  - Streaming responses and optimized state management.
- **High Availability**:
  - Handles API errors gracefully for uninterrupted advice.

---

## Technologies Used
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Node.js, Vercel AI SDK.
- **APIs**: Groq API, Mistral API, Ollama API.
- **Icons**: Lucide React.
- **Deployment**: Vercel.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ukexe/VentBuddy.git
   cd VentBuddy

# Installation Instructions

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env.local` file with the following keys:
```plaintext
GROQ_API_KEY=your_groq_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

### Start the Development Server
```bash
npm run dev
```

### Open the App in Your Browser
```arduino
http://localhost:3000
```

## API Integration

VentBuddy uses a three-tier API system:
- Groq API (Primary)
- Mistral API (Secondary)
- Ollama API (Local Fallback)

### Example Fallback Logic (Simplified)
```javascript
try {
  return await callLLM(messages, GROQ_API_KEY, 'https://api.groq.com/openai/v1/chat/completions');
} catch (error) {
  console.error('Groq API failed:', error);
  try {
    return await callLLM(messages, MISTRAL_API_KEY, 'https://api.mistral.ai/v1/chat/completions');
  } catch (error) {
    console.error('Mistral API failed:', error);
    try {
      return await callOllama(messages);
    } catch (error) {
      console.error('Ollama API failed:', error);
      throw new Error('All AI services failed.');
    }
  }
}
```

## Live Demo
Check out the live application here: [[VentBuddy Live Demo](https://b5ohhm9ly2v8136f5.lite.vusercontent.net/)](#)

## Challenges Faced

### Maintaining Consistent Personalities:
- Implemented detailed backstories and fine-tuned models.

### Fallback System Reliability:
- Developed robust error-handling mechanisms.

### Balancing Humor and Practicality:
- Crafted witty yet useful prompts for agents.

### Optimizing Response Times:
- Used caching and streaming for faster interactions.

### Accessibility and Responsiveness:
- Designed with semantic HTML, ARIA, and Tailwind CSS.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a feature branch:
```bash
git checkout -b feature-name
```
3. Commit your changes:
```bash
git commit -m "Add a new feature"
```
4. Push to the branch:
```bash
git push origin feature-name
```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For inquiries or support, reach out to us at support@ventbuddy.ai.

## Useful Links
- [[GitHub Repository](https://github.com/ukexe/VentBuddy.git)](#)
- [[API Documentation](https://docs.google.com/document/d/1D8D9P7uc4VXuC6ZsAJbUNQ_NCmCIUNxqXfj6GJXL3GE/edit?usp=sharing)](#)
- [Live Demo](#)
