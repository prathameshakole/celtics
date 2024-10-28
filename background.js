// const CELTICS_TEAM_ID = 1610612738;  

// async function checkForCelticsGame(immediate = false) {
//   try {
    
//     const response = await fetch("https://corsproxy.io/?" + encodeURIComponent("https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json"));
//     const data = await response.json();
    
//     const games = data.scoreboard.games;
//     let celticsGame = null;

//     games.forEach(game => {
//       if (game.homeTeam.teamId === CELTICS_TEAM_ID || game.awayTeam.teamId === CELTICS_TEAM_ID) {
//         celticsGame = game;
//       }
//     });

//     if (celticsGame) {
//       const gameTime = new Date(celticsGame.gameTimeUTC);

//       if (immediate) {
//         chrome.notifications.create({
//           type: "basic",
//           iconUrl: "icon.png", 
//           title: "Today's Celtics Game",
//           message: `${celticsGame.awayTeam.teamName} vs ${celticsGame.homeTeam.teamName} at ${gameTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })} ET`
//         });
//       }
//     } else if (immediate) {
//       // Notify if there is no Celtics game today
//       chrome.notifications.create({
//         type: "basic",
//         iconUrl: "icon.png",
//         title: "No Celtics Game Today",
//         message: "The Celtics are not scheduled to play today."
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching game data:", error);
//   }
// }

// // Listener for popup message
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "checkGame") {
//     checkForCelticsGame(true);
//   }
// });

// // Initial daily check for Celtics game
// chrome.runtime.onInstalled.addListener(() => checkForCelticsGame());


// background.js
// const CELTICS_TEAM_ID = 1610612738;

// async function checkForCelticsGame(immediate = false) {
//   try {
//     const response = await fetch("https://corsproxy.io/?" + encodeURIComponent("https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json"));
//     const data = await response.json();

//     const games = data.scoreboard.games;
//     let celticsGame = null;

//     games.forEach(game => {
//       if (game.homeTeam.teamId === CELTICS_TEAM_ID || game.awayTeam.teamId === CELTICS_TEAM_ID) {
//         celticsGame = game;
//       }
//     });

//     if (celticsGame) {
//       const gameTime = new Date(celticsGame.gameTimeUTC);
//       if (immediate) {
//         chrome.notifications.create({
//           type: "basic",
//           iconUrl: "icon.png",
//           title: "Today's Celtics Game",
//           message: `${celticsGame.awayTeam.teamName} vs ${celticsGame.homeTeam.teamName} at ${gameTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })} ET`
//         });
//       }
//     } else if (immediate) {
//       chrome.notifications.create({
//         type: "basic",
//         iconUrl: "icon.png",
//         title: "No Celtics Game Today",
//         message: "The Celtics are not scheduled to play today."
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching today's game data:", error);
//   }
// }

// async function fetchPreviousCelticsGameScores() {
//   try {
//     const today = new Date();
//     const lastWeek = new Date();
//     lastWeek.setDate(today.getDate() - 7);

//     const dateFrom = lastWeek.toISOString().split('T')[0];
//     const dateTo = today.toISOString().split('T')[0];

//     const url = `https://stats.nba.com/stats/teamgamelogs?TeamID=${CELTICS_TEAM_ID}&DateFrom=${dateFrom}&DateTo=${dateTo}&Season=2023-24`;
//     console.log('Fetching from URL:', url); // Debug log

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': '*/*',
//         'Accept-Language': 'en-US,en;q=0.9',
//         'Origin': 'https://www.nba.com',
//         'Referer': 'https://www.nba.com/',
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Received data:', data); // Debug log
    
//     if (data.resultSets && data.resultSets[0] && data.resultSets[0].rowSet) {
//       const games = data.resultSets[0].rowSet;
//       const scores = games.map(game => {
//         const gameDate = new Date(game[5]).toLocaleDateString();
//         const matchup = game[6];
//         const result = game[7];
//         const points = game[28];
        
//         return `${gameDate} - ${matchup}: ${result} (${points} pts)`;
//       });

//       return { success: true, message: scores.join('\n') || "No recent games found." };
//     } else {
//       return { success: false, message: "No game data available." };
//     }
//   } catch (error) {
//     console.error("Error fetching previous game scores:", error);
//     return { success: false, message: `Error: ${error.message}` };
//   }
// }

// // Message handling
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('Received message:', request); // Debug log
  
//   if (request.action === "checkGame") {
//     checkForCelticsGame(true);
//     sendResponse({success: true});
//     return false;
//   }
  
//   if (request.action === "fetchPreviousScore") {
//     fetchPreviousCelticsGameScores()
//       .then(result => {
//         console.log('Sending response:', result); // Debug log
//         sendResponse(result);
//       })
//       .catch(error => {
//         console.error('Error:', error); // Debug log
//         sendResponse({
//           success: false,
//           message: `Error fetching scores: ${error.message}`
//         });
//       });
//     return true;
//   }
// });

// chrome.runtime.onInstalled.addListener(() => {
//   checkForCelticsGame();
// });


const API_KEY = '04cc27ee-283c-44d5-86b1-8f50be9a6ce4';
const CELTICS_ID = 2;  // Celtics team ID in balldontlie API

// Format date to YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Get game status description
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
    } else if (immediate) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "No Celtics Game Today",
        message: "The Celtics are not scheduled to play today."
      });
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
      // Sort games by date in descending order and get the most recent completed game
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

// Message handling
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
});

// Check for games when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  checkForCelticsGame();
});