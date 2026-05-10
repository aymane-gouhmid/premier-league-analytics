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
    matches_by_season,
    top_teams_by_goals,
    avg_goals_by_season,
    results_distribution,
    best_attacks,
    best_defenses,
    head_to_head,
    get_team_last_matches,
    predict_match
)

app = FastAPI(title="Premier League Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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

@app.get("/analytics/matches-by-season")
def analytics_matches_by_season():
    return matches_by_season()

@app.get("/analytics/top-teams-by-goals")
def analytics_top_teams_by_goals():
    return top_teams_by_goals()

@app.get("/analytics/avg-goals-by-season")
def analytics_avg_goals_by_season():
    return avg_goals_by_season()

@app.get("/analytics/results-distribution")
def analytics_results_distribution():
    return results_distribution()

@app.get("/analytics/best-attacks")
def analytics_best_attacks():
    return best_attacks()

@app.get("/analytics/best-defenses")
def analytics_best_defenses():
    return best_defenses()

@app.get("/head-to-head")
def h2h(team_a: str, team_b: str):
    return head_to_head(team_a, team_b)

@app.get("/teams/{team_name}/last-matches")
def team_last_matches(team_name: str, limit: int = 10):
    return get_team_last_matches(team_name, limit)

@app.get("/predict")
def predict(team_a: str, team_b: str):
    return predict_match(team_a, team_b)

