from .schemas import Requirements, SchemaDesign, ApiDesign, FrontendDesign, SprintPlan
from .gemini_client import generate_structured

def run_requirements_agent(spec: str) -> Requirements:
    prompt = f"""You are a product manager. Break down this one-line software requirement into a structured spec.

Requirement: "{spec}"

Give: project name, a 2-3 sentence summary, the actors/user roles, 5-8 core features, the main data entities (nouns), and key non-functional requirements (scalability, security, etc)."""
    return generate_structured(prompt, Requirements)

def run_schema_agent(req: Requirements) -> SchemaDesign:
    prompt = f"""You are a database architect. Design a normalized relational schema.

Project: {req.project_name}
Summary: {req.summary}
Entities: {", ".join(req.entities)}
Core features: {", ".join(req.core_features)}

Design tables (name, columns with SQL type + constraints) and relationships between tables."""
    return generate_structured(prompt, SchemaDesign)

def run_api_agent(req: Requirements, schema: SchemaDesign) -> ApiDesign:
    tables = ", ".join(t.name for t in schema.tables)
    prompt = f"""You are a backend architect. Design a REST API.

Project: {req.project_name}
Core features: {", ".join(req.core_features)}
Database tables: {tables}

Design endpoints (method, path, description, request fields, response fields) — CRUD for each table plus feature-specific endpoints."""
    return generate_structured(prompt, ApiDesign)

def run_frontend_agent(req: Requirements, api: ApiDesign) -> FrontendDesign:
    endpoints = ", ".join(f"{e.method} {e.path}" for e in api.endpoints)
    prompt = f"""You are a frontend architect. Design a React component tree.

Project: {req.project_name}
Actors: {", ".join(req.actors)}
Core features: {", ".join(req.core_features)}
Available endpoints: {endpoints}

Return a FLAT list of components: id, parent_id ("" for top-level pages), type ("page"/"component"), description, props. Build a sensible 2-3 level hierarchy: pages → layout components → leaf components."""
    return generate_structured(prompt, FrontendDesign)

def run_sprint_agent(req: Requirements, schema: SchemaDesign, api: ApiDesign, fe: FrontendDesign) -> SprintPlan:
    prompt = f"""You are a project manager. Break this into sprints.

Project: {req.project_name}
Core features: {", ".join(req.core_features)}
Tables: {len(schema.tables)} | API endpoints: {len(api.endpoints)} | Frontend components: {len(fe.components)}

Create 2-4 sprints, each with a goal and 4-8 tasks (title, description, story points from {{1,2,3,5,8}}, category backend/frontend/devops/design)."""
    return generate_structured(prompt, SprintPlan)