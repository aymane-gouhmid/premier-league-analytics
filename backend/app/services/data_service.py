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

def get_seasons():
    df = load_matches()

    seasons = sorted(df["Season"].unique())

    return seasons

def get_season_stats(season: str):
    df = load_matches()

    season_df = df[df["Season"] == season]

    teams = pd.unique(
        season_df[["HomeTeam", "AwayTeam"]].values.ravel()
    )

    standings = []

    for team in teams:
        home = season_df[season_df["HomeTeam"] == team]
        away = season_df[season_df["AwayTeam"] == team]

        wins = (
            len(home[home["FTR"] == "H"])
            + len(away[away["FTR"] == "A"])
        )

        draws = (
            len(home[home["FTR"] == "D"])
            + len(away[away["FTR"] == "D"])
        )

        losses = (
            len(home[home["FTR"] == "A"])
            + len(away[away["FTR"] == "H"])
        )

        goals_for = (
            home["FTHG"].sum()
            + away["FTAG"].sum()
        )

        goals_against = (
            home["FTAG"].sum()
            + away["FTHG"].sum()
        )

        points = wins * 3 + draws

        standings.append({
            "team": team,
            "played": int(len(home) + len(away)),
            "wins": int(wins),
            "draws": int(draws),
            "losses": int(losses),
            "goals_for": int(goals_for),
            "goals_against": int(goals_against),
            "goal_diff": int(goals_for - goals_against),
            "points": int(points),
        })

    standings = sorted(
        standings,
        key=lambda x: (x["points"], x["goal_diff"]),
        reverse=True
    )

    champion = standings[0]["team"]

    return {
        "season": season,
        "champion": champion,
        "matches": len(season_df),
        "goals": int(
            season_df["FTHG"].sum()
            + season_df["FTAG"].sum()
        ),
        "standings": standings
    }

def get_team_season_history(team_name: str):
    df = load_matches()

    seasons = sorted(df["Season"].unique())

    history = []

    for season in seasons:
        season_df = df[df["Season"] == season]

        home = season_df[season_df["HomeTeam"] == team_name]
        away = season_df[season_df["AwayTeam"] == team_name]

        played = len(home) + len(away)

        if played == 0:
            continue

        wins = (
            len(home[home["FTR"] == "H"])
            + len(away[away["FTR"] == "A"])
        )

        draws = (
            len(home[home["FTR"] == "D"])
            + len(away[away["FTR"] == "D"])
        )

        losses = played - wins - draws

        goals_for = (
            home["FTHG"].sum()
            + away["FTAG"].sum()
        )

        goals_against = (
            home["FTAG"].sum()
            + away["FTHG"].sum()
        )

        points = wins * 3 + draws

        history.append({
            "season": season,
            "played": int(played),
            "wins": int(wins),
            "draws": int(draws),
            "losses": int(losses),
            "goals_for": int(goals_for),
            "goals_against": int(goals_against),
            "points": int(points),
        })

    return history

def goals_by_season():
    df = load_matches()

    result = []

    for season in sorted(df["Season"].unique()):
        season_df = df[df["Season"] == season]

        goals = int(
            season_df["FTHG"].sum()
            + season_df["FTAG"].sum()
        )

        result.append({
            "season": season,
            "goals": goals
        })

    return result

def top_teams_by_wins():
    df = load_matches()

    teams = pd.unique(
        df[["HomeTeam", "AwayTeam"]].values.ravel()
    )

    results = []

    for team in teams:
        home_wins = len(
            df[
                (df["HomeTeam"] == team)
                & (df["FTR"] == "H")
            ]
        )

        away_wins = len(
            df[
                (df["AwayTeam"] == team)
                & (df["FTR"] == "A")
            ]
        )

        total_wins = home_wins + away_wins

        results.append({
            "team": team,
            "wins": int(total_wins)
        })

    results = sorted(
        results,
        key=lambda x: x["wins"],
        reverse=True
    )

    return results[:10]

def matches_by_season():
    df = load_matches()

    result = []

    for season in sorted(df["Season"].unique()):
        season_df = df[df["Season"] == season]

        result.append({
            "season": season,
            "matches": int(len(season_df))
        })

    return result

def top_teams_by_goals():
    df = load_matches()

    teams = pd.unique(
        df[["HomeTeam", "AwayTeam"]].values.ravel()
    )

    results = []

    for team in teams:
        if pd.isna(team):
            continue

        home_goals = df[df["HomeTeam"] == team]["FTHG"].sum()
        away_goals = df[df["AwayTeam"] == team]["FTAG"].sum()

        results.append({
            "team": str(team),
            "goals": int(home_goals + away_goals)
        })

    results = sorted(
        results,
        key=lambda x: x["goals"],
        reverse=True
    )

    return results[:10]

def avg_goals_by_season():
    df = load_matches()

    result = []

    for season in sorted(df["Season"].unique()):
        season_df = df[df["Season"] == season]
        matches = len(season_df)
        goals = season_df["FTHG"].sum() + season_df["FTAG"].sum()

        result.append({
            "season": season,
            "avg_goals": round(float(goals / matches), 2) if matches else 0
        })

    return result

def results_distribution():
    df = load_matches()

    home_wins = len(df[df["FTR"] == "H"])
    draws = len(df[df["FTR"] == "D"])
    away_wins = len(df[df["FTR"] == "A"])
    total = home_wins + draws + away_wins

    return {
        "home_wins": int(home_wins),
        "draws": int(draws),
        "away_wins": int(away_wins),
        "total_matches": int(total),
        "home_win_percentage": round((home_wins / total) * 100, 1) if total else 0,
        "draw_percentage": round((draws / total) * 100, 1) if total else 0,
        "away_win_percentage": round((away_wins / total) * 100, 1) if total else 0,
    }

def best_attacks():
    df = load_matches()

    teams = pd.unique(
        df[["HomeTeam", "AwayTeam"]].values.ravel()
    )

    results = []

    for team in teams:
        if pd.isna(team):
            continue

        home_matches = df[df["HomeTeam"] == team]
        away_matches = df[df["AwayTeam"] == team]
        played = len(home_matches) + len(away_matches)
        goals = home_matches["FTHG"].sum() + away_matches["FTAG"].sum()

        results.append({
            "team": str(team),
            "avg_goals": round(float(goals / played), 2) if played else 0,
            "total_goals": int(goals),
            "matches": int(played)
        })

    results = sorted(
        results,
        key=lambda x: x["avg_goals"],
        reverse=True
    )

    return results[:10]

def best_defenses():
    df = load_matches()

    teams = pd.unique(
        df[["HomeTeam", "AwayTeam"]].values.ravel()
    )

    results = []

    for team in teams:
        if pd.isna(team):
            continue

        home_matches = df[df["HomeTeam"] == team]
        away_matches = df[df["AwayTeam"] == team]
        played = len(home_matches) + len(away_matches)
        goals_conceded = home_matches["FTAG"].sum() + away_matches["FTHG"].sum()

        results.append({
            "team": str(team),
            "avg_goals_conceded": round(float(goals_conceded / played), 2) if played else 0,
            "total_goals_conceded": int(goals_conceded),
            "matches": int(played)
        })

    results = sorted(
        results,
        key=lambda x: x["avg_goals_conceded"]
    )

    return results[:10]

def head_to_head(team_a: str, team_b: str):
    df = load_matches()

    matches = df[
        (
            (df["HomeTeam"] == team_a)
            & (df["AwayTeam"] == team_b)
        )
        |
        (
            (df["HomeTeam"] == team_b)
            & (df["AwayTeam"] == team_a)
        )
    ]

    team_a_wins = 0
    team_b_wins = 0
    draws = 0

    for _, row in matches.iterrows():

        if row["FTR"] == "D":
            draws += 1

        elif (
            row["HomeTeam"] == team_a
            and row["FTR"] == "H"
        ) or (
            row["AwayTeam"] == team_a
            and row["FTR"] == "A"
        ):
            team_a_wins += 1

        else:
            team_b_wins += 1

    goals_team_a = 0
    goals_team_b = 0

    for _, row in matches.iterrows():

        if row["HomeTeam"] == team_a:
            goals_team_a += row["FTHG"]
            goals_team_b += row["FTAG"]

        else:
            goals_team_a += row["FTAG"]
            goals_team_b += row["FTHG"]

    recent_matches = matches.tail(10).to_dict(orient="records")

    return {
        "team_a": team_a,
        "team_b": team_b,
        "matches_played": int(len(matches)),
        "team_a_wins": int(team_a_wins),
        "team_b_wins": int(team_b_wins),
        "draws": int(draws),
        "goals_team_a": int(goals_team_a),
        "goals_team_b": int(goals_team_b),
        "recent_matches": recent_matches,
    }

def get_team_last_matches(team_name: str, limit: int = 10):
    df = load_matches()

    team_matches = df[
        (df["HomeTeam"] == team_name) |
        (df["AwayTeam"] == team_name)
    ].copy()

    team_matches = team_matches.tail(limit)

    results = []

    for _, row in team_matches.iterrows():
        is_home = row["HomeTeam"] == team_name

        goals_for = row["FTHG"] if is_home else row["FTAG"]
        goals_against = row["FTAG"] if is_home else row["FTHG"]

        if goals_for > goals_against:
            result = "W"
        elif goals_for < goals_against:
            result = "L"
        else:
            result = "D"

        results.append({
            "season": row["Season"],
            "date": row["Date"],
            "home_team": row["HomeTeam"],
            "away_team": row["AwayTeam"],
            "home_goals": int(row["FTHG"]),
            "away_goals": int(row["FTAG"]),
            "result": result,
            "venue": "Home" if is_home else "Away"
        })

    return results[::-1]

def predict_match(team_a: str, team_b: str):
    stats_a = get_team_stats(team_a)
    stats_b = get_team_stats(team_b)

    history_a = get_team_season_history(team_a)
    history_b = get_team_season_history(team_b)

    recent_a = history_a[-5:] if len(history_a) >= 5 else history_a
    recent_b = history_b[-5:] if len(history_b) >= 5 else history_b

    points_a = sum(item["points"] for item in recent_a)
    points_b = sum(item["points"] for item in recent_b)

    win_rate_a = stats_a["wins"] / stats_a["played"] if stats_a["played"] else 0
    win_rate_b = stats_b["wins"] / stats_b["played"] if stats_b["played"] else 0

    goals_rate_a = stats_a["goals_scored"] / stats_a["played"] if stats_a["played"] else 0
    goals_rate_b = stats_b["goals_scored"] / stats_b["played"] if stats_b["played"] else 0

    score_a = (points_a * 0.4) + (win_rate_a * 100 * 0.35) + (goals_rate_a * 20 * 0.25)
    score_b = (points_b * 0.4) + (win_rate_b * 100 * 0.35) + (goals_rate_b * 20 * 0.25)

    total = score_a + score_b

    if total == 0:
        prob_a = 33
        prob_b = 33
        draw = 34
    else:
        prob_a = round((score_a / total) * 80, 1)
        prob_b = round((score_b / total) * 80, 1)
        draw = round(100 - prob_a - prob_b, 1)

    if prob_a > prob_b:
        predicted_winner = team_a
    elif prob_b > prob_a:
        predicted_winner = team_b
    else:
        predicted_winner = "Draw"

    return {
        "team_a": team_a,
        "team_b": team_b,
        "predicted_winner": predicted_winner,
        "probability_team_a": prob_a,
        "probability_team_b": prob_b,
        "probability_draw": draw,
        "score_team_a": round(score_a, 2),
        "score_team_b": round(score_b, 2),
        "note": "This prediction is based on historical stats, recent season performance, win rate and goals rate."
    }

