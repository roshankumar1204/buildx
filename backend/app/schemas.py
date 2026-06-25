from pydantic import BaseModel, Field
from typing import List

class Requirements(BaseModel):
    project_name: str
    summary: str
    actors: List[str]
    core_features: List[str]
    entities: List[str]
    non_functional_requirements: List[str]

class Column(BaseModel):
    name: str
    type: str
    constraints: List[str] = Field(default_factory=list)

class Relationship(BaseModel):
    from_table: str
    to_table: str
    type: str  # one-to-many | many-to-many | one-to-one

class Table(BaseModel):
    name: str
    columns: List[Column]

class SchemaDesign(BaseModel):
    tables: List[Table]
    relationships: List[Relationship]

class ApiField(BaseModel):
    name: str
    type: str

class Endpoint(BaseModel):
    method: str
    path: str
    description: str
    request_fields: List[ApiField] = Field(default_factory=list)
    response_fields: List[ApiField] = Field(default_factory=list)

class ApiDesign(BaseModel):
    endpoints: List[Endpoint]

class ComponentNode(BaseModel):
    id: str
    name: str
    parent_id: str  # "" if top-level page — keeps the schema flat, no recursion
    type: str        # "page" | "component"
    description: str
    props: List[str] = Field(default_factory=list)

class FrontendDesign(BaseModel):
    components: List[ComponentNode]

class Task(BaseModel):
    title: str
    description: str
    story_points: int
    category: str  # backend | frontend | devops | design

class Sprint(BaseModel):
    sprint_number: int
    goal: str
    tasks: List[Task]

class SprintPlan(BaseModel):
    sprints: List[Sprint]