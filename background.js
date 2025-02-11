const API_KEY = '04cc27ee-283c-44d5-86b1-8f50be9a6ce4';
const CELTICS_ID = 2; 

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getGameStatus(game) {
  if (game.status.includes('Q') || game.status === 'Halftime') {
    return `Live - ${game.status}`;
  }
  return game.status;
}

async function checkForCelticsGame(immediate = false) {
  try {
    const today = formatDate(new Date());
    const response = await fetch(
      `https://api.balldontlie.io/v1/games?dates[]=${today}&team_ids[]=${CELTICS_ID}`,
      {
        headers: {
          'Authorization': API_KEY
        }
      }
    );

    const data = await response.json();
    const games = data.data;
    
    if (games && games.length > 0) {
      const celticsGame = games[0];
      
      if (immediate) {
        const status = getGameStatus(celticsGame);
        const message = `${celticsGame.visitor_team.full_name} (${celticsGame.visitor_team_score}) @ ${celticsGame.home_team.full_name} (${celticsGame.home_team_score}) - ${status}`;
        
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Celtics Game Update",
          message: message
        });
      }
      return celticsGame;
    } 
    
    return null;
  } catch (error) {
    console.error("Error fetching game data:", error);
    if (immediate) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Error",
        message: "Could not fetch game data. Please try again later."
      });
    }
    return null;
  }
}

async function fetchPreviousCelticsGame() {
  try {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const response = await fetch(
      `https://api.balldontlie.io/v1/games?start_date=${formatDate(lastWeek)}&end_date=${formatDate(today)}&team_ids[]=${CELTICS_ID}&per_page=100`,
      {
        headers: {
          'Authorization': API_KEY
        }
      }
    );

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const completedGames = data.data
        .filter(game => game.status === "Final")
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (completedGames.length > 0) {
        return {
          success: true,
          game: completedGames[0]
        };
      }
    }
    
    return {
      success: false,
      message: "No completed games found in the last week."
    };
  } catch (error) {
    console.error("Error fetching previous game:", error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

async function getCurrentStanding() {
  try {
    const response = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/Standings/2025?key=f352df84c30f427c87fbc5394336bf03`);
    const data = await response.json();

    const celticsStanding = data.find(team => team.TeamID === 9); // Update to correct TeamID

    if (celticsStanding) {
      return {
        success: true,
        data: {
          team: `${celticsStanding.City} ${celticsStanding.Name}`,
          wins: celticsStanding.Wins,
          losses: celticsStanding.Losses,
          winPercentage: (celticsStanding.Percentage * 100).toFixed(1) + "%",
          conferenceRank: celticsStanding.ConferenceRank,
          divisionRank: celticsStanding.DivisionRank,
          conference: celticsStanding.Conference,
          division: celticsStanding.Division,
          homeRecord: `${celticsStanding.HomeWins}-${celticsStanding.HomeLosses}`,
          awayRecord: `${celticsStanding.AwayWins}-${celticsStanding.AwayLosses}`,
          streak: `${celticsStanding.StreakDescription}`,
          pointsPerGame: celticsStanding.PointsPerGameFor.toFixed(1),
        }
      };
    }

    return {
      success: false,
      message: "Celtics data not found in the standings."
    };
  } catch (error) {
    console.error("Error fetching the standings:", error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkGame") {
    checkForCelticsGame(true)
      .then(game => {
        sendResponse({ success: true, game: game });
      })
      .catch(error => {
        sendResponse({ success: false, message: error.message });
      });
    return true; 
  }

  if (request.action === "fetchPreviousGame") {
    fetchPreviousCelticsGame()
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({
          success: false,
          message: `Error fetching game: ${error.message}`
        });
      });
    return true; 
  }

  if (request.action === "getCurrentStanding") {
    getCurrentStanding()
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({
          success: false,
          message: `Error fetching standings: ${error.message}`
        });
      });
    return true; 
  }

  return false; 
});


// Check for games when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  checkForCelticsGame();
});