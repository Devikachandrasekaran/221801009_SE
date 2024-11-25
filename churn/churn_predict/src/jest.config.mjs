export default {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest", // Use Babel for transforming JavaScript/TypeScript files
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios)/)" // Allow Jest to transform axios
    ]
  };
  