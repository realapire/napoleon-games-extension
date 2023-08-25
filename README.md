# Napoleon Sandbox Chrome Extension

The Napoleon Sandbox Chrome Extension is a tool designed to enhance your experience on the Napoleon Sports website. It injects custom scripts into the website to provide additional functionality and information related to bets and user balance.

## Features

- Displays the user's balance prominently at the top of the webpage.
- Enhances the user's name display in the header.
- Sorts and organizes betting information for better readability.
- Allows the user to expand/collapse individual bet details.

## Installation

1. Clone this repository to your local machine or download it as a ZIP file.
2. Open your Google Chrome browser.
3. Navigate to `chrome://extensions/` using the address bar.
4. Turn on the "Developer mode" toggle located in the upper right corner.
5. Click the "Load unpacked" button.
6. Select the directory where you cloned or extracted this repository.

## Usage

1. Open the Napoleon Sports website (`https://www.napoleonsports.be/`).
2. Log in to your account.
3. The extension will automatically inject the custom scripts to enhance the page.

## Background Script
The background.js file contains the JavaScript code responsible for injecting the custom functionality into the website. It handles tasks such as fetching user information and modifying the UI.

## Extension Modal Window
The index.js file handles the extension's modal window, where users can configure their username, balance, and place bets.

## Bet Loader
The betloader.js file is responsible for loading and displaying bets in the extension's popup window. It uses query parameters to receive bet data and provides functions to read and set bets using the Chrome Storage API.

## Additional Notes
- This extension is designed for educational and personal use only.
- It interacts with the Napoleon Sports website and may be affected by changes to the website's structure or behavior.
- Use responsibly and in accordance with the website's terms of use.

## Disclaimer
This project is not affiliated with or endorsed by Napoleon Sports. Use it at your own risk.
