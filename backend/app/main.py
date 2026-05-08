from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.data_service import (
    get_summary_stats,
    get_teams,
    get_team_stats,
    compare_teams,
    get_seasons,
    get_season_stats,
    get_team_season_history,
    goals_by_season,
    top_teams_by_wins,
    head_to_head
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

@app.get("/seasons")
def seasons():
    return get_seasons()


@app.get("/seasons/{season}")
def season_stats(season: str):
    return get_season_stats(season)

@app.get("/teams/{team_name}/history")
def team_history(team_name: str):
    return get_team_season_history(team_name)

@app.get("/analytics/goals-by-season")
def analytics_goals():
    return goals_by_season()


@app.get("/analytics/top-teams")
def analytics_top_teams():
    return top_teams_by_wins()

@app.get("/head-to-head")
def h2h(team_a: str, team_b: str):
    return head_to_head(team_a, team_b)

