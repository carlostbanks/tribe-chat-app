# Tribe Chat App

A chat application built with React Native as part of a take-home assignment.

## Features

- Real-time messaging
- Message grouping for consecutive messages
- Image support
- Message reactions
- Edit indicators
- Styled message bubbles (blue for user, white for others)

## Setup

1. Clone this repo
2. Run `npm install`
3. Run `npx expo start`
4. Press 'i' to open in iOS simulator

## Built With

- React Native / Expo
- TypeScript
- Zustand
- Axios

## Structure

```
src/
  ├── api/         # Server communication
  ├── components/  # Chat components 
  ├── store/       # Data management
  └── types/       # Type definitions
```

## Notes

Built for Tribe's technical assessment. The app connects to their test server which simulates a chat room with multiple users.