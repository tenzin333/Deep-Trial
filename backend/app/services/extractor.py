import httpx
import trafilatura

MAX_CHARS = 30000  # Gemini embedding limit is generous, just cap reasonably


async def extract_text(url: str) -> str | None:
    # Try trafilatura first (works for article-style pages)
    text = await _extract_with_trafilatura(url)

    # Fallback to Jina Reader for JS-rendered pages
    if not text:
        text = await _extract_with_jina(url)

    if not text:
        return None

    # Trim to max chars
    return text[:MAX_CHARS]


async def _extract_with_trafilatura(url: str) -> str | None:
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

    text = trafilatura.extract(response.text)
    if text and len(text) > 50:
        return text
    return None


async def _extract_with_jina(url: str) -> str | None:
    """Fallback: Jina Reader handles JS-rendered pages for free"""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"https://r.jina.ai/{url}",
                headers={"Accept": "text/plain"},
                follow_redirects=True,
            )
            if response.status_code == 200 and len(response.text) > 50:
                return response.text
    except httpx.HTTPError:
        pass
    return None
'''
What happens: 
Go to the URL → download the HTML → trafilatura rips out the junk (menus, footers, ads) and gives you just the article content → trim it so it fits within OpenAI's token limit.
'''