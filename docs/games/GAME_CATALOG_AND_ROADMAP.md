# Game Catalog, Genres, Modes & Expansion
**Status:** Draft · **Owner:** Product & Game Platform

## Product categories
| Domain | Titles / examples | Reusable capability |
|---|---|---|
| Classic / abstract | Gomoku, Connect Four, Chess, Xiangqi, Checkers, Reversi, Mancala | grid, legal moves, turn |
| Dice / race | Ludo, Snakes & Ladders, Backgammon | dice RNG, move track |
| Card / domino | Domino, Memory Match, original color-matching games | shuffle, private player view |
| Modern strategy | resource allocation, trading, route building, tile placement | economies, placements |
| Puzzle | Sudoku, Nonogram, Tangram, 2048, constraint puzzles | level generator, validator |
| Party / social | drawing/guess, quiz teams, word challenges | rooms, prompts, voting |
| Education | RoboRoute, Logic Islands, Pattern Forge, Data Detective, Eco City Lab, Bridge Builder | evidence, curriculum, rubric |
| Coding | Blockly robot, algorithm arena, code maze, debugging | AST, runner, problem versions, tests |

## 8 initial classic titles
Gomoku; Connect Four; Checkers; Reversi; Chess; Ludo; Snakes & Ladders; Memory Match. Expand with Xiangqi, Domino, Mancala, Sudoku as wave two.

## 6 education titles
- EDU-01 RoboRoute: commands, sequencing, loops, algorithms.
- EDU-02 Logic Islands: AND/OR, branching, decisions.
- EDU-03 Pattern Forge: patterns and abstraction.
- EDU-04 Data Detective: evidence and data.
- EDU-05 Eco City Lab: city systems, resources and sustainability.
- EDU-06 Bridge Builder: design constraints, test and iteration.

## Release mechanics
Each game has immutable game_version, rulepack, score policy and asset manifest. Supports solo, local, online, teams, classroom, private tournaments according to capabilities. All game logic is authoritative server-side and hidden information is removed from player projections.

## Copyright
Review licenses for all implementations and asset packs. Traditional mechanics do not authorize copying copyrighted texts, distinctive art or modern branded adaptations.

## Growth
Stage 1: two different engine families and core platform. Stage 2: 8 classic + 6 education with shared services. Stage 3: tournaments, creators and puzzle/party families. Stage 4: Coding Arena and third-party content under reviewed plugins.
