# Placeholder per-token rates for demo purposes — check
# https://ai.google.dev/pricing for current published numbers

PRICING = {
    "gemini-2.5-flash": {
        "input_per_million": 0.30,
        "output_per_million": 2.50,
    }
}

def estimate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    rates = PRICING.get(model, {"input_per_million": 0, "output_per_million": 0})
    return (
        (input_tokens / 1_000_000) * rates["input_per_million"]
        + (output_tokens / 1_000_000) * rates["output_per_million"]
    )