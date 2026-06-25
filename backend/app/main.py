import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .schemas import Requirements, SchemaDesign, ApiDesign, FrontendDesign
from .agents import (
    run_requirements_agent, run_schema_agent, run_api_agent,
    run_frontend_agent, run_sprint_agent,
)
from .docker_templates import generate_docker_files
from .cost import estimate_cost

MODEL_NAME = "gemini-2.5-flash"

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AI Software Architect")
app.state.limiter = limiter
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please wait before trying again."},
    )

class GenerateRequest(BaseModel):
    spec: str

def sse_line(obj: dict) -> str:
    return json.dumps(obj) + "\n"

def run_and_track(stage_name, fn, *args, totals):
    result, usage = fn(*args)
    totals["tokens"] += usage["total_tokens"]
    totals["cost"] += estimate_cost(MODEL_NAME, usage["input_tokens"], usage["output_tokens"])
    event = {
        "stage": stage_name,
        "status": "done",
        "data": result.model_dump(),
        "usage": usage,
        "running_tokens": totals["tokens"],
        "running_cost": round(totals["cost"], 6),
    }
    return result, event

@app.post("/generate")
@limiter.limit("3/hour")
def generate(req: GenerateRequest, request: Request):
    def stream():
        totals = {"tokens": 0, "cost": 0.0}
        try:
            yield sse_line({"stage": "requirements", "status": "start"})
            requirements, event = run_and_track("requirements", run_requirements_agent, req.spec, totals=totals)
            yield sse_line(event)

            yield sse_line({"stage": "schema", "status": "start"})
            schema, event = run_and_track("schema", run_schema_agent, requirements, totals=totals)
            yield sse_line(event)

            yield sse_line({"stage": "api", "status": "start"})
            api, event = run_and_track("api", run_api_agent, requirements, schema, totals=totals)
            yield sse_line(event)

            yield sse_line({"stage": "frontend", "status": "start"})
            frontend, event = run_and_track("frontend", run_frontend_agent, requirements, api, totals=totals)
            yield sse_line(event)

            yield sse_line({"stage": "sprint", "status": "start"})
            sprint, event = run_and_track(
                "sprint", run_sprint_agent, requirements, schema, api, frontend, totals=totals
            )
            yield sse_line(event)

            docker = generate_docker_files()
            yield sse_line({"stage": "docker", "status": "done", "data": docker})

            yield sse_line({
                "stage": "complete",
                "total_tokens": totals["tokens"],
                "total_cost": round(totals["cost"], 6),
            })

        except Exception as e:
            yield sse_line({"stage": "error", "status": "error", "message": str(e)})

    return StreamingResponse(stream(), media_type="application/x-ndjson")

class RegenerateRequest(BaseModel):
    stage: str
    spec: Optional[str] = None
    requirements: Optional[dict] = None
    schema_design: Optional[dict] = None
    api: Optional[dict] = None
    frontend: Optional[dict] = None

@app.post("/regenerate")
@limiter.limit("5/hour")
def regenerate(req: RegenerateRequest, request: Request):
    if req.stage == "requirements":
        result, usage = run_requirements_agent(req.spec)
    elif req.stage == "schema":
        result, usage = run_schema_agent(Requirements(**req.requirements))
    elif req.stage == "api":
        result, usage = run_api_agent(Requirements(**req.requirements), SchemaDesign(**req.schema_design))
    elif req.stage == "frontend":
        result, usage = run_frontend_agent(Requirements(**req.requirements), ApiDesign(**req.api))
    elif req.stage == "sprint":
        result, usage = run_sprint_agent(
            Requirements(**req.requirements), SchemaDesign(**req.schema_design),
            ApiDesign(**req.api), FrontendDesign(**req.frontend),
        )
    else:
        raise HTTPException(400, "unknown stage")

    cost = estimate_cost(MODEL_NAME, usage["input_tokens"], usage["output_tokens"])
    return {"data": result.model_dump(), "usage": usage, "cost": round(cost, 6)}

@app.get("/status")
def status():
    return {"ok": True}