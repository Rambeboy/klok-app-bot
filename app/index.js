const {
  initDashboard,
  registerKeyHandler,
  render,
  updateStatus,
  widgets,
} = require("./src/ui");
const {
  initAutomation,
  startAutomation,
  pauseAutomation,
  resumeAutomation,
  manualSwitchAccount,
  getRunningState,
} = require("./src/automation");
const { auth } = require("./src/api");
const {
  log,
  logToFile,
  checkLogSize,
  clearLogFile,
  backupLogFile,
} = require("./src/utils");

async function main() {
  try {
    checkLogSize();

    initDashboard();

    log("Welcome to KlokApp Chat Automation", "info");
    log("Press S to start, P to pause, R to resume, H for help", "info");
    logToFile("KlokApp Chat Automation started");

    const tokens = auth.readAllSessionTokensFromFile();
    if (tokens.length === 0) {
      log(
        "No session tokens found. Please add session-token.key file.",
        "error"
      );
      updateStatus("Missing session-token.key file", "error");
    } else if (tokens.length === 1) {
      log(
        "Session token file found with 1 account! Ready for login.",
        "success"
      );
      updateStatus("Session token ready. Press S to start", "success");
    } else {
      log(
        `Session token file found with ${tokens.length} accounts! Ready for login.`,
        "success"
      );
      updateStatus(
        `${tokens.length} accounts ready. Press S to start`,
        "success"
      );
    }

    render();

    await initAutomation();

    registerKeyHandler("s", () => {
      if (!getRunningState()) {
        const tokens = auth.readAllSessionTokensFromFile();
        if (tokens.length === 0) {
          log(
            "No session tokens found. Please add session-token.key file.",
            "error"
          );
          updateStatus("Missing session-token.key", "error");
          render();
          return;
        }

        log("Starting automation...", "info");
        logToFile("Starting automation (user initiated)");
        startAutomation();
      } else {
        log("Automation already running", "warning");
        logToFile("Start request ignored - automation already running");
      }
    });

    registerKeyHandler("p", () => {
      if (getRunningState()) {
        log("Pausing automation...", "info");
        logToFile("Pausing automation (user initiated)");
        pauseAutomation();
      } else {
        log("Automation not running", "warning");
        logToFile("Pause request ignored - automation not running");
      }
    });

    registerKeyHandler("r", () => {
      if (!getRunningState()) {
        log("Resuming automation...", "info");
        logToFile("Resuming automation (user initiated)");
        resumeAutomation();
      } else {
        log("Automation already running", "warning");
        logToFile("Resume request ignored - automation already running");
      }
    });

    registerKeyHandler("a", async () => {
      const tokenInfo = auth.getTokenInfo();
      if (!tokenInfo.hasMultipleTokens) {
        log("Only one account available, cannot switch", "warning");
        return;
      }

      if (getRunningState()) {
        log("Manually switching account...", "info");
        logToFile("Manual account switch initiated");

        const success = await manualSwitchAccount();
        if (success) {
          log("Account switched successfully", "success");
        } else {
          log("Failed to switch account", "error");
        }
      } else {
        log("Automation must be running to switch accounts", "warning");
      }
    });

    registerKeyHandler("l", () => {
      const backupPath = backupLogFile();
      clearLogFile();
      if (backupPath) {
        log(`Log file cleared and backed up to ${backupPath}`, "success");
        logToFile("Log file cleared and backed up (user initiated)");
      } else {
        log("Log file cleared", "success");
        logToFile("Log file cleared (user initiated)");
      }
      render();
    });

    registerKeyHandler("i", () => {
      const fs = require("fs");
      const path = require("path");

      try {
        const logPath = path.join(process.cwd(), "info.log");
        if (fs.existsSync(logPath)) {
          const stats = fs.statSync(logPath);
          const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          const lastModified = new Date(stats.mtime).toLocaleString();

          log(
            `Log file: Size=${fileSizeMB}MB, Last Modified: ${lastModified}`,
            "info"
          );
        } else {
          log("Log file does not exist yet", "info");
        }
      } catch (error) {
        log(`Error reading log info: ${error.message}`, "error");
      }

      try {
        const tokens = auth.readAllSessionTokensFromFile();
        const tokenInfo = auth.getTokenInfo();

        if (tokens.length === 0) {
          log("No accounts found", "warning");
        } else if (tokens.length === 1) {
          log("1 account configured", "info");
        } else {
          log(
            `${tokens.length} accounts configured, current: ${
              tokenInfo.currentIndex + 1
            }/${tokenInfo.totalTokens}`,
            "info"
          );
        }
      } catch (error) {
        log(`Error checking accounts: ${error.message}`, "error");
      }

      updateStatus("Info displayed", "info");

      setTimeout(() => {
        updateStatus(
          getRunningState() ? "Running" : "Ready",
          getRunningState() ? "success" : "info"
        );
        render();
      }, 5000);

      render();
    });

    registerKeyHandler("h", () => {
      log("Controls:", "info");
      log("S - Start automation (requires at least one session token)", "info");
      log("P - Pause automation", "info");
      log("R - Resume automation", "info");
      log(
        "A - Switch to next account (when multiple accounts available)",
        "info"
      );
      log("L - Clear log file and make backup", "info");
      log("I - Show file and account information", "info");
      log("H - Show this help", "info");
      log("Q or Esc - Quit application", "info");

      updateStatus("Help - press any key to continue", "info");
      render();

      setTimeout(() => {
        updateStatus(
          getRunningState() ? "Running" : "Ready",
          getRunningState() ? "success" : "info"
        );
        render();
      }, 8000);
    });
  } catch (error) {
    log(`Application error: ${error.message}`, "error");
    logToFile(`Application error: ${error.message}`, { stack: error.stack });
    updateStatus("Error", "error");
    render();
  }
}

main();
