<div align="center">
  
# Blue VS Red | Documentation

[![GitHub release](https://img.shields.io/github/release/EstebanQui/Blue-vs-Red?include_prereleases=&sort=semver&color=blue)](https://github.com/EstebanQui/Blue-vs-Red/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![issues - Blue-vs-Red](https://img.shields.io/github/issues/EstebanQui/Blue-vs-Red)](https://github.com/EstebanQui/Blue-vs-Red/issues)
  
</div>

<img width="1548" alt="image" src="https://github.com/EstebanQui/Blue-vs-Red/assets/152623309/de9863e4-8871-4b72-b0ea-2b6118834e72">

## Overview
Blue VS Red is a community clash game where users join either the Blue or Red team and compete by clicking in their team's area to increase its size. The game features dynamic power-ups that appear randomly and can either boost or reduce the team's score.

## Project Architecture

### Frontend
Located in the `front/` directory, the frontend is built using HTML, CSS, and JavaScript. It interacts with the backend through WebSocket connections managed by Socket.IO.

#### Key Components:
- **HTML**: `front/index.html` - Contains the structure of the game interface.
- **CSS**: `front/styles/style.css` - Defines the styling and animations for the game.
- **JavaScript**: `front/scripts/script.js` - Manages the game logic, WebSocket connections, and DOM manipulations.

### Backend
Located in the `backend/` directory, the backend is a Node.js application using Express.js and Socket.IO for real-time communication.

#### Key Components:
- **Node.js**: Handles the server-side logic and WebSocket events.
- **Express.js**: Used for setting up the server.
- **Socket.IO**: Manages real-time communication between the clients and the server.

## Dependencies
- `cors`: Allows cross-origin requests.
- `express`: Framework for creating server-side applications.
- `ip`: Utility for retrieving the server's IP address.
- `socket.io`: Enables real-time bidirectional event-based communication.

## Functionality

### Team Selection
Users can switch teams using a toggle. This choice is managed by event listeners in the frontend and communicated to the backend to update team memberships.

### Score Increment
Clicking within a team's area triggers a score increment for that team. This is handled by the increment function in the frontend and communicated via Socket.IO.

### Power-Ups
Random power-ups (💣 for bombs and ⭐ for stars) appear and fall from the top of the page. Clicking a power-up activates its effect:
- **Bomb (💣)**: Temporarily reduces the team's score increment rate by half.
- **Star (⭐)**: Doubles the team's score increment rate.

### Real-Time Updates
The game's state, including scores and team memberships, is updated in real-time across all connected clients using WebSocket events.

## Setup and Running

### Backend
Navigate to the `backend/` directory and install dependencies:

## Developer Team
- [**@IDRAYNAR**](https://github.com/IDRAYNAR)
- [**@EstebanQui**](https://github.com/EstebanQui)

## License
Released under [MIT](/LICENSE) by [@EstebanQui](https://github.com/EstebanQui).
