import { NextResponse } from "next/server";

function validateAndFormatResponse(response: any) {
  const defaultValuesTemplate = {
    name: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    isNew: false,
    isPublished: false,
    rating: 0,
    categoryId: "",
    brandId: "",
  };

  const formattedResponse = {
    defaultValues: { ...defaultValuesTemplate, ...response.defaultValues },
    properties: Array.isArray(response.properties) ? response.properties : [],
    hashtags: Array.isArray(response.hashtags) ? response.hashtags : [],
    priorities: Array.isArray(response.priorities) ? response.priorities : [],
    message: response.message || "Default values generated successfully.",
  };

  // Ensure numeric and boolean fields are properly formatted
  formattedResponse.defaultValues.price = parseFloat(formattedResponse.defaultValues.price) || 0;
  formattedResponse.defaultValues.discount = parseFloat(formattedResponse.defaultValues.discount) || 0;
  formattedResponse.defaultValues.stock = parseInt(formattedResponse.defaultValues.stock, 10) || 0;
  formattedResponse.defaultValues.rating = parseFloat(formattedResponse.defaultValues.rating) || 0; // Convert rating to a number
  formattedResponse.defaultValues.isNew = formattedResponse.defaultValues.isNew === true || formattedResponse.defaultValues.isNew === "true"; // Convert to boolean
  formattedResponse.defaultValues.isPublished = formattedResponse.defaultValues.isPublished === true || formattedResponse.defaultValues.isPublished === "true"; // Convert to boolean

  return formattedResponse;
}

export async function POST(req: Request) {
  try {
    const { fields, prompt, priorities, hashtags,type } = await req.json();

    const deepSeekPayload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `Your name is Multishop and you are a form assistant and your job is gets products information and give them to user. Strictly follow these rules:
1. Analyze the provided fields, priorities, hashtags, and prompt: "${prompt}".
2. Return ONLY a valid JSON object with four fields:
   - "defaultValues": A JSON object containing default values for the provided fields. Exclude any fields related to images.
   - "properties": An array of objects representing properties (e.g., [{ "id": "1", "name": "Size", "value": "Large" }]).
   - "hashtags": An array of strings representing selected hashtag names (e.g., ["sample", "product"]).
   - "message": A dynamic plain text message summarizing the generated default values, such as "Default values generated successfully."
3. Do not include any additional text or wrapping outside the JSON object.
4. Maintain JSON validity at all costs.
5. If you don't know how to generate a value for a field, leave it empty.
6. Be polite and helpful in the message field.
7. Don't add extra text around the JSON object.
8. Always return default values for the provided fields, priorities, and hashtags.
9. Recheck the data before sending it to ensure it is complete and valid.
10. Do not send incomplete or invalid JSON data.
11. try to send a complete response with all required fields for example if response time left is 2s then try to complete synax and send it without complete to make sure you will never send invalid json.
13: if priorities is [] of null then send empty array.
14: if hashtags is [] of null then send empty array.
14: only add properties that related to the product.
Example response format:
{
  "defaultValues": {
    "name": "Sample Product",
    "description": "This is a sample description.",
    "price": 100,
    "stock": 50,
    "categoryId": "sample-category-id",
    "brandId": "sample-brand-id"
  },
  "properties": [{ "id": "1", "name": "Size", "value": "Large" }],
  "hashtags": ["#sample", "#product"],
  "message": "Default values generated successfully."
}`.trim(),
        },
        {
          role: "user",
          content: `Generate default values for the following fields: ${JSON.stringify(fields)}, priorities: ${JSON.stringify(priorities)}, and hashtags: ${JSON.stringify(hashtags.map((tag) => `#${tag.name}`))}.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    };

    const deepSeekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(deepSeekPayload),
    });

    const responseBody = await deepSeekResponse.json();
    const messageContent = responseBody.choices[0]?.message?.content;

    if (!messageContent) throw new Error("No content in response");

    let parsedResponse;
    try {
      const cleanedContent = messageContent
        .replace(/```json|```/g, "") // Remove code block markers
        .trim();

      // Parse and validate the response
      parsedResponse = JSON.parse(cleanedContent);
      parsedResponse = validateAndFormatResponse(parsedResponse);
    } catch (error) {
      console.error("Invalid JSON structure:", messageContent);
      throw new Error("Failed to parse or validate default values");
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again later." },
      { status: 500 }
    );
  }
}


