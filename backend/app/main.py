from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.data_service import (
    get_summary_stats,
    get_teams,
    get_team_stats,
    compare_teams
)

app = FastAPI(title="Premier League Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Premier League API running"}


@app.get("/summary")
def summary():
    return get_summary_stats()


@app.get("/teams")
def teams():
    return get_teams()

@app.get("/teams/{team_name}")
def team_stats(team_name: str):
    return get_team_stats(team_name)

@app.get("/compare")
def compare(team_a: str, team_b: str):
    return compare_teams(team_a, team_b)