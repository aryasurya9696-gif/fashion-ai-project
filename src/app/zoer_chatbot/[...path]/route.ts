import { NextRequest, NextResponse } from "next/server";

const POSTGREST_API_KEY = process.env.POSTGREST_API_KEY || "";
const NEXT_PUBLIC_ZOER_HOST = process.env.NEXT_PUBLIC_ZOER_HOST || "https://zoer.ai";
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://fashionai45445.app.n8n.cloud/webhook-test/c3e14950-4779-4765-973c-02276f48d072";

async function handleN8nWebhook(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || 'FashionAI-Chatbot',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('n8n webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to n8n webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const url = request.nextUrl;
  const pathSegments = url.pathname.replace(/^\/zoer_chatbot\//, "").split("/").filter(Boolean);
  
  // Handle n8n webhook endpoint
  if (pathSegments.includes("webhook") && pathSegments.includes("fashion-ai")) {
    return handleN8nWebhook(request);
  }
  
  try {
    const targetPath = "/" + pathSegments.join("/");

    const targetUrl = `${NEXT_PUBLIC_ZOER_HOST}${targetPath}${url.search}`;

    const headers = new Headers();

    request.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    headers.set("Postgrest-API-Key", `${POSTGREST_API_KEY}`);
    headers.delete("Authorization");

    const host = NEXT_PUBLIC_ZOER_HOST.split("://")[1];
    if (host) {
      headers.set("Host", host);
    }

    let body: BodyInit | undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.arrayBuffer();
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
