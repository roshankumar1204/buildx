from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from .schemas import Requirements, SchemaDesign, ApiDesign, FrontendDesign
from .agents import (
    run_requirements_agent, run_schema_agent, run_api_agent,
    run_frontend_agent, run_sprint_agent,
)
from .docker_templates import generate_docker_files

app = FastAPI(title="AI Software Architect")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class GenerateRequest(BaseModel):
    spec: str

@app.post("/generate")
def generate(req: GenerateRequest):
    requirements = run_requirements_agent(req.spec)
    schema = run_schema_agent(requirements)
    api = run_api_agent(requirements, schema)
    frontend = run_frontend_agent(requirements, api)
    sprint = run_sprint_agent(requirements, schema, api, frontend)
    docker = generate_docker_files()
    return {
        "requirements": requirements, "schema": schema, "api": api,
        "frontend": frontend, "sprint": sprint, "docker": docker,
    }

class RegenerateRequest(BaseModel):
    stage: str
    spec: Optional[str] = None
    requirements: Optional[dict] = None
    schema_design: Optional[dict] = None
    api: Optional[dict] = None
    frontend: Optional[dict] = None

@app.post("/regenerate")
def regenerate(req: RegenerateRequest):
    if req.stage == "requirements":
        return run_requirements_agent(req.spec)
    if req.stage == "schema":
        return run_schema_agent(Requirements(**req.requirements))
    if req.stage == "api":
        return run_api_agent(Requirements(**req.requirements), SchemaDesign(**req.schema_design))
    if req.stage == "frontend":
        return run_frontend_agent(Requirements(**req.requirements), ApiDesign(**req.api))
    if req.stage == "sprint":
        return run_sprint_agent(
            Requirements(**req.requirements), SchemaDesign(**req.schema_design),
            ApiDesign(**req.api), FrontendDesign(**req.frontend),
        )
    raise HTTPException(400, "unknown stage")

@app.get("/status")  # not /health — ad-blockers block that, learned this from AI Usage Ledger
def status():
    return {"ok": True}