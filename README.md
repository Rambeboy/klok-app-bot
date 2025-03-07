## KLOK APP CHAT AUTOMATION

Terminal-based automation tool for KlokApp AI chat with session token authentication and resilient retry mechanism.

## BOT FEATURE

- **Session token authentication** - Direct login using KlokApp session token
- **Interactive dashboard** - Beautiful terminal UI with blessed and blessed-contrib
- **Automated prompts** - Generate creative prompts using Groq API
- **Rate limit management** - Automatic cooldown when rate limits are reached
- **Point tracking** - Real-time monitoring of inference points
- **Automatic retry** - Resilient handling of network and server errors
- **Stream verification** - Point-based verification when streams are aborted
- **Detailed logging** - Comprehensive logging for monitoring and debugging

### SETUP & CONFIGURE BOT

## LINUX

1. **Clone Repository**:

   ```
   git clone https://github.com/Rambeboy/klok-app-bot.git && klok-app-bot
   ```

2. **Install dependencies**:

   ```
   npm install && npm run setup
   ```

3. **KlokApp Account**:

- Register at [KlokApp](https://klokapp.ai/)
- After registering, you'll need to get your session token

4. **Session Token** (Required):

- Login to KlokApp in your browser
- Open browser developer tools (F12)
- Go to Application tab > Local Storage > https://klokapp.ai
- Find and copy the `session_token` value
- Edit `session-token.key` file with this value:
```bash
nano accounts/session-token.key
```
Example :
```
echo "YOUR_SESSION_TOKEN_HERE" > session-token.key
```

5. **Groq API Key** (Required):
- Get your API key from [Groq](https://console.groq.com/)
- Edit `groq-api.key` file with this key:
```bash
nano config/groq-api.key
```
Example :
```
echo "YOUR_GROQ_API_KEY_HERE" > groq-api.key
```

## RUNNING

Start the automation:

```
npm run start
```

## KEYBOARD CONTROLS

- `S` - Start automation (requires session-token.key file)
- `P` - Pause automation
- `R` - Resume automation
- `L` - Clear log file and create backup
- `I` - Display file information (log size, session token status)
- `H` - Show help
- `Q` or `Esc` - Quit application

## RETRY MECHANISM

This application includes a sophisticated retry mechanism to handle connectivity issues:

- **Automatic Retry**: If network or server errors (5xx) occur, the script will automatically retry
- **Exponential Backoff**: Each failed attempt will increase the waiting time exponentially
- **Error Logging**: All errors and retries are recorded in the log for debugging
- **Automatic Recovery**: The system will attempt to continue automation after server returns to normal

## STREAM HANDLING

The application has a robust mechanism for handling aborted streams:

- **Point Verification**: If a stream is aborted, the app will check if points increased to verify success
- **Automatic Continuation**: Even with stream errors, the automation will continue running
- **Consecutive Error Management**: If multiple errors occur in sequence, the app will take longer breaks

## LOG FEATURES

- All program activities and API responses are recorded in the `info.log` file
- Detailed log format for API debugging
- Log file automatically rotated when reaching 10MB
- Up to 3 backup files (`info.log.1`, `info.log.2`, `info.log.3`) are kept
- Press `L` to clear logs and create manual backup
- Press `I` to view current log file information

## AUTOMATION FLOW

1. Login with session token
2. Get user information
3. Get user points
4. Get available models list
5. Select active non-pro model
6. Create new chat thread
7. Automation loop:
- Check rate limit
- Generate prompt with Groq API
- Send chat message
- Update points and rate limit information
- If rate limit is reached, enter cooldown
- Wait 3-10 seconds before next message
- Repeat until program is stopped

## ADDITIONAL COMMANDS

Clear log file from command line:

```
npm run clear-logs
```

## MAIN DEPENDENCIES

- `axios` - HTTP client
- `blessed` and `blessed-contrib` - Terminal UI
- `groq-sdk` - Generate prompts with Groq API
- `date-fns` - Date and time formatting

## NOTES

- This script is for educational and demonstration purposes only
- Session tokens have a limited validity period. If a token expires, get a new token and update the `session-token.key` file
- KlokApp rate limits may change, the script will adjust automatically
- If you frequently encounter "socket hang up" errors, the KlokApp server may be busy or unstable - the script will automatically retry

## LICENSE

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.