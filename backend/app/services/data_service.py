import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data" / "raw"


def load_matches():
    all_matches = []

    for file in sorted(DATA_DIR.glob("*.csv")):
        season = file.stem
        print(f"Reading file: {file.name}")

        df = pd.read_csv(
            file,
            usecols=["Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR"],
            engine="python",
            encoding="latin1",
            on_bad_lines="skip"
        )

        df["Season"] = season
        all_matches.append(df)

    return pd.concat(all_matches, ignore_index=True)


def get_summary_stats():
    df = load_matches()

    return {
        "seasons": df["Season"].nunique(),
        "teams": pd.unique(df[["HomeTeam", "AwayTeam"]].values.ravel()).size,
        "matches": len(df),
        "goals": int(df["FTHG"].sum() + df["FTAG"].sum())
    }


def get_teams():
    df = load_matches()

    teams = pd.unique(df[["HomeTeam", "AwayTeam"]].values.ravel())

    teams = [
        str(team)
        for team in teams
        if pd.notna(team)
    ]

    return sorted(teams)

def get_team_stats(team_name: str):
    df = load_matches()

    home_matches = df[df["HomeTeam"] == team_name]
    away_matches = df[df["AwayTeam"] == team_name]

    played = len(home_matches) + len(away_matches)

    wins = (
        len(home_matches[home_matches["FTR"] == "H"])
        + len(away_matches[away_matches["FTR"] == "A"])
    )

    draws = (
        len(home_matches[home_matches["FTR"] == "D"])
        + len(away_matches[away_matches["FTR"] == "D"])
    )

    losses = played - wins - draws

    goals_scored = (
        home_matches["FTHG"].sum()
        + away_matches["FTAG"].sum()
    )

    goals_conceded = (
        home_matches["FTAG"].sum()
        + away_matches["FTHG"].sum()
    )

    return {
        "team": team_name,
        "played": int(played),
        "wins": int(wins),
        "draws": int(draws),
        "losses": int(losses),
        "goals_scored": int(goals_scored),
        "goals_conceded": int(goals_conceded),
    }

def compare_teams(team_a: str, team_b: str):
    stats_a = get_team_stats(team_a)
    stats_b = get_team_stats(team_b)

    return {
        "team_a": stats_a,
        "team_b": stats_b
    }