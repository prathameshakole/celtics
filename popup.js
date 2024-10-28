// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('checkGame').addEventListener('click', () => {
//       chrome.runtime.sendMessage({ action: "checkGame" }, (response) => {
//       });
//     });
  
//     document.getElementById('checkPastGame').addEventListener('click', () => {
//       chrome.runtime.sendMessage({ action: "fetchPreviousScore" }, (response) => {
//         const gameInfoDiv = document.getElementById('gameInfo');
//         if (response && response.message) { // Ensure response and message are defined
//           gameInfoDiv.textContent = response.message; // Display fetched scores in the div
//         } else {
//           gameInfoDiv.textContent = "Error fetching past game scores."; // Handle error
//         }
//       });
//     });
//   });
  
// document.addEventListener('DOMContentLoaded', () => {
//     const gameInfoDiv = document.getElementById('gameInfo');
    
//     document.getElementById('checkGame').addEventListener('click', () => {
//       chrome.runtime.sendMessage({ action: "checkGame" });
//     });
  
//     document.getElementById('checkPastGame').addEventListener('click', () => {
//       gameInfoDiv.textContent = "Loading...";
      
//       try {
//         chrome.runtime.sendMessage({ action: "fetchPreviousScore" }, (response) => {
//           console.log('Popup received response:', response); // Debug log
          
//           if (chrome.runtime.lastError) {
//             console.error('Runtime error:', chrome.runtime.lastError);
//             gameInfoDiv.textContent = "Error: Could not fetch game scores.";
//             return;
//           }
          
//           if (response && response.success) {
//             gameInfoDiv.textContent = response.message;
//           } else if (response && response.message) {
//             gameInfoDiv.textContent = response.message;
//           } else {
//             gameInfoDiv.textContent = "No data available.";
//           }
//         });
//       } catch (error) {
//         console.error('Error in popup:', error);
//         gameInfoDiv.textContent = "Error: Could not fetch game scores.";
//       }
//     });
//   });

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
      
      // Update loading and error states
      function showLoading() {
        gameInfoDiv.innerHTML = '<div class="loading">Loading game information...</div>';
      }
      
      function showError(message) {
        gameInfoDiv.innerHTML = `<div class="error-message">${message}</div>`;
      }
    
    document.getElementById('checkGame').addEventListener('click', () => {
      gameInfoDiv.innerHTML = 'Loading...';
      
      chrome.runtime.sendMessage({ action: "checkGame" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          gameInfoDiv.innerHTML = "Error: Could not fetch game data.";
          return;
        }
        
        if (response.success && response.game) {
          gameInfoDiv.innerHTML = displayGame(response.game);
        } else {
          gameInfoDiv.innerHTML = response.message || "No Celtics game found for today.";
        }
      });
    });
  
    document.getElementById('checkPastGame').addEventListener('click', () => {
      gameInfoDiv.innerHTML = 'Loading...';
      
      chrome.runtime.sendMessage({ action: "fetchPreviousGame" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          gameInfoDiv.innerHTML = "Error: Could not fetch previous game data.";
          return;
        }
        
        if (response.success && response.game) {
          gameInfoDiv.innerHTML = displayGame(response.game);
        } else {
          gameInfoDiv.innerHTML = response.message || "No previous game data available.";
        }
      });
    });
  });