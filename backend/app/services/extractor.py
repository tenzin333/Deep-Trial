# app/services/extractor.py
import httpx
import trafilatura
import tiktoken

async def extract_text(url: str) -> str | None:
    # Step 1: Fetch the webpage HTML
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                url,
                headers={"User-Agent": "Mozilla/5.0"},
                follow_redirects=True,
            )
            response.raise_for_status()
    except httpx.HTTPError:
        return None

    # Step 2: Strip out navbars, ads, scripts — keep article body
    text = trafilatura.extract(response.text)
    if not text:
        return None

    # Step 3: Trim to 8000 tokens (OpenAI's embedding limit is 8191)
    enc = tiktoken.encoding_for_model("text-embedding-3-small")
    tokens = enc.encode(text)[:8000]
    return enc.decode(tokens)

'''
What happens: 
Go to the URL → download the HTML → trafilatura rips out the junk (menus, footers, ads) and gives you just the article content → trim it so it fits within OpenAI's token limit.
'''