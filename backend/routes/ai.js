const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Available models configuration
const AVAILABLE_MODELS = {
  'gpt-4o': {
    name: 'GPT-4o',
    description: 'Most capable model, best for complex tasks',
    maxTokens: 4096,
    temperature: 0.7
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    description: 'Faster responses, great for general use',
    maxTokens: 4096,
    temperature: 0.7
  },
  'o3-mini': {
    name: 'O3 Mini',
    description: 'Optimized for reasoning and analysis',
    maxTokens: 4096,
    temperature: 0.6
  },
  'o4-mini': {
    name: 'O4 Mini',
    description: 'Fastest responses for simple queries',
    maxTokens: 2048,
    temperature: 0.8
  }
};

// System prompt defining AI's role and knowledge
const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are NexStream AI Assistant, a professional, friendly, and knowledgeable guide for the NexStream platform.

ABOUT NEXSTREAM:
NexStream is a revolutionary content creation and monetization platform where users can:
- Upload and monetize videos, music, games, and digital content
- Earn money through views, subscriptions, tips, and content sales
- Build a business with our ethical MLM (Multi-Level Marketing) program
- Withdraw earnings via Flutterwave (Africa), PayPal (International), or M-PESA (Kenya)
- Connect with other creators in communities
- Create playlists and manage content libraries
- Track analytics and grow their audience

YOUR ROLE:
- Be helpful, professional, and encouraging
- Provide specific, actionable advice about content creation
- Explain MLM features transparently (emphasize that results vary)
- Guide users through platform features step-by-step
- Never make unrealistic income promises
- Always remind users to check official documentation for critical information

TONE:
- Warm and approachable
- Clear and concise
- Professional but not robotic
- Use emojis occasionally to be friendly, but not excessively

Remember: You're representing NexStream - be the best AI assistant users could ask for!`
};

// ========== HEALTH CHECK ENDPOINT ==========
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    ai: 'configured',
    models: Object.keys(AVAILABLE_MODELS),
    timestamp: new Date().toISOString()
  });
});

// ========== AVAILABLE MODELS ENDPOINT ==========
router.get('/models', (req, res) => {
  res.json({
    success: true,
    models: AVAILABLE_MODELS
  });
});

// ========== REGULAR CHAT ENDPOINT (Non-streaming) ==========
router.post('/chat', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { messages, model = 'gpt-4o' } = req.body;

    console.log(`🤖 [AI Chat] Request received with model: ${model}`);
    console.log(`📝 Messages: ${messages?.length || 0}`);

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages array is required',
        code: 'INVALID_MESSAGES'
      });
    }

    // Validate model
    if (!AVAILABLE_MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model selected',
        availableModels: Object.keys(AVAILABLE_MODELS)
      });
    }

    const modelConfig = AVAILABLE_MODELS[model];

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        SYSTEM_PROMPT,
        ...messages
      ],
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.maxTokens
    });

    const responseTime = Date.now() - startTime;
    console.log(`✅ [AI Chat] Response generated in ${responseTime}ms`);

    res.json({ 
      success: true,
      response: completion.choices[0].message.content,
      model: model,
      usage: completion.usage,
      responseTime: responseTime
    });

  } catch (error) {
    console.error('❌ [AI Chat] Error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT'
      });
    }

    res.status(500).json({ 
      error: 'AI service error',
      code: 'AI_SERVICE_ERROR',
      message: error.message
    });
  }
});

// ========== STREAMING CHAT ENDPOINT (Like ChatGPT) ==========
router.post('/chat-stream', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { messages, model = 'gpt-4o' } = req.body;

    console.log(`🤖 [AI Stream] Request received with model: ${model}`);

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages array is required',
        code: 'INVALID_MESSAGES'
      });
    }

    // Validate model
    if (!AVAILABLE_MODELS[model]) {
      return res.status(400).json({
        error: 'Invalid model selected',
        availableModels: Object.keys(AVAILABLE_MODELS)
      });
    }

    const modelConfig = AVAILABLE_MODELS[model];

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

    const stream = await openai.chat.completions.create({
      model: model,
      messages: [
        SYSTEM_PROMPT,
        ...messages
      ],
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.maxTokens,
      stream: true // Enable streaming
    });

    let fullContent = '';
    let tokenCount = 0;

    // Stream each chunk to the client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      
      if (content) {
        fullContent += content;
        tokenCount++;
        
        // Send the content chunk
        res.write(`data: ${JSON.stringify({ 
          type: 'chunk',
          content: content,
          timestamp: Date.now()
        })}\n\n`);
      }

      // Check if this is the final chunk
      if (chunk.choices[0]?.finish_reason) {
        res.write(`data: ${JSON.stringify({ 
          type: 'done',
          finishReason: chunk.choices[0].finish_reason,
          totalTokens: tokenCount,
          responseTime: Date.now() - startTime
        })}\n\n`);
      }
    }

    console.log(`✅ [AI Stream] Completed in ${Date.now() - startTime}ms, ${tokenCount} tokens`);
    res.end();

  } catch (error) {
    console.error('❌ [AI Stream] Error:', error);
    
    // Send error as SSE event
    res.write(`data: ${JSON.stringify({ 
      type: 'error',
      error: error.message,
      code: error.status || 500
    })}\n\n`);
    
    res.end();
  }
});

// ========== TIPS & SUGGESTIONS ENDPOINT ==========
router.get('/tips', async (req, res) => {
  try {
    const { category } = req.query;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        SYSTEM_PROMPT,
        {
          role: 'user',
          content: category 
            ? `Give me 5 quick tips for ${category} on NexStream. Keep each tip under 100 characters.`
            : 'Give me 5 quick tips for content creators on NexStream. Keep each tip under 100 characters.'
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    // Parse the response into an array of tips
    const tips = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    res.json({
      success: true,
      tips: tips,
      category: category || 'general'
    });

  } catch (error) {
    console.error('❌ [AI Tips] Error:', error);
    
    // Fallback tips
    res.json({
      success: true,
      tips: [
        "Post consistently to grow your audience",
        "Engage with your commenters daily",
        "Use eye-catching thumbnails",
        "Collaborate with other creators",
        "Analyze your analytics weekly"
      ],
      fallback: true
    });
  }
});

// ========== CONTENT IDEAS GENERATOR ==========
router.post('/generate-ideas', async (req, res) => {
  try {
    const { niche, count = 5 } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        SYSTEM_PROMPT,
        {
          role: 'user',
          content: `Generate ${count} creative content ideas for someone in the ${niche || 'general'} niche. 
          Format each idea as: "Title: [title] - Description: [brief description]"
          Make them engaging and actionable.`
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    res.json({
      success: true,
      ideas: completion.choices[0].message.content,
      niche: niche || 'general'
    });

  } catch (error) {
    console.error('❌ [AI Ideas] Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate ideas',
      code: 'IDEAS_ERROR'
    });
  }
});

// ========== SEO OPTIMIZATION HELPER ==========
router.post('/optimize-seo', async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        SYSTEM_PROMPT,
        {
          role: 'user',
          content: `Help optimize this content for SEO on NexStream:
          
          Current Title: ${title || 'Not provided'}
          Current Description: ${description || 'Not provided'}
          Current Tags: ${tags ? tags.join(', ') : 'Not provided'}
          
          Please provide:
          1. An optimized title (under 60 characters)
          2. An optimized description (under 160 characters)
          3. 5-10 relevant hashtags
          4. 3 tips to improve visibility`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({
      success: true,
      suggestions: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('❌ [AI SEO] Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate SEO suggestions',
      code: 'SEO_ERROR'
    });
  }
});

// ========== CHAT HISTORY ANALYSIS ==========
router.post('/analyze-chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        SYSTEM_PROMPT,
        {
          role: 'user',
          content: `Analyze this chat conversation and provide insights:
          
          ${JSON.stringify(messages, null, 2)}
          
          Please provide:
          1. Main topics discussed
          2. User's primary goals or questions
          3. Suggestions for follow-up
          4. Any missing information the user might need`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({
      success: true,
      analysis: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('❌ [AI Analysis] Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze chat',
      code: 'ANALYSIS_ERROR'
    });
  }
});

// ========== MODEL INFORMATION ==========
router.get('/model-info/:modelId', (req, res) => {
  const { modelId } = req.params;
  
  const model = AVAILABLE_MODELS[modelId];
  
  if (!model) {
    return res.status(404).json({
      error: 'Model not found',
      availableModels: Object.keys(AVAILABLE_MODELS)
    });
  }

  res.json({
    success: true,
    model: {
      id: modelId,
      ...model
    }
  });
});

module.exports = router;