import { prisma } from '@/lib/ prisma';
import { NextResponse } from 'next/server';

// Fetch products from /api/data
async function fetchProducts() {
  try {
    const response = await fetch(`${'http://localhost:3000'}/api/data`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Handle POST requests for voice commands
export async function POST(req: Request) {
  try {
    const { voiceCommand } = await req.json();
        const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
      },
        });
    

    const deepSeekPayload = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `Your name is Multishop and you are a product search assistant. Strictly follow these rules:
1. Analyze user command: "${voiceCommand}"
2. Return ONLY a valid JSON object with two fields:
   - "products": A JSON array of max 4 matching product IDs. Each product must include ONLY the "id" field.
   - "message": A dynamic plain text message summarizing the search results, such as "Here are the top (number of result) products matching your search."
3. Do not include any additional text or wrapping outside the JSON object.
4. Maintain JSON validity at all costs.
5. If user ask about your name, reply with im "Multishop Ai" in message field.
6. If user ask about your age, reply with "I am a virtual assistant and I don't have an age." in message field.
7. If user ask about your location, reply with "Say im located in tetouan Morocco" in message field.
8. If user does not say somthing about a product, be free to intract with user in message field.
9. max characters for message field is 200.
10. Provide product details if use ask for in message field.
11. be nice and polite with user.
12. try to be helpful as much as you can.
13. If you dont know the answer, just say "I am sorry, I am not able to provide an answer to that question." in message field.
14. If you have any question, feel free to ask me.
15. calcule the hightes offers we have by calculating the discount and the price of the product and return the best offers products also provide details in mesage. 
Example response format:
{
  "products": [
    { "id": "cm8jhupr6001m95jn7d3niats" },
    { "id": "cm8jhyz8l001t95jnvybk5pnm" }
  ],
  "message": "Here are the top products matching your search."
}`.trim(),
        },
        {
          role: 'user',
          content: `Available products: ${JSON.stringify(products)}. Find matches for: "${voiceCommand}".`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    };

    const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(deepSeekPayload),
    });

    const responseBody = await deepSeekResponse.json();
    const messageContent = responseBody.choices[0]?.message?.content;

    if (!messageContent) throw new Error('No content in response');

    let parsedResponse;
    try {
      const cleanedContent = messageContent.replace(/```json|```/g, '').trim();
      parsedResponse = JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Invalid JSON structure:', messageContent);
      throw new Error('Failed to parse product array');
    }

    const { products: matchedProducts, message } = parsedResponse;

    if (!Array.isArray(matchedProducts) || !message) {
      throw new Error('Invalid response from DeepSeek');
    }

    const isValid = matchedProducts.every(product => product.id);

    if (!isValid) {
      console.error('Invalid product structure:', matchedProducts);
      throw new Error('Invalid product data format');
    }

    return NextResponse.json({ products: matchedProducts, message });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Handle GET requests for page initialization
export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error processing GET request:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
