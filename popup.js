document.addEventListener('DOMContentLoaded', () => {
    const gameInfoDiv = document.getElementById('gameInfo');

    function displayGame(game) {
        if (!game) return '<div class="no-game-message">No game data available.</div>';

        const homeTeam = game.home_team.full_name;
        const visitorTeam = game.visitor_team.full_name;
        const homeScore = game.home_team_score;
        const visitorScore = game.visitor_team_score;
        const status = game.status;
        const gameDate = new Date(game.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        let resultHTML = `
          <div class="game-result">
              <div class="game-date">${gameDate}</div>
      `;

        if (status === "Final") {
            resultHTML += `
              <div class="score">
                  ${visitorTeam}: ${visitorScore}<br>
                  ${homeTeam}: ${homeScore}
              </div>
              <div class="final-status">Final</div>
          `;
        } else {
            resultHTML += `
              <div class="score">
                  ${visitorTeam}: ${visitorScore}<br>
                  ${homeTeam}: ${homeScore}
              </div>
              <div>
                  <span class="live-indicator">${status}</span>
              </div>
          `;
        }

        resultHTML += `</div>`;
        return resultHTML;
    }

    function displayStandings(standingsData) {
        if (!standingsData) return '<div class="no-standings-message">No standings data available.</div>';

        return `
      <div class="standings-info">
          <h3>${standingsData.team} (${standingsData.winPercentage})</h3>
          <div class="standings-details">
              <div class="record">
                  <strong>Record:</strong> ${standingsData.wins}-${standingsData.losses}  
                  <br><strong>Home:</strong> ${standingsData.homeRecord}  
                  <br><strong>Away:</strong> ${standingsData.awayRecord}  
              </div>
  
              <div class="rankings">
                  <strong>Conference:</strong> ${standingsData.conference} (#${standingsData.conferenceRank})  
                  <br><strong>Division:</strong> ${standingsData.division} (#${standingsData.divisionRank})  
              </div>
  
              <div class="additional-stats">
                  <br><strong>PPG:</strong> ${standingsData.pointsPerGame}  
              </div>
          </div>
      </div>
    `;
    }

    


    function showLoading() {
        gameInfoDiv.innerHTML = '<div class="loading">Loading information...</div>';
    }

    function showError(message) {
        gameInfoDiv.innerHTML = `<div class="error-message">${message}</div>`;
    }

    const checkGameButton = document.getElementById('checkGame');
    const checkPastGameButton = document.getElementById('checkPastGame');
    const checkStandingsButton = document.getElementById('checkStandings');

    if (checkGameButton) {
        checkGameButton.addEventListener('click', () => {
            showLoading();

            chrome.runtime.sendMessage({ action: "checkGame" }, (response) => {
                if (chrome.runtime.lastError) {
                    showError("Error: Could not fetch game data.");
                    return;
                }

                if (response.success && response.game) {
                    gameInfoDiv.innerHTML = displayGame(response.game);
                } else {
                    gameInfoDiv.innerHTML = response.message || "No Celtics game found for today.";
                }
            });
        });
    } 

    if (checkPastGameButton) {
        checkPastGameButton.addEventListener('click', () => {
            showLoading();

            chrome.runtime.sendMessage({ action: "fetchPreviousGame" }, (response) => {
                if (chrome.runtime.lastError) {
                    showError("Error: Could not fetch previous game data.");
                    return;
                }

                if (response.success && response.game) {
                    gameInfoDiv.innerHTML = displayGame(response.game);
                } else {
                    gameInfoDiv.innerHTML = response.message || "No previous game data available.";
                }
            });
        });
    } 

    if (checkStandingsButton) {
        checkStandingsButton.addEventListener('click', () => {
            showLoading();

            chrome.runtime.sendMessage({ action: "getCurrentStanding" }, (response) => {
                if (chrome.runtime.lastError) {
                    showError(`Error: ${chrome.runtime.lastError.message || "Could not fetch standings data."}`);
                    return;
                }

                if (response.success && response.data) {
                    gameInfoDiv.innerHTML = displayStandings(response.data);
                } else {
                    gameInfoDiv.innerHTML = response.message || "Could not retrieve standings information.";
                }
            });
        });
    }
    

});